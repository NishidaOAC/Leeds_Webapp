
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

        // 1. Logic Implementation for 3 Types of Status
        let statusCode;
        let initialReviewer = 'SALES';

        if (isCertified) {
            // Tier 1: Quality Certificate exists
            statusCode = 'ONE_YEAR';
            initialReviewer = 'QUALITY'; 
        } else if (hasRefs) {
            // Tier 2: No Quality, but has SEF/Trade Refs
            statusCode = 'ONE_TIME';
        } else {
            // Tier 3: Rare Case (No Quality, No SEF, No Refs)
            statusCode = 'CONDITIONAL';
        }

        const statusRecord = await OnboardingStatus.findOne({ where: { code: statusCode } });

        // 2. Handle Expiry Date (Priority: Manual > Logic)
        // You mentioned: better to type manual because certs might expire soon
        let finalExpiry = manualExpiryDate; 
        
        if (!finalExpiry && statusCode === 'ONE_YEAR') {
            // Default to 1 year if they forgot to type it for a Quality Supplier
            finalExpiry = moment().add(1, 'year').format('YYYY-MM-DD');
        }

        // 3. Create Supplier
        const supplier = await Supplier.create({
            name,
            email,
            hasQualityCert: isCertified,
            hasSefAndTradeRef: hasRefs,
            currentReviewer: initialReviewer,
            status: 'PENDING',
            onboardingStatusId: statusRecord?.id,
            expiryDate: finalExpiry,
            // Only store PO details if NOT a one-year approval
            poNumber: statusCode !== 'ONE_YEAR' ? poNumber : null,
            poDate: statusCode !== 'ONE_YEAR' ? poDate : null,
            tradeReferences: tradeReferences ? JSON.parse(tradeReferences) : null
        }, { transaction });

        // [Insert your S3 File Upload Logic Here]

        await transaction.commit();
        res.status(201).json({ 
            success: true, 
            supplierId: supplier.id,
            assignedStatus: statusCode 
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
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