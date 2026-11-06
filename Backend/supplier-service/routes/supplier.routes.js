const express = require('express');
const router = express.Router();
const supplierCtrl = require('../controllers/supplier.controller');
const emailLimiter = require('../middlewares/rateLimiter.middleware');


const rateLimit = require('express-rate-limit');
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 20, 
    message: "Too many upload/update requests from this IP, please try again later."
});

const { upload, validateMagicBytes } = require('../middlewares/upload.middleware'); 
const emailController = require('../controllers/email.controller');
const { authenticateToken } = require('../middlewares/authToken');
const authorizePower = require('../middlewares/authorizePower');


const cpUpload = upload.fields([
  { name: 'evaluationDoc', maxCount: 1 },
  { name: 'qualityDocs', maxCount: 10 },
  { name: 'supportDocs', maxCount: 10 } 
]);

const runExpiryJob = require('../controllers/expiryNotifier.job');


router.get('/trigger-expiry-job', authenticateToken, authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), async (req, res) => {
    try {
        await runExpiryJob();
        res.json({ message: "Expiry job executed successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', authenticateToken, supplierCtrl.getAllSuppliers);
router.get('/paginated', authenticateToken, supplierCtrl.getPaginatedAllSuppliers);
router.get('/expirycurrentmonth', authenticateToken, supplierCtrl.getAllSuppliersExpiryinCurrentmonth);
router.get('/onboardingStatuses', authenticateToken, supplierCtrl.getOnboardingStatuses);
router.get('/qualified-list', authenticateToken, supplierCtrl.getQualifiedSuppliers);


router.get('/document/:documentId', authenticateToken, supplierCtrl.viewSupplierDocument);


router.post('/email-preview', authenticateToken, authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), emailController.getEmailPreview);

router.post(
  '/send-reminder', 
  authenticateToken, 
  authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), 
  emailLimiter, 
  emailController.sendRenewalEmail
);

router.post(
  '/register', 
  authenticateToken, 
  authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), 
  uploadLimiter, // Added Rate Limiter
  cpUpload, 
  validateMagicBytes, 
  supplierCtrl.onboardSupplier
);



router.put(
  '/approve/:supplierId', 
  authenticateToken, 
  authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), 
  supplierCtrl.approveSupplier
);


router.delete(
  '/documents/:documentId', 
  authenticateToken, 
  authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), 
  supplierCtrl.deleteSupplierDocument
);



router.get('/:id', authenticateToken, supplierCtrl.getSupplierById);


router.put(
  '/:id', 
  authenticateToken, 
  authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), 
  uploadLimiter, // Added Rate Limiter
  cpUpload, 
  validateMagicBytes, 
  supplierCtrl.updateSupplier
);


router.delete(
  '/:id', 
  authenticateToken, 
  authorizePower('Admin', 'QualityAdmin', 'SuperAdmin'), 
  supplierCtrl.deleteSupplier
);

module.exports = router;