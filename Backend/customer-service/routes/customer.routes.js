const express = require('express');
const router = express.Router();
const multer = require('multer');
const customerController = require('../controllers/customer.controller');
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
// Base path: /api/customers (defined in app.js)
router.get('/', customerController.getAllCustomers);
// router.post('/', customerController.createCustomer);
router.post('/', upload.array('documents'), customerController.createCustomer);

router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);
// routes/customer.routes.js

// This matches: GET /api/customer/documents/:documentId/view
router.get('/documents/:documentId/view', customerController.viewDocument);
// routes/customer.routes.js

// This matches: GET /api/customer/documents/:documentId/view

// ... your routes ...

module.exports = router; // <-- MAKE SURE THIS LINE EXISTS