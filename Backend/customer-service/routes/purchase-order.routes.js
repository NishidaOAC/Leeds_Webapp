const express = require('express');
const router = express.Router();
const POController = require('../controllers/purchase-order.controller');

router.post('/', POController.createPO);
router.post('/:poId/documents', POController.uploadPODocument);
router.get('/:poId/validate', POController.validatePO);

module.exports = router;