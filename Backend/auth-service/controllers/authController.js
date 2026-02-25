const { User, Role } = require('../models');
const authValidation = require('../validations/authValidation');
const { publishEvent } = require('../utils/eventPublisher');
const { sendApprovalRequestEmail, sendUserConfirmationEmail, sendForgotPasswordRequestToManager } = require('../utils/emailService');

class AuthController {
  // Request password reset (sends email to manager)
  static async requestPasswordReset(req, res) {
    try {
      const {  empNo } = req.body;

      if (!empNo) {
        return res.status(400).json({
          success: false,
          message: 'Please provide employee number'
        });
      }

      // Find user
      const query = {};
      if (empNo) query.empNo = empNo;

      const user = await User.findOne({ where: query });

      if (!user) {
        // Return success even if user not found to prevent enumeration
        return res.status(200).json({
          success: true,
          message: 'If the account exists, a request has been sent to the administrator.'
        });
      }

      // Find super admins
      // const superAdmins = await User.findAll({
      //   where: { 
      //     roleId: 1, // Assuming roleId 1 is super admin
      //     isActive: true 
      //   },
      //   attributes: ['id', 'email', 'name']
      // });

      // if (superAdmins.length > 0) {
        // Send email to all admins (or just one, but usually all for redundancy)
        // for (const admin of superAdmins) {
          await sendForgotPasswordRequestToManager({
            to: process.env.MANAGER_EMAIL,
            userName: user.name,
            userEmail: user.email,
            empNo: user.empNo,
            requestedAt: new Date().toLocaleString(),
            dashboardLink: `${process.env.FRONTEND_URL}/dashboard/users` // Direct to users list
          });
        // }
      // }

      return res.status(200).json({
        success: true,
        message: 'If the account exists, a request has been sent to the administrator.'
      });

    } catch (error) {
      console.error('Request Password Reset Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Register new user
  static async register(req, res) {
    try {
      // Validate input
      const { isValid, errors, data } = authValidation.validate(
        authValidation.registerValidation, 
        req.body
      );
      
      if (!isValid) {
        return res.status(400).json({ 
          success: false, 
          errors 
        });
      }
      console.log(data,"1111111111");
      
        const hashedPassword = await bcrypt.hash(data.password, 10);
      // Skip duplicate email check to allow same email

      // Check if empNo already exists
      if (data.empNo) {
        const existingEmpNo = await User.findOne({ 
          where: { empNo: data.empNo } 
        });
        
        if (existingEmpNo) {
          return res.status(409).json({ 
            success: false, 
            message: 'Employee number already exists' 
          });
        }
      }

      // Create new user with pending approval status
      const user = await User.create({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        empNo: data.empNo,
        roleId: data.roleId || 1,
        isActive: false, // Set to false - requires approval
        status: 'pending_approval', // Add status field to track
        approvedBy: null,
        approvedAt: null
      });

      // Generate approval token (expires in 48 hours)
      // const approvalToken = crypto.randomBytes(32).toString('hex');
      // const approvalTokenExpires = new Date(Date.now() + 48 * 60 * 60 * 1000);

      // // Store approval token in database
      // await UserApproval.create({
      //   userId: user.id,
      //   approvalToken,
      //   tokenExpires: approvalTokenExpires,
      //   requestedAt: new Date(),
      //   requestedBy: user.id,
      //   status: 'pending',
      //   approvalNotes: null
      // });

      // Find super admin users (or users with approval rights)
      const superAdmins = await User.findAll({
        where: { 
          roleId: 1, // Assuming roleId 1 is super admin
          isActive: true 
        },
        attributes: ['id', 'email', 'name']
      });

      // Send approval request emails to super admins
      if (superAdmins.length > 0) {
        for (const admin of superAdmins) {
          await sendApprovalRequestEmail({
            to: 'nishida@onboardaero.com',
            adminName: admin.name,
            userName: user.name,
            userEmail: user.email,
            empNo: user.empNo,
            requestedAt: new Date().toLocaleString(),
            approvalLink: `${process.env.FRONTEND_URL}/admin/approvals`,
            dashboardLink: `${process.env.FRONTEND_URL}/admin/dashboard`
          });
        }
        // /${approvalToken}
        // Also send confirmation email to the user
        await sendUserConfirmationEmail({
          to: user.email,
          userName: user.name,
          adminEmail: superAdmins[0].email // Send first admin's email for contact
        });
      }

      // Publish user pending approval event
      await publishEvent('USER_PENDING_APPROVAL', {
        userId: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
        requestedAt: new Date(),
        adminCount: superAdmins.length
      });

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'Registration successful. Account pending approval from administrator.',
        data: {
          user: userResponse,
          requiresApproval: true,
          approvalMessage: 'Your account will be activated after approval by an administrator.',
          estimatedTime: 'Typically within 24-48 hours'
        }
      });

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { isValid, errors, data } = authValidation.validate(
        authValidation.loginValidation, 
        req.body
      );
      if (!isValid) {
        return res.status(400).json({ 
          success: false, 
          errors 
        });
      }
      console.log(data,"1111111111111");
      
      // Find user
      const user = await User.findOne({ 
        where: { empNo: data.empNo } 
      });
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid username' 
        });
      }
      console.log(user);
      
      // Check if account is locked
      if (user.failedLoginAttempts >= (process.env.PASSWORD_MAX_ATTEMPTS || 5)) {
        const lockoutTime = parseInt(process.env.PASSWORD_LOCKOUT_TIME) || 900000;
        const timeSinceLastAttempt = new Date() - user.updatedAt;
        
        if (timeSinceLastAttempt < lockoutTime) {
          return res.status(423).json({ 
            success: false, 
            message: 'Account is locked. Try again later.' 
          });
        } else {
          // Reset failed attempts after lockout period
          await user.update({ failedLoginAttempts: 0 });
        }
      }

      // Check password
      const isPasswordValid = await user.comparePassword(data.password);
      
      if (!isPasswordValid) {
        // Increment failed attempts
        await user.increment('failedLoginAttempts');
        
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid password' 
        });
      }

      // Reset failed attempts on successful login
      await user.update({ 
        failedLoginAttempts: 0,
        lastLogin: new Date()
      });

      // Generate tokens
      const token = user.generateToken();
      
      const refreshToken = user.generateRefreshToken();

      // Create session
      // await Session.create({
      //   userId: user.id,
      //   token,
      //   refreshToken,
      //   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      //   deviceInfo: req.headers['user-agent'],
      //   ipAddress: req.ip
      // });

      // Get user role
      const role = await Role.findByPk(user.roleId);

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            ...userResponse,
            role: role ? role.roleName : 'User',
            power: role ? role.power : 'Admin'
          },
          token,
          refreshToken
        }
      });

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Logout user
  static async logout(req, res) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      
      if (token) {
        // Invalidate session
        await Session.update(
          { isActive: false },
          { where: { token } }
        );
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Logout failed' 
      });
    }
  }

  // Refresh token
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ 
          success: false, 
          message: 'Refresh token required' 
        });
      }

      // Verify refresh token
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

      // Find user
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Find and validate session
      const session = await Session.findOne({
        where: { 
          userId: user.id, 
          refreshToken,
          isActive: true,
          expiresAt: { $gt: new Date() }
        }
      });

      if (!session) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid refresh token' 
        });
      }

      // Generate new tokens
      const newToken = user.generateToken();
      const newRefreshToken = user.generateRefreshToken();

      // Update session
      await session.update({
        token: newToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      res.json({
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken
        }
      });

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Refresh token expired' 
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid refresh token' 
        });
      }

      res.status(500).json({ 
        success: false, 
        message: 'Token refresh failed' 
      });
    }
  }

  // Get current user
  static async getCurrentUser(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Get user role
      const role = await Role.findByPk(user.roleId);

      res.json({
        success: true,
        data: {
          ...user.toJSON(),
          role: role ? role.roleName : 'User'
        }
      });

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get user information' 
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const { isValid, errors, data } = authValidation.validate(
        authValidation.changePasswordValidation, 
        req.body
      );
      
      if (!isValid) {
        return res.status(400).json({ 
          success: false, 
          errors 
        });
      }

      const user = await User.findByPk(req.user.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(data.currentPassword);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Current password is incorrect' 
        });
      }

      // Update password
      await user.update({ password: data.newPassword });

      // Invalidate all sessions except current
      const token = req.headers['authorization']?.split(' ')[1];
      await Session.update(
        { isActive: false },
        { 
          where: { 
            userId: user.id,
            token: { $ne: token }
          }
        }
      );

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to change password' 
      });
    }
  }
}

module.exports = AuthController;
