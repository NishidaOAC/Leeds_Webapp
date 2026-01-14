const express = require('express');
const router = express.Router();
const controller = require('../controllers/invoice-status.controller');
const { authenticateToken } = require('../middleware/authToken');


const emailService = require('../services/emailService');
const notificationService = require('../services/notificationService');

router.post('/updatestatus', authenticateToken, async (req, res) => {
  try {
    const { performaInvoiceId, remarks, amId, accountantId, status, kamId } = req.body;
    const user = req.user;
    console.log(user,"usersssssssssss");
    
    // Call controller to update status
    const result = await controller.updatePIStatus({
      performaInvoiceId,
      remarks,
      amId,
      accountantId,
      status,
      kamId,
      user
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Get updated PI
    const pi = result.data.pi;
    
    // Handle notification asynchronously
    notificationService.handleStatusNotification({
      pi,
      status,
      kamId: kamId || pi.kamId
    }).catch(error => {
      console.error('Notification failed:', error);
    });
    const toEmail = user.email;
    // Handle email sending asynchronously (don't await)
    emailService.sendStatusUpdateEmail({
      pi,
      status,
      remarks,
      user,
      toEmail,
      kamId: kamId || pi.kamId,
      amId: amId || pi.amId,
      accountantId: accountantId || pi.accountantId
    }).then(emailResult => {
      console.log('Email sent successfully:', emailResult);
    }).catch(error => {
      console.error('Email sending failed:', error);
    });

    // Return immediate success response
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: result.data,
      note: 'Notifications and emails are being processed in the background'
    });

  } catch (error) {
    console.error('Error in update status route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
});


router.get('/findbypi', authenticateToken, controller.getPiStatuses )
module.exports = router;
