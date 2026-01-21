const Notification = require('../models/notification');

class NotificationController {
    // Create a new notification
    async createNotification(req, res) {
        try {
            const { userId, message, type = 'GENERAL', isRead = false, metadata } = req.body;

            // Validate required fields
            if (!userId || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'userId and message are required'
                });
            }

            const notification = await Notification.create({
                userId,
                message,
                type,
                isRead,
                metadata
            });

            // Emit real-time notification (if using Socket.io)
            if (global.io) {
                global.io.to(`user_${userId}`).emit('newNotification', notification);
            }

            res.status(201).json({
                success: true,
                message: 'Notification created successfully',
                data: notification
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Get all notifications for a user
    async getUserNotifications(req, res) {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 20, unreadOnly = false } = req.query;

            const whereCondition = { userId };
            if (unreadOnly === 'true') {
                whereCondition.isRead = false;
            }

            const offset = (page - 1) * limit;

            const { count, rows: notifications } = await Notification.findAndCountAll({
                where: whereCondition,
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            res.json({
                success: true,
                data: notifications,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Mark notification as read
    async markAsRead(req, res) {
        try {
            const { id } = req.params;

            const notification = await Notification.findByPk(id);
            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found'
                });
            }

            notification.isRead = true;
            notification.readAt = new Date();
            await notification.save();

            res.json({
                success: true,
                message: 'Notification marked as read',
                data: notification
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Mark all notifications as read for a user
    async markAllAsRead(req, res) {
        try {
            const { userId } = req.params;

            const [updatedCount] = await Notification.update(
                {
                    isRead: true,
                    readAt: new Date()
                },
                {
                    where: {
                        userId,
                        isRead: false
                    }
                }
            );

            res.json({
                success: true,
                message: `Marked ${updatedCount} notifications as read`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Delete a notification
    async deleteNotification(req, res) {
        try {
            const { id } = req.params;

            const notification = await Notification.findByPk(id);
            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found'
                });
            }

            await notification.destroy();

            res.json({
                success: true,
                message: 'Notification deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Get unread notification count for a user
    async getUnreadCount(req, res) {
        try {
            const { userId } = req.params;

            const count = await Notification.count({
                where: {
                    userId,
                    isRead: false
                }
            });

            res.json({
                success: true,
                count
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = new NotificationController();