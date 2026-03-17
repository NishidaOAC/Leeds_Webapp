//const Customer = require("../models/customer.model");
// const Document = require("../models/document.model");
const { sequelize } = require('../config/database');
const s3Service = require('../services/s3Service');
const { Customer, Document } = require('../models/index'); 

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [{
        model: Document,
        as: 'Documents',
        attributes: [
          'id', 's3Key', 'documentType', 'fileName', 
          'fileSize', 'mimeType', 'validFrom', 'validTo', 
          'isOneTime', 'status', 'remarks', 
          'createdAt', 'updatedAt' 
        ]
      }],
      order: [
        // 1. Sort Customers: Newest first
        ['createdAt', 'DESC'], 
        
        // 2. Sort Documents inside each customer: Newest first
        [{ model: Document, as: 'Documents' }, 'createdAt', 'DESC']
      ]
    });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching customers", 
      error: error.message 
    });
  }
};
exports.createCustomer = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        // 'metadata' is sent as a JSON string via FormData
        const { name, customerType, metadata } = req.body;
        const parsedMetadata = metadata ? JSON.parse(metadata) : [];
        const files = req.files; 

        // 1. Create Customer
        const newCustomer = await Customer.create(
            { name, customerType, isActive: true },
            { transaction }
        );

        if (files && files.length > 0) {
            // 2. Upload files and map to Document records
            const documentPromises = files.map(async (file, index) => {
                // Upload to S3
                const { s3Key, fileName } = await s3Service.uploadToS3(file, newCustomer.id);
                
                // Get the specific metadata for this file from the parsed array
                // The frontend ensures the order of 'files' matches the order of 'metadata'
                const meta = parsedMetadata[index] || {};

                return {
                    customerId: newCustomer.id,
                    documentType: meta.documentType || 'KYC',
                    s3Key: s3Key,
                    fileName: fileName,
                    fileSize: file.size, // From multer
                    mimeType: file.mimetype, // From multer
                    validFrom: meta.validFrom || new Date(),
                    validTo: meta.validTo || null,
                    isOneTime: meta.isOneTime || false,
                    status: meta.status || 'ACTIVE',
                    remarks: meta.remarks || null // CAPTURED REMARKS
                };
            });

            const documentRecords = await Promise.all(documentPromises);
            
            // 3. Bulk Create Documents
            await Document.bulkCreate(documentRecords, { transaction });
        }

        await transaction.commit();
        res.status(201).json({ 
            success: true, 
            message: 'Customer created with S3 documents and metadata' 
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("S3/DB Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// 4. View Document Logic
// controllers/customer.controller.js

exports.viewDocument = async (req, res) => {
    try {
        // Must match the name used in the route :documentId
        const { documentId } = req.params; 
        const document = await Document.findByPk(documentId);

        if (!document || !document.s3Key) {
            return res.status(404).json({ message: "Document or S3 Key not found" });
        }

        const url = await s3Service.getPresignedViewUrl(document.s3Key);
        res.json({ success: true, url: url });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// Get single customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        // const customer = await Customer.findByPk(req.params.id);
        const customer = await Customer.findByPk(req.params.id, {
      // THIS IS THE MISSING PART:
      include: [{
        model: Document,
        as: 'Documents' // Ensure this matches your model association alias
      }]
    });
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customer", error: error.message });
    }
};

// Update customer
exports.updateCustomer = async (req, res) => {
    try {
        const [updated] = await Customer.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) return res.status(404).json({ message: "Customer not found" });
        
        const updatedCustomer = await Customer.findByPk(req.params.id);
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ message: "Update failed", error: error.message });
    }
};

// Delete (or Deactivate) customer
exports.deleteCustomer = async (req, res) => {
    try {
        const deleted = await Customer.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ message: "Customer not found" });
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
};