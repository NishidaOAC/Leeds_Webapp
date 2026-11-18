const jwt = require('jsonwebtoken');
const { getPublicKey } = require('../utils/keyUtils');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided.' });

  const publicKey = getPublicKey();
  try {
    const user = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    req.user = user;
    return next();
  } catch (err) {
    if (process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET, (fallbackErr, user) => {
        if (fallbackErr) return res.status(403).json({ error: fallbackErr.message });
        req.user = user;
        next();
      });
    } else {
      return res.status(403).json({ error: err.message });
    }
  }
}

module.exports = authenticateToken;
