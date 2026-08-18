const jwt = require('jsonwebtoken');
const axios = require('axios');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Option A: Verify locally and fetch user from auth service
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Call auth service to get user details
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.data.success || !response.data.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found or inactive' 
      });
    }

    req.user = response.data.user;
    next();

  } catch (error) {
    console.error('Auth Middleware Error:', error);

    if (error.response) {
      // Auth service returned an error
      return res.status(error.response.status).json(error.response.data);
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token'
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

module.exports = { authenticateToken };