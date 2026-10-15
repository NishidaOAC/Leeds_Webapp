// Rate Limiter Middleware for Email Routes
const rateLimit = require('express-rate-limit'); // npm install express-rate-limit

const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: {
    success: false,
    message: 'Too many email requests sent from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = emailLimiter;