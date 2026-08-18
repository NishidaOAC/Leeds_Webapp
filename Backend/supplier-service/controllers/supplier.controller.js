
const { sequelize } = require('../config/database');
const s3Service = require('../services/s3Service.js');
const { Supplier, SupplierDocument } = require('../models/index');
const OnboardingStatus = require('../models/OnboardingStatus.js');
const moment = require('moment');
const { Op } = require('sequelize');
// 🟢 FIXED CODE: Keep only this single import at the top of index.js
const { initExpiryJob, checkExpiringSuppliers } = require('./expiryNotifier.job');

// 🔴 REMOVE THIS LINE completely from index.js:
// require('./controllers/expiryNotifier.job');





exports.onboardSupplier = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        console.log("DECED TOKEN PAYLOAD (req.user):", req.user);
        // controllers/supplierController.js
        const addedBy = req.user?.id || req.user?.userId || req.user?.sub || req.user?.user?.id;

        if (!addedBy) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID not found in authorization token."
            });
        }

        const {
            name, email, hasQualityCert, hasSefAndTradeRef,
            expiryDate, poNumber, poDate, tradeReferences,
            qualityDocNames, supportDocDescriptions, // 👈 Added support doc descriptions array
            onboardingStatusId
        } = req.body;

        // 1. PRE-CHECK FOR DUPLICATE EMAIL
        const existingEmail = await Supplier.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: `The email ${email} is already registered to another supplier.`
            });
        }

        const isCertified = hasQualityCert === 'true' || hasQualityCert === true;
        const hasRefs = hasSefAndTradeRef === 'true' || hasSefAndTradeRef === true;

        // 2. Logic for Status & ID Generation
        let statusRecord;
        if (onboardingStatusId) {
            statusRecord = await OnboardingStatus.findByPk(onboardingStatusId);
        }

        if (!statusRecord) {
            let statusCode = isCertified ? 'LONG_TERM' : (hasRefs ? 'ONE_TIME' : 'CONDITIONAL');
            statusRecord = await OnboardingStatus.findOne({ where: { code: statusCode } });
        }

        let initialReviewer = isCertified ? 'QUALITY' : 'SALES';

        const lastSupplier = await Supplier.findOne({
            where: { internalSupplierNumber: { [Op.like]: 'LAD/AS/%' } },
            order: [['internalSupplierNumber', 'DESC']],
            transaction
        });

        let nextSequence = 1;
        if (lastSupplier) {
            const parts = lastSupplier.internalSupplierNumber.split('/');
            if (parts.length === 3) nextSequence = parseInt(parts[2], 10) + 1;
        }

        const internalNo = `LAD/AS/${nextSequence.toString().padStart(2, '0')}`;

        // 3. Handle Files and Metadata Prep
        const documentRecords = [];
        const certsJsonData = [];
        const supportDocsJsonData = []; // 👈 Added JSON array payload tracer

        // --- 1. Evaluation Document (SAF) ---
        if (req.files && req.files.evaluationDoc) {
            const file = req.files.evaluationDoc[0];
            const uploadResult = await s3Service.uploadToS3(file, internalNo);

            documentRecords.push({
                documentType: 'SAF',
                fileName: file.originalname,
                fileUrl: uploadResult.s3Key,
                s3Key: uploadResult.s3Key,
                status: 'ACTIVE'
            });
        }

        // --- 2. Multiple Quality Certificates ---
        if (isCertified && req.files && req.files.qualityDocs) {
            const files = req.files.qualityDocs;
            const names = Array.isArray(qualityDocNames) ? qualityDocNames : [qualityDocNames];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const customName = names[i] || `Cert_${i + 1}`;
                const uploadResult = await s3Service.uploadToS3(file, internalNo);

                documentRecords.push({
                    documentType: 'QUALITY_CERT',
                    fileName: customName,
                    fileUrl: uploadResult.s3Key,
                    s3Key: uploadResult.s3Key,
                    status: 'ACTIVE'
                });

                certsJsonData.push({
                    type: customName,
                    fileName: file.originalname,
                    s3Key: uploadResult.s3Key
                });
            }
        }

        // --- 3. Multiple Additional Support Documents (One-Time / Conditional cases) ---
        if (!isCertified && req.files && req.files.supportDocs) {
            const files = req.files.supportDocs;
            const descriptions = Array.isArray(supportDocDescriptions) ? supportDocDescriptions : [supportDocDescriptions];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const customDescription = descriptions[i] || `Support_Doc_${i + 1}`;
                const uploadResult = await s3Service.uploadToS3(file, internalNo);

                documentRecords.push({
                    documentType: 'SUPPORT_DOC', // 👈 Tracked variant inside table mapping
                    fileName: customDescription,
                    fileUrl: uploadResult.s3Key,
                    s3Key: uploadResult.s3Key,
                    status: 'ACTIVE'
                });

                supportDocsJsonData.push({
                    description: customDescription,
                    fileName: file.originalname,
                    s3Key: uploadResult.s3Key,
                    uploadedAt: new Date()
                });
            }
        }

        // 4. Create Supplier
        const supplier = await Supplier.create({
            name,
            email,
            internalSupplierNumber: internalNo,
            hasQualityCert: isCertified,
            certifications: certsJsonData,
            additionalDocuments: supportDocsJsonData, // 👈 Saved directly to JSON payload field block
            hasSefAndTradeRef: hasRefs,
            currentReviewer: initialReviewer,
            status: 'PENDING',
            onboardingStatusId: statusRecord ? statusRecord.id : null,
            expiryDate: expiryDate || (isCertified ? moment().add(1, 'year').toDate() : null),
            poNumber: !isCertified ? poNumber : null,
            poDate: !isCertified ? poDate : null,

            tradeReferences: tradeReferences ? (typeof tradeReferences === 'string' ? JSON.parse(tradeReferences) : tradeReferences) : null,
            addedBy
        }, { transaction });

        // 5. Link documents to created Supplier
        if (documentRecords.length > 0) {
            const finalDocs = documentRecords.map(doc => ({ ...doc, supplierId: supplier.id }));
            await SupplierDocument.bulkCreate(finalDocs, { transaction });
        }

        await transaction.commit();

        checkExpiringSuppliers().catch(err => 
            console.error("[ONBOARD SUPPLIER] Expiry check error:", err.message)
        );


        res.status(201).json({
            success: true,
            supplierId: supplier.id,
            internalSupplierNumber: supplier.internalSupplierNumber,
            assignedStatus: statusRecord ? statusRecord.code : 'UNKNOWN',
            documentsUploaded: documentRecords.length
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Onboarding Error:", error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ success: false, message: "A supplier with this Email or ID already exists." });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getQualifiedSuppliers = async (req, res) => {
    try {
        const today = new Date();

        const qualifiedSuppliers = await Supplier.findAll({
            where: {
                isActive: true,
                // CHECK WITH DATE ONLY: Either expiryDate is NULL OR expiryDate >= Today
                [Op.or]: [
                    { expiryDate: null },
                    { expiryDate: { [Op.gte]: today } }
                ]
            },
            attributes: ['id', 'name', 'email', 'internalSupplierNumber', 'expiryDate', 'hasQualityCert']
        });

        res.status(200).json({
            success: true,
            data: qualifiedSuppliers
        });
    } catch (error) {
        console.error('Error fetching qualified suppliers:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateSupplier = async (req, res) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    try {
        const {
            name, email, hasQualityCert, hasSefAndTradeRef,
            expiryDate, poNumber, poDate, tradeReferences,
            qualityDocNames, existingCerts,
            supportDocDescriptions, existingSupportDocs, // 👈 Added fields for keeping support documents up to date
            onboardingStatusId
        } = req.body;

        const isCertified = hasQualityCert === 'true' || hasQualityCert === true;
        const hasRefs = hasSefAndTradeRef === 'true' || hasSefAndTradeRef === true;

        const currentSupplier = await Supplier.findByPk(id, { transaction });
        if (!currentSupplier) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }

        // --- 1. Synchronize Quality Certs ---
        let keptCerts = [];
        if (existingCerts) {
            keptCerts = typeof existingCerts === 'string' ? JSON.parse(existingCerts) : existingCerts;
        }
        const oldCerts = currentSupplier.certifications || [];
        const certsToDelete = oldCerts.filter(old => !keptCerts.find(k => k.s3Key === old.s3Key));

        for (const cert of certsToDelete) {
            if (cert.s3Key) await s3Service.deleteFile(cert.s3Key).catch(e => console.error(e));
            await SupplierDocument.destroy({ where: { s3Key: cert.s3Key }, transaction });
        }

        // --- 2. Synchronize Additional Support Docs ---
        let keptSupportDocs = [];
        if (existingSupportDocs) {
            keptSupportDocs = typeof existingSupportDocs === 'string' ? JSON.parse(existingSupportDocs) : existingSupportDocs;
        }
        const oldSupportDocs = currentSupplier.additionalDocuments || [];
        const supportDocsToDelete = oldSupportDocs.filter(old => !keptSupportDocs.find(k => k.s3Key === old.s3Key));

        for (const doc of supportDocsToDelete) {
            if (doc.s3Key) await s3Service.deleteFile(doc.s3Key).catch(e => console.error(e));
            await SupplierDocument.destroy({ where: { s3Key: doc.s3Key }, transaction });
        }

        const newDocumentRecords = [];
        const newCertsJson = [...keptCerts];
        const newSupportDocsJson = [...keptSupportDocs]; // 👈 Start with support docs kept in UI

        // --- 3. Handle NEW Quality Certificate Uploads ---
        if (isCertified && req.files && req.files.qualityDocs) {
            const files = req.files.qualityDocs;
            const names = Array.isArray(qualityDocNames) ? qualityDocNames : [qualityDocNames];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const certLabel = names[i] || `Cert_${Date.now()}`;
                const uploadResult = await s3Service.uploadToS3(file, currentSupplier.internalSupplierNumber);

                newDocumentRecords.push({
                    supplierId: id,
                    documentType: 'QUALITY_CERT',
                    fileName: certLabel,
                    fileUrl: uploadResult.s3Key,
                    s3Key: uploadResult.s3Key,
                    status: 'ACTIVE'
                });

                newCertsJson.push({
                    type: certLabel,
                    fileName: file.originalname,
                    s3Key: uploadResult.s3Key,
                    uploadedAt: new Date()
                });
            }
        }

        // --- 4. Handle NEW Additional Support Document Uploads ---
        if (!isCertified && req.files && req.files.supportDocs) {
            const files = req.files.supportDocs;
            const descriptions = Array.isArray(supportDocDescriptions) ? supportDocDescriptions : [supportDocDescriptions];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const docLabel = descriptions[i] || `Support_Doc_${Date.now()}`;
                const uploadResult = await s3Service.uploadToS3(file, currentSupplier.internalSupplierNumber);

                newDocumentRecords.push({
                    supplierId: id,
                    documentType: 'SUPPORT_DOC',
                    fileName: docLabel,
                    fileUrl: uploadResult.s3Key,
                    s3Key: uploadResult.s3Key,
                    status: 'ACTIVE'
                });

                newSupportDocsJson.push({
                    description: docLabel,
                    fileName: file.originalname,
                    s3Key: uploadResult.s3Key,
                    uploadedAt: new Date()
                });
            }
        }

        // --- 5. Handle Mandatory Evaluation Form Replacement ---
        if (req.files && req.files.evaluationDoc) {
            const file = req.files.evaluationDoc[0];
            const oldEval = await SupplierDocument.findOne({ where: { supplierId: id, documentType: 'EVALUATION' }, transaction });

            if (oldEval) {
                await s3Service.deleteFile(oldEval.s3Key).catch(e => console.error(e));
                await oldEval.destroy({ transaction });
            }

            const uploadResult = await s3Service.uploadToS3(file, currentSupplier.internalSupplierNumber);
            newDocumentRecords.push({
                supplierId: id,
                documentType: 'EVALUATION',
                fileName: file.originalname,
                fileUrl: uploadResult.s3Key,
                s3Key: uploadResult.s3Key,
                status: 'ACTIVE'
            });
        }

        // --- 6. Dynamic Status Recalculation ---
        let statusRecord;
        if (onboardingStatusId) {
            statusRecord = await OnboardingStatus.findByPk(onboardingStatusId, { transaction });
        }

        if (!statusRecord) {
            let statusCode = isCertified ? 'LONG_TERM' : (hasRefs ? 'ONE_TIME' : 'CONDITIONAL');
            statusRecord = await OnboardingStatus.findOne({ where: { code: statusCode }, transaction });
        }

        let initialReviewer = isCertified ? 'QUALITY' : 'SALES';

        // --- 7. Final Update Statement ---
        await Supplier.update({
            name,
            email,
            hasQualityCert: isCertified,
            certifications: isCertified ? newCertsJson : [], // Clear certs if path toggled
            additionalDocuments: !isCertified ? newSupportDocsJson : [], // Clear support docs if path toggled
            hasSefAndTradeRef: hasRefs,
            currentReviewer: initialReviewer,
            onboardingStatusId: statusRecord ? statusRecord.id : currentSupplier.onboardingStatusId,
            expiryDate,
            poNumber: !isCertified ? poNumber : null,
            poDate: !isCertified ? poDate : null,
            tradeReferences: tradeReferences ? (typeof tradeReferences === 'string' ? JSON.parse(tradeReferences) : tradeReferences) : null,
            status: 'PENDING'
        }, { where: { id }, transaction });

        if (newDocumentRecords.length > 0) {
            await SupplierDocument.bulkCreate(newDocumentRecords, { transaction });
        }

        await transaction.commit();

        // 2. Trigger notification check asynchronously (won't delay HTTP response)
    // checkExpiringSuppliers().catch(err => 
    //     console.error("[UPDATE SUPPLIER] Expiry check error:", err.message)
    // );

            checkExpiringSuppliers(id).catch(err => 
            console.error("[UPDATE SUPPLIER] Expiry check error:", err.message)
        );

        res.json({
            success: true,
            message: "Sync successful. Old files removed and status updated.",
            assignedStatus: statusRecord ? statusRecord.code : 'UNKNOWN'
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteSupplierDocument = async (req, res) => {
    const { documentId } = req.params;
    const transaction = await sequelize.transaction();

    try {
        const document = await SupplierDocument.findByPk(documentId);
        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        const supplierId = document.supplierId;
        const s3KeyToDelete = document.s3Key;

        // Delete asset file wrapper execution from S3
        if (s3KeyToDelete && s3KeyToDelete !== 'N/A' && s3KeyToDelete !== 'TEXT_ONLY') {
            await s3Service.deleteFile(s3KeyToDelete).catch(err =>
                console.error(`S3 asset deletion failed for key ${s3KeyToDelete}:`, err)
            );
        }

        // Remove row record from DB
        await SupplierDocument.destroy({ where: { id: documentId }, transaction });

        // --- CLEANUP EXTRACTION SECTION ---
        if (document.documentType === 'QUALITY_CERT') {
            const supplier = await Supplier.findByPk(supplierId);
            if (supplier && supplier.certifications) {
                let currentCerts = Array.isArray(supplier.certifications) ? supplier.certifications : JSON.parse(supplier.certifications || '[]');
                const updatedCerts = currentCerts.filter(cert => cert.s3Key !== s3KeyToDelete);
                await Supplier.update({ certifications: updatedCerts }, { where: { id: supplierId }, transaction });
            }
        }
        // 👇 New logic added to clean up the support documents array inside the Supplier row
        else if (document.documentType === 'SUPPORT_DOC') {
            const supplier = await Supplier.findByPk(supplierId);
            if (supplier && supplier.additionalDocuments) {
                let currentDocs = Array.isArray(supplier.additionalDocuments) ? supplier.additionalDocuments : JSON.parse(supplier.additionalDocuments || '[]');
                const updatedDocs = currentDocs.filter(doc => doc.s3Key !== s3KeyToDelete);
                await Supplier.update({ additionalDocuments: updatedDocs }, { where: { id: supplierId }, transaction });
            }
        }

        await transaction.commit();
        res.status(200).json({
            success: true,
            message: "Document deleted successfully from both storage engine and database tracker."
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Document Deletion Error Pipeline:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Keeping all alternative helper routines as they were originally declared







exports.getUpcomingExpiries = async (req, res) => {
    try {
        const today = new Date();
        // Option A: Look ahead 6 months (Recommended)
        const lookAheadDate = new Date();
        lookAheadDate.setMonth(today.getMonth() + 6);

        const suppliers = await Supplier.findAll({
            where: {
                expiryDate: {
                    // This will find everything from Today until 6 months from now
                    [Op.between]: [today, lookAheadDate]
                }
            },
            include: [
                { model: SupplierDocument, as: 'Documents' },
                { model: OnboardingStatus, as: 'OnboardingStatus' }
            ],
            order: [['expiryDate', 'ASC']]
        });

        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};







exports.getAllSuppliersExpiryinCurrentmonth = async (req, res) => {
    try {
        const now = new Date();

        // 💡 Get the last millisecond of the current month explicitly
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-indexed (e.g., July = 6)

        // Setting day to 0 of the NEXT month (month + 1) gives the last day of the CURRENT month
        const endOfCurrentMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

        const suppliers = await Supplier.findAll({
            where: {
                expiryDate: {
                    [Op.lte]: endOfCurrentMonth
                }
            },
            include: [
                { model: SupplierDocument, as: 'Documents' },
                { model: OnboardingStatus, as: 'OnboardingStatus' }
            ],
            order: [['expiryDate', 'ASC']]
        });

        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};


exports.getPaginatedAllSuppliers = async (req, res) => {
    try {
        // 1. Get query params with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        // 2. Define search filter
        const searchCondition = search ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { internalSupplierNumber: { [Op.iLike]: `%${search}%` } }
            ]
        } : {};

        // 3. Use findAndCountAll for pagination data
        const { count, rows } = await Supplier.findAndCountAll({
            where: searchCondition,
            include: [
                {
                    model: SupplierDocument,
                    as: 'Documents',
                    attributes: ['id', 'documentType', 'fileName']
                },
                {
                    model: OnboardingStatus,
                    as: 'OnboardingStatus',
                    attributes: ['id', 'code', 'label']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: limit,
            offset: offset,
            distinct: true // Required when using "include" with pagination
        });

        res.status(200).json({
            totalItems: count,
            suppliers: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

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



exports.updateSupplierOLD = async (req, res) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    try {
        const {
            name, email, hasQualityCert, hasSefAndTradeRef,
            expiryDate, poNumber, poDate, tradeReferences,
            qualityDocNames,
            existingCerts,
            onboardingStatusId // Extract if sent by frontend
        } = req.body;

        const isCertified = hasQualityCert === 'true' || hasQualityCert === true;
        const hasRefs = hasSefAndTradeRef === 'true' || hasSefAndTradeRef === true;

        const currentSupplier = await Supplier.findByPk(id, { transaction });
        if (!currentSupplier) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }

        // 1. Parse existing certs sent from Frontend
        let keptCerts = [];
        if (existingCerts) {
            keptCerts = typeof existingCerts === 'string' ? JSON.parse(existingCerts) : existingCerts;
        }

        // 2. Identify and Delete Certificates that were REMOVED in the UI
        const oldCerts = currentSupplier.certifications || [];
        const certsToDelete = oldCerts.filter(old => !keptCerts.find(k => k.s3Key === old.s3Key));

        for (const cert of certsToDelete) {
            if (cert.s3Key) await s3Service.deleteFile(cert.s3Key).catch(e => console.error(e));
            await SupplierDocument.destroy({ where: { s3Key: cert.s3Key }, transaction });
        }

        // 3. Handle NEW Quality Certificate Uploads
        const newDocumentRecords = [];
        const newCertsJson = [...keptCerts];

        if (isCertified && req.files && req.files.qualityDocs) {
            const files = req.files.qualityDocs;
            const names = Array.isArray(qualityDocNames) ? qualityDocNames : [qualityDocNames];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const certLabel = names[i] || `Cert_${Date.now()}`;

                const uploadResult = await s3Service.uploadToS3(file, currentSupplier.internalSupplierNumber);

                newDocumentRecords.push({
                    supplierId: id,
                    documentType: 'QUALITY_CERT',
                    fileName: certLabel,
                    fileUrl: uploadResult.s3Key,
                    s3Key: uploadResult.s3Key,
                    status: 'ACTIVE'
                });

                newCertsJson.push({
                    type: certLabel,
                    fileName: file.originalname,
                    s3Key: uploadResult.s3Key,
                    uploadedAt: new Date()
                });
            }
        }

        // 4. Handle Mandatory Evaluation Form (Standard Replace)
        if (req.files && req.files.evaluationDoc) {
            const file = req.files.evaluationDoc[0];
            const oldEval = await SupplierDocument.findOne({ where: { supplierId: id, documentType: 'EVALUATION' }, transaction });

            if (oldEval) {
                await s3Service.deleteFile(oldEval.s3Key).catch(e => console.error(e));
                await oldEval.destroy({ transaction });
            }

            const uploadResult = await s3Service.uploadToS3(file, currentSupplier.internalSupplierNumber);
            newDocumentRecords.push({
                supplierId: id,
                documentType: 'EVALUATION',
                fileName: file.originalname,
                fileUrl: uploadResult.s3Key,
                s3Key: uploadResult.s3Key,
                status: 'ACTIVE'
            });
        }

        // --- NEW ADDITION: DYNAMIC STATUS CALCULATION ---
        let statusRecord;
        if (onboardingStatusId) {
            statusRecord = await OnboardingStatus.findByPk(onboardingStatusId, { transaction });
        }

        if (!statusRecord) {
            // Recalculates dynamically based on updated fields
            let statusCode = isCertified ? 'LONG_TERM' : (hasRefs ? 'ONE_TIME' : 'CONDITIONAL');
            statusRecord = await OnboardingStatus.findOne({ where: { code: statusCode }, transaction });
        }

        let initialReviewer = isCertified ? 'QUALITY' : 'SALES';
        // ------------------------------------------------

        // 5. Final Update to Supplier Table
        await Supplier.update({
            name,
            email,
            hasQualityCert: isCertified,
            certifications: newCertsJson,
            hasSefAndTradeRef: hasRefs,
            currentReviewer: initialReviewer, // Updates reviewer role structure
            onboardingStatusId: statusRecord ? statusRecord.id : currentSupplier.onboardingStatusId, // Dynamically links to LONG_TERM id
            expiryDate,
            poNumber: !isCertified ? poNumber : null,
            poDate: !isCertified ? poDate : null,
            tradeReferences: tradeReferences ? (typeof tradeReferences === 'string' ? JSON.parse(tradeReferences) : tradeReferences) : null,
            status: 'PENDING'
        }, { where: { id }, transaction });

        if (newDocumentRecords.length > 0) {
            await SupplierDocument.bulkCreate(newDocumentRecords, { transaction });
        }

        await transaction.commit();
        res.json({
            success: true,
            message: "Sync successful. Old files removed and status updated.",
            assignedStatus: statusRecord ? statusRecord.code : 'UNKNOWN'
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



exports.deleteSupplierDocumentold = async (req, res) => {
    const { documentId } = req.params;
    const transaction = await sequelize.transaction();

    try {
        // 1. Fetch the document record to verify it exists and get its S3 metadata
        const document = await SupplierDocument.findByPk(documentId);

        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        const supplierId = document.supplierId;
        const s3KeyToDelete = document.s3Key;

        // 2. Delete the physical object asset from S3 storage bucket bucket if it exists
        if (s3KeyToDelete && s3KeyToDelete !== 'N/A' && s3KeyToDelete !== 'TEXT_ONLY') {
            await s3Service.deleteFile(s3KeyToDelete).catch(err =>
                console.error(`S3 asset deletion failed for key ${s3KeyToDelete}:`, err)
            );
        }

        // 3. Remove the document database row entry
        await SupplierDocument.destroy({ where: { id: documentId }, transaction });

        // 4. Clean up structural tracking if it's a quality certificate nested inside the Supplier object JSON array
        if (document.documentType === 'QUALITY_CERT') {
            const supplier = await Supplier.findByPk(supplierId);

            if (supplier && supplier.certifications) {
                let currentCerts = Array.isArray(supplier.certifications)
                    ? supplier.certifications
                    : JSON.parse(supplier.certifications || '[]');

                // Filter out the reference using the matching s3Key
                const updatedCerts = currentCerts.filter(cert => cert.s3Key !== s3KeyToDelete);

                await Supplier.update(
                    { certifications: updatedCerts },
                    { where: { id: supplierId }, transaction }
                );
            }
        }

        await transaction.commit();

        res.status(200).json({
            success: true,
            message: "Document deleted successfully from both storage engine and database tracker."
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Document Deletion Error Pipeline:", error);
        res.status(500).json({ success: false, message: error.message });
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