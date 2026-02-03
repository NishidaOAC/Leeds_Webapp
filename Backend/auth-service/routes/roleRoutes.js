const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/roleController');
const { authenticateToken } = require('../middleware/auth');
// Public routes

router.get('/', authenticateToken, RoleController.getRoles);

router.post('/', authenticateToken, RoleController.addRole);

router.patch('/:id', authenticateToken, RoleController.updateRole );

router.delete('/:id', authenticateToken, RoleController.deleteRole );

// router.get('/findbyid/:id', authenticateToken, RoleController.getRoleById );

module.exports = router;