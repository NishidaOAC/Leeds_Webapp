const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const UserController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { getPublicKey, getJwks } = require('../utils/keyUtils');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many attempts, please try again later'
});

// RS256 Public Key and JWKS endpoints (for downstream microservices & token verification)
router.get('/public-key', (req, res) => {
  try {
    const pubKey = getPublicKey();
    res.type('text/plain').send(pubKey);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not load public key' });
  }
});

router.get('/.well-known/jwks.json', (req, res) => {
  try {
    const jwks = getJwks();
    res.json(jwks);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not generate JWKS' });
  }
});

// Public routes
router.post('/register', AuthController.register);
router.post('/login', (req, res, next) => {
  next();
}, AuthController.login);

router.post('/forgot-password', AuthController.requestPasswordReset);
// router.post('/refresh-token', AuthController.refreshToken);
// router.post('/reset-password', authLimiter, AuthController.resetPassword);

// Protected routes
router.get('/me', authenticateToken, AuthController.getCurrentUser);
router.post('/logout', authenticateToken, AuthController.logout);
router.post('/change-password', authenticateToken, AuthController.changePassword);


router.get('/findbyroleName/:roleName', authenticateToken, UserController.getByRolename);
router.get('/find/', authenticateToken, UserController.getAllUsers );
router.post('/add', authenticateToken, UserController.addUser);
router.patch('/update/:id', authenticateToken, UserController.updateUser);
router.delete('/delete/:id',  authenticateToken, UserController.deleteUser);

router.get('/validate', UserController.validateToken);
router.get('/users/:userId/status', UserController.validateUserStatus);
router.post('/users/bulk-validate', UserController.bulkValidateUsers);
router.post('/refresh-token', UserController.refreshToken);
router.patch('/resetpassword/:id', authenticateToken, UserController.resetPassword);
router.get('/users/:id', authenticateToken, UserController.getUserById);
// router.delete('/users/:id', authenticateToken, AuthController.deleteUser);

router.get('/leaders', authenticateToken, UserController.getTeamLeaders);
router.get('/members', authenticateToken, UserController.getTeamMembers);
module.exports = router;