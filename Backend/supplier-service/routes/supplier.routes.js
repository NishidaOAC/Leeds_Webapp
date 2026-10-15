const express = require('express');
const router = express.Router();
const supplierCtrl = require('../controllers/supplier.controller');
const emailLimiter = require('../middlewares/rateLimiter.middleware');

// 1. Import Security Middlewares
const { upload, validateMagicBytes } = require('../middlewares/upload.middleware'); 
const emailController = require('../controllers/email.controller');
const { authenticateToken } = require('../middlewares/authToken');
const authorizePower = require('../middlewares/authorizePower'); // 👈 Added for Vertical Access Control Protection

// Multi-field file upload configuration
const cpUpload = upload.fields([
  { name: 'evaluationDoc', maxCount: 1 },
  { name: 'qualityDocs', maxCount: 10 },
  { name: 'supportDocs', maxCount: 10 } 
]);

const runExpiryJob = require('../controllers/expiryNotifier.job');

// ==========================================
// 1. SPECIFIC GET ROUTES (Must be first)
// ==========================================
router.get('/trigger-expiry-job', authenticateToken, authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), async (req, res) => {
    try {
        await runExpiryJob();
        res.json({ message: "Expiry job executed successfully. Check your terminal logs." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Protected Read Operations (Requires Authentication)
router.get('/', authenticateToken, supplierCtrl.getAllSuppliers);
router.get('/paginated', authenticateToken, supplierCtrl.getPaginatedAllSuppliers);
router.get('/expirycurrentmonth', authenticateToken, supplierCtrl.getAllSuppliersExpiryinCurrentmonth);
router.get('/onboardingStatuses', authenticateToken, supplierCtrl.getOnboardingStatuses);
router.get('/qualified-list', authenticateToken, supplierCtrl.getQualifiedSuppliers);

// 👈 IDOR Protected Route: User verification happens inside controller
router.get('/document/:documentId', authenticateToken, supplierCtrl.viewSupplierDocument);

// ==========================================
// 2. POST & ACTION ROUTES
// ==========================================
router.post('/email-preview', authenticateToken, authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), emailController.getEmailPreview);

// Email Action Route with Rate Limiting & Vertical Access Control Guard
router.post(
  '/send-reminder', 
  authenticateToken, 
  authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), // 👈 Vertical Privilege Escalation Guard
  emailLimiter, 
  emailController.sendRenewalEmail
);

// Secure supplier registration with Token Auth, Multer parsing, Magic Byte Verification & Power Check
router.post(
  '/register', 
  authenticateToken, 
  authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), // 👈 Only authorized admins can onboard suppliers
  cpUpload, 
  validateMagicBytes, 
  supplierCtrl.onboardSupplier
);

// ==========================================
// 3. PUT & DELETE SPECIFIC ROUTES
// ==========================================

// 👈 Privilege Escalation Guard: Only Admin & QualityAdmin can approve suppliers
router.put(
  '/approve/:supplierId', 
  authenticateToken, 
  authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), 
  supplierCtrl.approveSupplier
);

// 👈 Privilege Escalation Guard: Restricted document deletion
router.delete(
  '/documents/:documentId', 
  authenticateToken, 
  authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), 
  supplierCtrl.deleteSupplierDocument
);

// ==========================================
// 4. PARAMETERIZED WILDCARD ROUTES (Must be last)
// ==========================================

// 👈 IDOR Protected Read Route: Controller enforces ownership or admin checks
router.get('/:id', authenticateToken, supplierCtrl.getSupplierById);

// 👈 Privilege Escalation Guard: Ordinary users cannot update master supplier records
router.put(
  '/:id', 
  authenticateToken, 
  authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), 
  cpUpload, 
  validateMagicBytes, 
  supplierCtrl.updateSupplier
);

// 👈 Privilege Escalation Guard: Ordinary users/suppliers cannot delete supplier records
router.delete(
  '/:id', 
  authenticateToken, 
  authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), 
  supplierCtrl.deleteSupplier
);

module.exports = router;