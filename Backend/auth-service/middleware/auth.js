const jwt = require('jsonwebtoken');
// Session ടെബിൾ പ്രശ്നം ഒഴിവാക്കാൻ User മാത്രം ഇമ്പോർട്ട് ചെയ്യുന്നു
const { User } = require('../models');

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

    // 1. Strict Algorithm Validation (RS256 asymmetric with legacy HS256 fallback)
    const { getPublicKey } = require('../utils/keyUtils');
    let decoded;
    try {
      decoded = jwt.verify(token, getPublicKey(), { algorithms: ['RS256'] });
    } catch (verifyErr) {
      if (process.env.JWT_SECRET && (verifyErr.name === 'JsonWebTokenError' || verifyErr.message.includes('algorithm'))) {
        decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      } else {
        throw verifyErr;
      }
    }

    // 2. Check if user exists and is active
    const user = await User.findOne({
      where: { 
        id: decoded.id, 
        isActive: true 
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found or inactive' 
      });
    }

    // Attach user payload safely
    req.user = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      name: user.name
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