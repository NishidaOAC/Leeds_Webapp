
const { sequelize } = require('../config/database');
const s3Service = require('../services/s3Service.js');
const { Supplier, SupplierDocument } = require('../models/index'); 


exports.onboardSupplier = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, email, hasQualityCert, tradeRefs } = req.body;
        const files = req.files; 
        const isCertified = hasQualityCert === 'true';

        // 1. Logic: Expiry & Reviewer
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);
        const initialReviewer = isCertified ? 'QUALITY' : 'SALES';

        // 2. Create Supplier
        const supplier = await Supplier.create({
            name,
            email,
            hasQualityCert: isCertified,
            currentReviewer: initialReviewer,
            expiryDate: expiry,
            status: 'PENDING'
        }, { transaction });

        // 3. Update Internal ID
        const internalNo = `SUP-2026-${supplier.id.toString().substring(0, 5).toUpperCase()}`;
        await supplier.update({ internalSupplierNumber: internalNo }, { transaction });

        // 4. Handle S3 Uploads
        const documentRecords = [];
        if (files) {
            const fileEntries = [
                { key: 'evaluationDoc', type: 'EVALUATION' },
                { key: 'qualityDoc', type: 'QUALITY_CERT' }
            ];

            for (const entry of fileEntries) {
                if (files[entry.key]) {
                    const file = files[entry.key][0];
                    const { s3Key, fileName } = await s3Service.uploadToS3(file, supplier.id);

                    documentRecords.push({
                        supplierId: supplier.id,
                        documentType: entry.type,
                        s3Key: s3Key,
                        fileName: fileName,
                        fileUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${s3Key}`, // Map to fileUrl
                        remarks: `Uploaded via ${entry.key}`
                    });
                }
            }
        }

        // 5. Handle Trade Refs (Prevents Null FileUrl Error)
        if (!isCertified && tradeRefs) {
            documentRecords.push({
                supplierId: supplier.id,
                documentType: 'TRADE_REF',
                s3Key: 'TEXT_ONLY',
                fileName: 'Trade_References.txt',
                fileUrl: 'internal://trade-references', // Placeholder to satisfy model NOT NULL
                remarks: tradeRefs
            });
        }

        // 6. Bulk Insert
        if (documentRecords.length > 0) {
            await SupplierDocument.bulkCreate(documentRecords, { transaction });
        }

        await transaction.commit();
        res.status(201).json({ success: true, internalNumber: internalNo });

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
            include: [{
                model: SupplierDocument,
                as: 'Documents',
                attributes: ['id', 's3Key', 'documentType', 'fileName', 'status', 'created_at']
            }]
        });
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching suppliers", error: error.message });
    }
};

/**
 * 3. VIEW DOCUMENT (S3 Pre-signed URL)
 */
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
};




exports.approveSupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const supplier = await Supplier.findByPk(supplierId);

    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    let expiry;
    if (supplier.hasQualityCert) {
      // Verified Team: 1 Year Approval
      expiry = moment().add(1, 'year').toDate();
    } else {
      // Not Verified: One-time approval (set to end of current day or short window)
      expiry = moment().endOf('day').toDate();
    }

    await supplier.update({
      status: 'APPROVED',
      expiryDate: expiry,
      isActive: true
    });

    res.json({ message: "Supplier Approved", expiryDate: expiry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};