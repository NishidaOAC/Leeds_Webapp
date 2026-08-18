const express = require('express');
const router = express.Router();
const supplierCtrl = require('../controllers/supplier.controller');
const upload = require('../middlewares/multerConfig'); 
const emailController = require('../controllers/email.controller');
const { authenticateToken } = require('../middlewares/authToken');


// UPDATED: Changed qualityDoc to qualityDocs and increased maxCount
const cpUpload = upload.fields([
  { name: 'evaluationDoc', maxCount: 1 },
  { name: 'qualityDocs', maxCount: 10 },
  { name: 'supportDocs', maxCount: 10 } // Allow up to 10 certifications
]);

const runExpiryJob = require('../controllers/expiryNotifier.job');

router.get('/trigger-expiry-job', async (req, res) => {
    try {
        await runExpiryJob();
        res.json({ message: "Expiry job executed successfully. Check your terminal logs." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Individual compliance document removal endpoint
router.delete('/documents/:documentId', supplierCtrl.deleteSupplierDocument);

router.post('/email-preview', emailController.getEmailPreview);

// Registration and List
router.post('/send-reminder', emailController.sendRenewalEmail);
router.post('/register',authenticateToken, cpUpload, supplierCtrl.onboardSupplier);

router.get('/', supplierCtrl.getAllSuppliers);
router.get('/paginated', supplierCtrl.getPaginatedAllSuppliers);
router.get('/expirycurrentmonth', supplierCtrl.getAllSuppliersExpiryinCurrentmonth);
router.delete('/:id', supplierCtrl.deleteSupplier);
router.get('/onboardingStatuses', supplierCtrl.getOnboardingStatuses);
router.get('/qualified-list', supplierCtrl.getQualifiedSuppliers);

// UPDATED: Update route also needs to support the plural 'qualityDocs'


//  Updated routes configuration:
router.put('/:id', upload.fields([
  { name: 'evaluationDoc', maxCount: 1 },
  { name: 'qualityDocs', maxCount: 10 },
  { name: 'supportDocs', maxCount: 10 } // 👈 Add this field explicitly here!
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