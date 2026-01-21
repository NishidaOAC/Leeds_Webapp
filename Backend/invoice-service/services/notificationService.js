// services/notificationClient.js
const axios = require('axios');

class NotificationClient {
  constructor() {
    this.baseURL = process.env.AUTH_SERVICE_URL || 'http://localhost:3003';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Set auth token for notification service
   */
  setAuthToken(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Create notification via API call
   */
  async createNotification(notificationData, authToken = null) {
    try {
      const headers = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await this.client.post('/api/notifications', notificationData, { headers });
      
      return {
        success: true,
        data: response.data,
        message: 'Notification created successfully'
      };
    } catch (error) {
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: error.response.data?.message || 'Notification service error',
          data: error.response.data
        };
      }

      return {
        success: false,
        message: 'Notification service unavailable',
        error: error.message
      };
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const params = {
        userId,
        ...options
      };

      const response = await this.client.get('/api/notifications', { params });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch notifications'
      };
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      const response = await this.client.patch(`/api/notifications/${notificationId}/read`, {
        userId
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update notification'
      };
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/health', { timeout: 3000 });
      return {
        success: true,
        status: 'healthy',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        message: error.message
      };
    }
  }

    async handleStatusNotification({ pi, status, kamId, amId, accountantId, user }) {
    try {

      // Determine notification recipients based on status
      const recipients = this.getNotificationRecipients(status, pi, kamId, amId, accountantId);
      
      if (recipients.length === 0) {
        return { success: true, message: 'No recipients to notify' };
      }

      const messages = this.getStatusMessages(pi.piNo, status, user);
      
      // Send notifications to all recipients
      const results = await Promise.allSettled(
        recipients.map(recipient => 
          this.sendStatusNotification(recipient, messages, pi, status, user)
        )
      );

      // Log results
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      
      return {
        success: true,
        sent: successful,
        failed: failed,
        results: results.map(r => r.status === 'fulfilled' ? r.value : r.reason)
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  getStatusMessages(piNo, status, user) {
    const statusMessages = {
      'GENERATED': {
        title: `PI ${piNo} Generated`,
        message: `Proforma Invoice ${piNo} has been generated${user ? ` by ${user.name}` : ''}`,
        type: 'PI_GENERATED'
      },
      'INITIATED': {
        title: `PI ${piNo} Initiated`,
        message: `Proforma Invoice ${piNo} has been initiated for processing${user ? ` by ${user.name}` : ''}`,
        type: 'PI_INITIATED'
      },
      'APPROVED': {
        title: `PI ${piNo} Approved`,
        message: `Proforma Invoice ${piNo} has been approved${user ? ` by ${user.name}` : ''}`,
        type: 'PI_APPROVED'
      },
      'REJECTED': {
        title: `PI ${piNo} Rejected`,
        message: `Proforma Invoice ${piNo} has been rejected${user ? ` by ${user.name}` : ''}`,
        type: 'PI_REJECTED'
      },
      'COMPLETED': {
        title: `PI ${piNo} Completed`,
        message: `Proforma Invoice ${piNo} processing has been completed${user ? ` by ${user.name}` : ''}`,
        type: 'PI_COMPLETED'
      }
    };

    return statusMessages[status.toUpperCase()] || {
      title: `PI ${piNo} Status Updated`,
      message: `Proforma Invoice ${piNo} status has been updated to ${status}${user ? ` by ${user.name}` : ''}`,
      type: 'PI_STATUS_UPDATE'
    };
  }


}

module.exports = new NotificationClient();