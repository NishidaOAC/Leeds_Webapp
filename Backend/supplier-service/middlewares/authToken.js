// supplier-service/middlewares/authToken.js
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
      // Graceful fallback to HS256 for transitional tokens
      if (process.env.JWT_SECRET && (verifyErr.name === 'JsonWebTokenError' || verifyErr.message.includes('algorithm'))) {
        decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      } else {
        throw verifyErr;
      }
    }

    // 2. Fast Path: Use self-contained RS256 token payload
    const userId = decoded.id || decoded.userId;
    if (userId && (decoded.power || decoded.roleName || decoded.name)) {
      req.user = {
        id: userId,
        userId: userId,
        email: decoded.email,
        name: decoded.name,
        empNo: decoded.empNo,
        roleId: decoded.roleId,
        power: decoded.power || (decoded.role ? decoded.role.power : 'QualityAdmin'),
        roleName: decoded.roleName || (decoded.role ? (decoded.role.roleName || decoded.role.name) : 'User'),
        role: decoded.role
      };
      return next();
    }

    // 3. Fallback: Query auth-service if token does not contain full claims
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

    const fetchedUser = response.data.user;

    req.user = {
      ...fetchedUser,
      power: fetchedUser.power || (fetchedUser.role ? fetchedUser.role.power : decoded.power) || 'QualityAdmin',
      roleName: fetchedUser.roleName || (fetchedUser.role ? (fetchedUser.role.roleName || fetchedUser.role.name) : decoded.roleName) || 'User',
      role: fetchedUser.role
    };

    next();

  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    console.error('Supplier Auth Middleware Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

module.exports = { authenticateToken };
