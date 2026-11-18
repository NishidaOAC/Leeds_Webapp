// customer-service/middlewares/authToken.js
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

    const publicKey = await getPublicKeyAsync();
    let decoded;
    try {
      decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    } catch (verifyErr) {
      if (process.env.JWT_SECRET && (verifyErr.name === 'JsonWebTokenError' || verifyErr.message.includes('algorithm'))) {
        decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      } else {
        throw verifyErr;
      }
    }

    req.user = {
      id: decoded.id || decoded.userId,
      userId: decoded.userId || decoded.id,
      email: decoded.email,
      name: decoded.name,
      empNo: decoded.empNo,
      roleId: decoded.roleId,
      power: decoded.power || (decoded.role ? decoded.role.power : null),
      roleName: decoded.roleName || (decoded.role ? decoded.role.roleName : null),
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    console.error('Customer Auth Middleware Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

module.exports = { authenticateToken };

