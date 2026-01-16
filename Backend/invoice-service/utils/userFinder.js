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
    console.log(response);
    
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
            roleName: user.roleName,
            abbreviation: user.abbreviation,
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


exports.getAllowedUserIdsForUser = async (userId, authHeader) => {
  try {
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/team/leader/${userId}/members`, {
      headers: {
        Authorization: authHeader
      },
      timeout: 10000
    });

    const teams = response.data;
    console.log(teams, "teamaaaaaa");
    
    if (!Array.isArray(teams)) {
      return [userId];
    }

    const ids = new Set();

    teams.forEach(team => {
      const leaders = team.TeamLeaders || team.teamLeaders || [];
      const members = team.TeamMembers || team.teamMembers || [];

      const isInTeam =
        leaders.some(l => l.userId === userId) ||
        members.some(m => m.userId === userId);

      if (isInTeam) {
        leaders.forEach(l => {
          if (l.userId) ids.add(l.userId);
        });
        members.forEach(m => {
          if (m.userId) ids.add(m.userId);
        });
      }
    });

    if (ids.size === 0) {
      return [userId];
    }

    return Array.from(ids);
  } catch (error) {
    console.error('Failed to fetch teams from auth service:', error.message);
    return [userId];
  }
};

exports.getTeamUsers = async (teamId, authToken) => {
    try {
        console.log(teamId, "teamIdaaaaa");
        if (!teamId ) {
            throw new Error('Either team must be provided');
        }

        // Build query parameters
        const params = {};
        if (teamId) params.teamId = teamId;

        // Make API call
        const response = await axios({
            method: 'GET',
            url: `${process.env.AUTH_SERVICE_URL}/team/${teamId}`,
            headers: {
              Authorization: authToken
            },
            timeout: 10000
        });
        console.log(response.data, "response.dataaaaaa");
        // Validate response
        if (!response.data) {
            throw new Error('No data received from user database');
        }

        // Return user array (adjust based on your API response structure)
        return Array.isArray(response.data) 
            ? response.data 
            : response.data.users || response.data.data || [];

    } catch (error) {
        console.error('Error fetching team users:', {
            message: error.message,
            teamId,
            apiUrl: process.env.AUTH_SERVICE_URL,
            status: error.response?.status,
            data: error.response?.data
        });

        // Handle specific error cases
        if (error.code === 'ECONNREFUSED') {
            throw new Error(`User database connection refused at ${AUTH_SERVICE_URL}`);
        }

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 404) {
                throw new Error('Team not found in user database');
            }
            if (error.response.status === 401) {
                throw new Error('Unauthorized access to user database');
            }
            if (error.response.status === 403) {
                throw new Error('Forbidden access to user database');
            }
            throw new Error(`User database API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response received from user database');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Failed to fetch team users: ${error.message}`);
        }
    }
}
