const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
// router.use(authMiddleware);

// Create notification
router.post('/create', authenticateToken, notificationController.createNotification);

// Get user notifications
router.get('/user/:userId', authenticateToken, notificationController.getUserNotifications);

// Mark notification as read
router.put('/:id/read', authenticateToken, notificationController.markAsRead);

// Mark all notifications as read for a user
router.put('/user/:userId/read-all', authenticateToken, notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', authenticateToken, notificationController.deleteNotification);

// Get unread count
router.get('/user/:userId/unread-count', authenticateToken, notificationController.getUnreadCount);

module.exports = router;