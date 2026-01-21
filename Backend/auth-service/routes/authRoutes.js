const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const UserController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many attempts, please try again later'
});

// Public routes
router.post('/register', AuthController.register);
router.post('/login', (req, res, next) => {
  next();
}, AuthController.login);

// router.post('/refresh-token', AuthController.refreshToken);
// router.post('/forgot-password', authLimiter, AuthController.forgotPassword);
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
router.get('/users/:userId', UserController.getUserById);
router.get('/users/:userId/status', UserController.validateUserStatus);
router.post('/users/bulk-validate', UserController.bulkValidateUsers);
router.post('/refresh-token', UserController.refreshToken);
router.patch('/resetpassword/:id', authenticateToken, UserController.resetPassword);
// router.get('/users/:id', authenticateToken, AuthController.getUserById);
// router.put('/users/:id', authenticateToken, AuthController.updateUser);
// router.delete('/users/:id', authenticateToken, AuthController.deleteUser);

router.get('/leaders', authenticateToken, UserController.getTeamLeaders);
router.get('/members', authenticateToken, UserController.getTeamMembers);
module.exports = router;