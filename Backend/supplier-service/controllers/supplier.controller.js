
const { sequelize } = require('../config/database');
const s3Service = require('../services/s3Service.js');
const { Supplier, SupplierDocument } = require('../models/index'); 
const OnboardingStatus = require('../models/OnboardingStatus.js');
const moment = require('moment');
exports.onboardSupplier = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { 
            name, email, hasQualityCert, hasSefAndTradeRef, 
            manualExpiryDate, poNumber, poDate, tradeReferences 
        } = req.body;

        const isCertified = hasQualityCert === 'true' || hasQualityCert === true;
        const hasRefs = hasSefAndTradeRef === 'true' || hasSefAndTradeRef === true;

        // 1. Logic for Status
        let statusCode;
        let initialReviewer = 'SALES';

        if (isCertified) {
            statusCode = 'ONE_YEAR';
            initialReviewer = 'QUALITY'; 
        } else if (hasRefs) {
            statusCode = 'ONE_TIME';
        } else {
            statusCode = 'CONDITIONAL';
        }

        const statusRecord = await OnboardingStatus.findOne({ where: { code: statusCode } });

        // 2. Generate Internal Supplier Number
        const count = await Supplier.count();
        const internalNo = `SUP-${moment().format('YY')}-${(count + 1).toString().padStart(4, '0')}`;

        // 3. Create Supplier 
        const supplier = await Supplier.create({
            name,
            email,
            internalSupplierNumber: internalNo,
            hasQualityCert: isCertified,
            hasSefAndTradeRef: hasRefs,
            currentReviewer: initialReviewer,
            status: 'PENDING',
            onboardingStatusId: statusRecord?.id,
            expiryDate: manualExpiryDate || (isCertified ? moment().add(1, 'year').toDate() : null),
            poNumber: !isCertified ? poNumber : null,
            poDate: !isCertified ? poDate : null,
            tradeReferences: tradeReferences ? JSON.parse(tradeReferences) : null
        }, { transaction });

        // 4. Handle S3 Uploads & SupplierDocument Records
        const documentRecords = [];

        // Check for Evaluation Document (Mandatory in most flows)
        if (req.files && req.files.evaluationDoc) {
            const file = req.files.evaluationDoc[0];
            const uploadResult = await s3Service.uploadToS3(file, supplier.id);
            
            documentRecords.push({
                supplierId: supplier.id,
                documentType: 'EVALUATION',
                fileName: file.originalname,
                fileUrl: uploadResult.s3Key, // Store the S3 Key here
                status: 'ACTIVE'
            });
        }

        // Check for Quality Certificate (Only if isCertified)
        if (isCertified && req.files.qualityDoc) {
            const file = req.files.qualityDoc[0];
            const uploadResult = await s3Service.uploadToS3(file, supplier.id);

         // Inside your onboardSupplier function, when creating documentRecords:
documentRecords.push({
    supplierId: supplier.id,
    documentType: 'EVALUATION',
    fileName: file.originalname,
    fileUrl: uploadResult.s3Key, // This is what the DB shows currently
    s3Key: uploadResult.s3Key,   // ADD THIS: Populate the s3Key column explicitly
    status: 'ACTIVE'
});
        }

        // Save document metadata to DB
        if (documentRecords.length > 0) {
            await SupplierDocument.bulkCreate(documentRecords, { transaction });
        }

        await transaction.commit();

        // 5. Response
        res.status(201).json({ 
            success: true, 
            supplierId: supplier.id,
            internalSupplierNumber: supplier.internalSupplierNumber,
            assignedStatus: statusCode,
            documentsUploaded: documentRecords.length
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Onboarding Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.onboardSuppliery = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { 
            name, email, hasQualityCert, hasSefAndTradeRef, 
            manualExpiryDate, poNumber, poDate, tradeReferences 
        } = req.body;

        const isCertified = hasQualityCert === 'true' || hasQualityCert === true;
        const hasRefs = hasSefAndTradeRef === 'true' || hasSefAndTradeRef === true;

        // 1. Logic for Status
        let statusCode;
        let initialReviewer = 'SALES';

        if (isCertified) {
            statusCode = 'ONE_YEAR';
            initialReviewer = 'QUALITY'; 
        } else if (hasRefs) {
            statusCode = 'ONE_TIME';
        } else {
            statusCode = 'CONDITIONAL';
        }

        const statusRecord = await OnboardingStatus.findOne({ where: { code: statusCode } });

        // 2. Generate Internal Supplier Number (FIXES THE UNDEFINED ISSUE)
        const count = await Supplier.count();
        const internalNo = `SUP-${moment().format('YY')}-${(count + 1).toString().padStart(4, '0')}`;

        // 3. Create Supplier 
        // NOTE: Use camelCase keys here because underscored: true handles the DB mapping
        const supplier = await Supplier.create({
            name,
            email,
            internalSupplierNumber: internalNo, // Explicitly setting this
            hasQualityCert: isCertified,
            hasSefAndTradeRef: hasRefs,
            currentReviewer: initialReviewer,
            status: 'PENDING',
            onboardingStatusId: statusRecord?.id, // Ensure this matches the model property name
            expiryDate: manualExpiryDate || (isCertified ? moment().add(1, 'year').toDate() : null),
            poNumber: !isCertified ? poNumber : null,
            poDate: !isCertified ? poDate : null,
            tradeReferences: tradeReferences ? JSON.parse(tradeReferences) : null
        }, { transaction });

        await transaction.commit();

        res.status(201).json({ 
            success: true, 
            supplierId: supplier.id,
            internalSupplierNumber: supplier.internalSupplierNumber, // Send back to frontend
            assignedStatus: statusCode 
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Onboarding Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * 2. GET ALL SUPPLIERS (With Documents)
 */
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll({
            include: [
                {
                    model: SupplierDocument,
                    as: 'Documents',
                    attributes: ['id', 's3Key', 'fileUrl', 'documentType', 'fileName', 'status', 'created_at']
                },
                {
                    // POPULATE THE STATUS DETAILS HERE
                    model: OnboardingStatus, 
                   as: 'OnboardingStatus',
                 
                    attributes: ['id', 'code', 'label', 'requiresPo'] 
                }
            ],
            order: [['created_at', 'DESC']] // Optional: show newest first
        });
        
        res.status(200).json(suppliers);
    } catch (error) {
        console.error("Fetch Suppliers Error:", error);
        res.status(500).json({ message: "Error fetching suppliers", error: error.message });
    }
};

/**
 * 3. VIEW DOCUMENT (S3 Pre-signed URL)
exports.viewSupplierDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const document = await SupplierDocument.findByPk(documentId);

        if (!document || !document.s3Key || document.s3Key === 'N/A') {
            return res.status(404).json({ message: "S3 document not found" });
        }

        // Generate pre-signed URL from your s3Service
        const url = await s3Service.getPresignedViewUrl(document.s3Key);
        res.json({ success: true, url: url });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; */

exports.viewSupplierDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const document = await SupplierDocument.findByPk(documentId);

        // Logic check: Try s3Key first, then fallback to fileUrl
        const path = document?.s3Key || document?.fileUrl;

        if (!document || !path || path === 'N/A') {
            console.error(`Preview failed for Doc ID ${documentId}: No path found.`);
            return res.status(404).json({ message: "S3 document not found" });
        }

        const url = await s3Service.getPresignedViewUrl(path);
        res.json({ success: true, url: url });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    try {
        // 1. Check if supplier exists
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }

        // 2. Optional: Delete associated files from S3 first
        const documents = await SupplierDocument.findAll({ where: { supplierId: id } });
        for (const doc of documents) {
            if (doc.s3Key && doc.s3Key !== 'TEXT_ONLY') {
                await s3Service.deleteFile(doc.s3Key); 
            }
        }

        // 3. Delete Related Records (If not using ON DELETE CASCADE in DB)
        await SupplierDocument.destroy({ where: { supplierId: id }, transaction });
        
        // 4. Delete the Supplier
        await Supplier.destroy({ where: { id: id }, transaction });

        await transaction.commit();
        
        res.status(200).json({ 
            success: true, 
            message: `Supplier ${supplier.internalSupplierNumber} and all associated data deleted successfully.` 
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Delete Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


/**
 * UPDATE EXISTING SUPPLIER (For Renewals/Watchlist)
 */
/**
 * UPDATE EXISTING SUPPLIER (Handles Text & Files)
 */
exports.updateSupplier = async (req, res) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    
    try {
        const { 
            name, email, hasQualityCert, hasSefAndTradeRef, 
            expiryDate, poNumber, poDate, tradeReferences 
        } = req.body;

        const isCertified = hasQualityCert === 'true' || hasQualityCert === true;

        // 1. Update the main Supplier record
        await Supplier.update({
            name,
            email,
            hasQualityCert: isCertified,
            hasSefAndTradeRef: hasSefAndTradeRef === 'true',
            expiryDate: expiryDate,
            poNumber: !isCertified ? poNumber : null,
            poDate: !isCertified ? poDate : null,
            tradeReferences: tradeReferences ? JSON.parse(tradeReferences) : null,
            status: 'PENDING' 
        }, { where: { id: id }, transaction });

        // 2. Handle File Updates (Delete Old -> Upload New)
        const documentRecords = [];

        if (req.files) {
            const processFileUpdate = async (fileArray, docType) => {
                if (fileArray && fileArray.length > 0) {
                    const file = fileArray[0];

                    // --- NEW: CLEANUP LOGIC ---
                    // 1. Find the old document record
                    const oldDoc = await SupplierDocument.findOne({
                        where: { supplierId: id, documentType: docType }
                    });

                    if (oldDoc) {
                        // 2. Delete file from S3
                        if (oldDoc.s3Key) {
                            await s3Service.deleteFile(oldDoc.s3Key).catch(err => 
                                console.error(`S3 Delete Failed for ${oldDoc.s3Key}:`, err)
                            );
                        }
                        // 3. Remove old record from DB
                        await oldDoc.destroy({ transaction });
                    }
                    // --- END CLEANUP ---

                    // 4. Upload New File
                    const uploadResult = await s3Service.uploadToS3(file, id);
                    
                    documentRecords.push({
                        supplierId: id,
                        documentType: docType,
                        fileName: file.originalname,
                        fileUrl: uploadResult.s3Key,
                        s3Key: uploadResult.s3Key,
                        status: 'ACTIVE'
                    });
                }
            };

            // Process Evaluation Document replacement
            if (req.files.evaluationDoc) {
                await processFileUpdate(req.files.evaluationDoc, 'EVALUATION');
            }

            // Process Quality Certificate replacement
            if (isCertified && req.files.qualityDoc) {
                await processFileUpdate(req.files.qualityDoc, 'QUALITY_CERT');
            }
        }

        // 3. Save new document records to DB
        if (documentRecords.length > 0) {
            await SupplierDocument.bulkCreate(documentRecords, { transaction });
        }

        await transaction.commit();
        res.json({ 
            success: true, 
            message: "Supplier updated. Old documents replaced successfully.",
            replacedCount: documentRecords.length 
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};




exports.approveSupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const supplier = await Supplier.findByPk(supplierId);

    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    // The expiryDate was already defined during the "onboardSupplier" phase
    // based on your manual input or the certificates.
    await supplier.update({
      status: 'APPROVED',
      isActive: true
      // No need to change expiryDate here, keep the manual one entered earlier
    });

    res.json({ 
        message: `Supplier Approved as ${supplier.onboardingStatusId}`, 
        validUntil: supplier.expiryDate 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getOnboardingStatuses = async (req, res) => {
    try {
        const statuses = await OnboardingStatus.findAll({
            order: [['id', 'ASC']]
        });
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching statuses" });
    }
};