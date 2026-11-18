const jwt = require('jsonwebtoken');
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
      // Graceful fallback to HS256 for legacy tokens
      if (process.env.JWT_SECRET && (verifyErr.name === 'JsonWebTokenError' || verifyErr.message.includes('algorithm'))) {
        decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      } else {
        throw verifyErr;
      }
    }

    const userId = decoded.id || decoded.userId;

    // Attach user to request directly from cryptographically verified claims
    req.user = {
      id: userId,
      userId: userId,
      email: decoded.email,
      roleId: decoded.roleId,
      name: decoded.name
    };

    next();
  } catch (error) {
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

    console.error('File Auth Middleware Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.roleId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
