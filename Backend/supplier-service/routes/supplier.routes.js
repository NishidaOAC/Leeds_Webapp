const express = require('express');
const router = express.Router();
const supplierCtrl = require('../controllers/supplier.controller');
const upload = require('../middlewares/multerConfig'); 

// UPDATED: Changed qualityDoc to qualityDocs and increased maxCount
const cpUpload = upload.fields([
  { name: 'evaluationDoc', maxCount: 1 },
  { name: 'qualityDocs', maxCount: 10 } // Allow up to 10 certifications
]);

// Registration and List
router.post('/register', cpUpload, supplierCtrl.onboardSupplier);

router.get('/', supplierCtrl.getAllSuppliers);
router.get('/expirycurrentmonth', supplierCtrl.getAllSuppliersExpiryinCurrentmonth);
router.delete('/:id', supplierCtrl.deleteSupplier);
router.get('/onboardingStatuses', supplierCtrl.getOnboardingStatuses);

// UPDATED: Update route also needs to support the plural 'qualityDocs'
router.put('/:id', upload.fields([
  { name: 'evaluationDoc', maxCount: 1 }, 
  { name: 'qualityDocs', maxCount: 10 }
]), supplierCtrl.updateSupplier);

// Approval and Document Preview
router.put('/approve/:supplierId', supplierCtrl.approveSupplier);
router.get('/document/:documentId', supplierCtrl.viewSupplierDocument);


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


module.exports = router;