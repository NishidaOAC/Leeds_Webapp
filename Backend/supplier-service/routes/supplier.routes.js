const express = require('express');
const router = express.Router();
const supplierCtrl = require('../controllers/supplier.controller');
const upload = require('../middlewares/multerConfig'); 
const emailController = require('../controllers/email.controller');
const { authenticateToken } = require('../middlewares/authToken');

const cpUpload = upload.fields([
  { name: 'evaluationDoc', maxCount: 1 },
  { name: 'qualityDocs', maxCount: 10 },
  { name: 'supportDocs', maxCount: 10 } 
]);

const runExpiryJob = require('../controllers/expiryNotifier.job');

// ==========================================
// 1. SPECIFIC GET ROUTES (Must be first)
// ==========================================
router.get('/trigger-expiry-job', async (req, res) => {
    try {
        await runExpiryJob();
        res.json({ message: "Expiry job executed successfully. Check your terminal logs." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', supplierCtrl.getAllSuppliers);
router.get('/paginated', supplierCtrl.getPaginatedAllSuppliers);
router.get('/expirycurrentmonth', supplierCtrl.getAllSuppliersExpiryinCurrentmonth);
router.get('/onboardingStatuses', supplierCtrl.getOnboardingStatuses);
router.get('/qualified-list', supplierCtrl.getQualifiedSuppliers);
router.get('/document/:documentId', supplierCtrl.viewSupplierDocument);

// ==========================================
// 2. POST & ACTION ROUTES
// ==========================================
router.post('/email-preview', emailController.getEmailPreview);
router.post('/send-reminder', emailController.sendRenewalEmail);
router.post('/register', authenticateToken, cpUpload, supplierCtrl.onboardSupplier);

// ==========================================
// 3. PUT & DELETE SPECIFIC ROUTES
// ==========================================
router.put('/approve/:supplierId', supplierCtrl.approveSupplier);
router.delete('/documents/:documentId', supplierCtrl.deleteSupplierDocument);

// ==========================================
// 4. PARAMETERIZED WILDCARD ROUTES (Must be last)
// ==========================================
router.get('/:id', supplierCtrl.getSupplierById); // 👈 Moved here safely below specific endpoints

router.put('/:id', upload.fields([
  { name: 'evaluationDoc', maxCount: 1 },
  { name: 'qualityDocs', maxCount: 10 },
  { name: 'supportDocs', maxCount: 10 }
]), supplierCtrl.updateSupplier);

router.delete('/:id', supplierCtrl.deleteSupplier);

module.exports = router;