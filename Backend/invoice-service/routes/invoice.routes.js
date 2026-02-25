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

router.get('/report/sales-team', authenticateToken, controller.getSalesTeamPIReport);

router.get('/findbkam', authenticateToken, controller.getKAMPIs)

router.get('/findbyam', authenticateToken, controller.getAMPIs )

router.get('/findbyma', authenticateToken, controller.getPIByMA )

router.get('/findbyadmin', authenticateToken, controller.getPIByAdmin );

router.get('/findbyid/:id', authenticateToken, controller.findPIById )

router.patch('/bankslip/:id', authenticateToken, controller.addBankSlip )


router.patch('/updateBySE/:id', authenticateToken, controller.updatePIBySE );

router.patch('/updateByKAM/:id', authenticateToken, controller.updatePIKAM);

router.patch('/updateByAM/:id', authenticateToken, controller.updatePIAM);

router.delete('/:id', authenticateToken, controller.deleteInvoice)
// Modified route handler with alternative approach
router.patch('/getforadminreport', authenticateToken, controller.getAdminReports);

router.patch('/kamupdate/:id', authenticateToken, controller.updateKAM );

router.post('/download-excel', authenticateToken, controller.downloadExcel);

router.patch('/updatePIByAdminSuperAdmin/:id', authenticateToken, controller.updatePIAdmin);
module.exports = router;
