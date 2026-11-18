const jwt = require('jsonwebtoken');
const axios = require('axios');
const { getPublicKeyAsync } = require('../utils/keyUtils');

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

    // 1. Asymmetric verification via RSA Public Key (RS256)
    const publicKey = await getPublicKeyAsync();
    let decoded;
    try {
      decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    } catch (verifyErr) {
      // Graceful fallback to HS256 for legacy or transitional tokens
      if (process.env.JWT_SECRET && (verifyErr.name === 'JsonWebTokenError' || verifyErr.message.includes('algorithm'))) {
        decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      } else {
        throw verifyErr;
      }
    }

    // 2. Fast Path: Use self-contained RS256 token payload (no HTTP roundtrip to auth-service)
    if (decoded && (decoded.id || decoded.userId) && decoded.name) {
      req.user = {
        id: decoded.id || decoded.userId,
        userId: decoded.userId || decoded.id,
        email: decoded.email,
        name: decoded.name,
        empNo: decoded.empNo,
        roleId: decoded.roleId,
        isActive: decoded.isActive !== undefined ? decoded.isActive : true,
        role: decoded.role || {
          id: decoded.roleId,
          roleName: decoded.roleName || 'User',
          abbreviation: decoded.roleName || 'User',
          power: decoded.power || 'User'
        },
        roleName: decoded.roleName || (decoded.role && decoded.role.roleName),
        power: decoded.power || (decoded.role && decoded.role.power)
      };
      return next();
    }

    // 3. Fallback: If payload lacks user/role details, query auth-service
    const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    const response = await axios.get(`${authUrl}/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 5000
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
    if (error.response) {
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

    console.error('Invoice Auth Middleware Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

module.exports = { authenticateToken };
