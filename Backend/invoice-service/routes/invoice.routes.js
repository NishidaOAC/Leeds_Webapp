const express = require('express');
const router = express.Router();
const controller = require('../controllers/invoice.controller');
const { authenticateToken } = require('../middleware/authToken');


router.get('/dashboard/cc', authenticateToken, controller.dashboardCreditCard);

router.get('/dashboard/wt', authenticateToken, controller.dashboardWireTransfer);

// router.post('/save', authenticateToken, controller.addPI);

router.get('/find', authenticateToken, controller.findInvoices);

router.patch('/:id/status', authenticateToken, controller.updateInvoiceStatus);

// router.get('/find', authenticateToken, controller.getPI);

router.post('/save', authenticateToken, controller.addPI);
  
router.post('/saveByKAM', authenticateToken, controller.addPIKAM);

router.post('/saveByAM', authenticateToken, controller.addPIAM);

router.get('/findbysp', authenticateToken, controller.getSalesTeamPIs);

router.get('/findbkam', authenticateToken, controller.getKAMPIs)

router.get('/findbyam', authenticateToken, controller.getAMPIs )

router.get('/findbyma', authenticateToken, controller.getPIByMA )

router.get('/findbyadmin', authenticateToken, controller.getPIByAdmin );

router.get('/findbyid/:id', authenticateToken, controller.findPIById )

router.patch('/bankslip/:id', authenticateToken, )
module.exports = router;
