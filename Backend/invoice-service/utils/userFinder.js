// utils/authClient.js
const axios = require('axios');
/**
 * Fetch users from auth-service and return a map keyed by userId
 * @param {Array<number>} userIds
 * @param {string} authHeader
 */
exports.findUsersByIds = async (userIds = [], authHeader) => {
  try {
    if (!userIds.length) return {};

    const { data: response } = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/users/bulk-validate`,
      { userIds },
      {
        headers: {
          Authorization: authHeader
        },
        timeout: 10000 // 10 second timeout
      }
    );

    // Handle the response format from our auth service
    if (response.success && response.users) {
      // Transform to map keyed by userId (only active users)
      const userMap = {};
      Object.values(response.users).forEach(user => {
        if (user.exists && user.isActive) {
          userMap[user.id] = {
            id: user.id,
            email: user.email,
            name: user.name,
            roleId: user.roleId,
            isActive: user.isActive
          };
        }
      });
      return userMap;
    }

    return {};
  } catch (error) {
    console.error('User lookup failed:', error.message);
    return {}; // 🔥 never break dashboard APIs
  }
};

/**
 * Validate JWT token - NEW FUNCTION, same style
 * @param {string} token
 */
exports.validateToken = async (token) => {
  try {
    if (!token) {
      return { success: false, message: 'Token is required' };
    }

    const { data } = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/validate`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000
      }
    );

    return data;
  } catch (error) {
    console.error('Token validation failed:', error.message);
    
    // Return a consistent error format
    if (error.response) {
      return error.response.data;
    }
    
    return {
      success: false,
      message: 'Authentication service unavailable'
    };
  }
};

/**
 * Get single user by ID - NEW FUNCTION, same style
 * @param {string|number} userId
 * @param {string} authHeader
 */
exports.getUserById = async (userId, authHeader) => {
  try {
    if (!userId) {
      return { success: false, message: 'User ID is required' };
    }

    const { data } = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/users/${userId}`,
      {
        headers: {
          'Authorization': authHeader
        },
        timeout: 10000
      }
    );

    return data;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error.message);
    
    if (error.response) {
      return error.response.data;
    }
    
    return {
      success: false,
      message: 'Failed to fetch user'
    };
  }
};

/**
 * Check if user is active - NEW FUNCTION, same style
 * @param {string|number} userId
 */
exports.checkUserStatus = async (userId) => {
  try {
    if (!userId) {
      return { success: false, message: 'User ID is required' };
    }

    const { data } = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/users/${userId}/status`,
      { timeout: 5000 }
    );

    return data;
  } catch (error) {
    console.error(`Failed to check user status ${userId}:`, error.message);
    return {
      success: false,
      message: 'Failed to check user status'
    };
  }
};