const express = require('express');
const router = express.Router();
const supplierCtrl = require('../controllers/supplier.controller');
const upload = require('../middlewares/multerConfig'); 

const cpUpload = upload.fields([
  { name: 'evaluationDoc', maxCount: 1 },
  { name: 'qualityDoc', maxCount: 1 }
]);

// Registration and List
router.post('/register', cpUpload, supplierCtrl.onboardSupplier);
router.get('/', supplierCtrl.getAllSuppliers);

// --- ADD THESE TWO ROUTES ---
// 1. Fetch single supplier for the Audit page
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Supplier, SupplierDocument } = require('../models/index');
        const supplier = await Supplier.findByPk(id, {
            include: [{ model: SupplierDocument, as: 'Documents' }]
        });
        if (!supplier) return res.status(404).json({ message: "Supplier not found" });
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Approval endpoint
router.put('/approve/:supplierId', supplierCtrl.approveSupplier);

// Document Preview
router.get('/document/:documentId', supplierCtrl.viewSupplierDocument);

module.exports = router;