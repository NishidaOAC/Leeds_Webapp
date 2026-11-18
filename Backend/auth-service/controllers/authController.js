const { User, Role } = require('../models');
const { Op } = require('sequelize');
const Notification = require('../models/notification');
const authValidation = require('../validations/authValidation');
const { publishEvent } = require('../utils/eventPublisher');
const { sendApprovalRequestEmail, sendUserConfirmationEmail, sendForgotPasswordRequestToManager } = require('../utils/emailService');

class AuthController {
  // Request password reset (sends in-app notification & optional email to manager)
  static async requestPasswordReset(req, res) {
    try {
      const { empNo } = req.body;

      if (!empNo || typeof empNo !== 'string' || !empNo.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Please provide employee number'
        });
      }

      const cleanEmpNo = empNo.trim();

      // Find user case-insensitively by empNo or email
      const user = await User.findOne({
        where: {
          [Op.or]: [
            { empNo: { [Op.iLike]: cleanEmpNo } },
            { email: { [Op.iLike]: cleanEmpNo } }
          ]
        }
      });

      if (!user) {
        // Return success even if user not found to prevent user enumeration
        return res.status(200).json({
          success: true,
          message: 'If the account exists, a request has been sent to the administrator.'
        });
      }

      // 1. Identify administrators and managers to notify (SuperAdmin roleId: 1, Manager roleId: 5)
      let admins = [];
      try {
        admins = await User.findAll({
          where: {
            roleId: [1, 5],
            isActive: true
          },
          attributes: ['id', 'email', 'name', 'roleId']
        });
      } catch (dbErr) {
        console.warn('[PasswordReset] Could not load admins:', dbErr.message);
      }

      // 2. Persist in-app notifications for admins/managers
      try {
        if (admins.length > 0) {
          const resetRoute = `/dashboard/users?openReset=true&resetUserId=${user.id}&empNo=${encodeURIComponent(user.empNo || '')}&username=${encodeURIComponent(user.name || '')}`;
          const notifPromises = admins.map(admin => 
            Notification.create({
              userId: admin.id,
              message: `Password reset request received from ${user.name} (${user.empNo || user.email}).`,
              route: resetRoute,
              isRead: false
            })
          );
          await Promise.all(notifPromises);
        }
      } catch (notifErr) {
        console.warn('[PasswordReset] In-app notification creation skipped:', notifErr.message);
      }

      // 3. Publish real-time event (RabbitMQ / Socket.io)
      try {
        await publishEvent('USER_PASSWORD_RESET_REQUESTED', {
          userId: user.id,
          email: user.email,
          name: user.name,
          empNo: user.empNo,
          requestedAt: new Date()
        });
      } catch (eventErr) {
        // Non-blocking
      }

      // 4. Send email notification asynchronously without blocking response (prevents ETIMEDOUT 500 errors)
      const recipientEmail = process.env.MANAGER_EMAIL || process.env.manager_email || (admins.length > 0 ? admins[0].email : null);
      const frontendUrl = (process.env.FRONT_END || process.env.FRONTEND_URL || 'http://localhost:4200').replace(/\/$/, '');

      if (recipientEmail) {
        sendForgotPasswordRequestToManager({
          to: recipientEmail,
          adminName: (admins.length > 0 && admins[0].name) ? admins[0].name : 'Administrator',
          userName: user.name,
          userEmail: user.email,
          empNo: user.empNo,
          requestedAt: new Date().toLocaleString(),
          dashboardLink: `${frontendUrl}/dashboard/users`
        }).then(() => {
          console.log(`[PasswordReset] Notification email dispatched to ${recipientEmail}`);
        }).catch((emailErr) => {
          console.warn(`[PasswordReset] SMTP notification email delivery skipped/failed: ${emailErr.message}`);
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Password reset request has been submitted to your manager for approval.'
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
      console.log(data, "1111111111");

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
      return res.status(400).json({ success: false, errors });
    }

    // 1. Find user with associated Role
    const user = await User.findOne({
      where: { empNo: data.empNo },
      include: [{ model: Role, as: 'Role' }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid employee number or password'
      });
    }

    // 2. Check if account is locked using lockoutUntil
    const now = new Date();
    if (user.lockoutUntil) {
      if (user.lockoutUntil > now) {
        const remainingMinutes = Math.ceil((user.lockoutUntil - now) / 60000);
        return res.status(423).json({
          success: false,
          locked: true,
          remainingMinutes,
          message: `Account is temporarily locked. Please try again in ${remainingMinutes} minute(s).`
        });
      } else {
        // Lockout period has elapsed; reset failed attempts for a fresh cycle
        await user.update({ failedLoginAttempts: 0, lockoutUntil: null });
        user.failedLoginAttempts = 0;
        user.lockoutUntil = null;
      }
    }

    // 3. Compare Password
    const isPasswordValid = await user.comparePassword(data.password);

    if (!isPasswordValid) {
      const maxAttempts = parseInt(process.env.PASSWORD_MAX_ATTEMPTS) || 5;
      const lockoutDurationMs = parseInt(process.env.PASSWORD_LOCKOUT_TIME) || 900000; 

      const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
      let updateData = { failedLoginAttempts: newFailedAttempts };

      // Set lockout window if threshold reached (5 failed attempts)
      if (newFailedAttempts >= maxAttempts) {
        updateData.lockoutUntil = new Date(Date.now() + lockoutDurationMs);
        await user.update(updateData);

        const lockoutMinutes = Math.ceil(lockoutDurationMs / 60000);
        return res.status(423).json({
          success: false,
          locked: true,
          remainingMinutes: lockoutMinutes,
          message: `Account is temporarily locked due to ${maxAttempts} consecutive failed login attempts. Please try again in ${lockoutMinutes} minute(s).`
        });
      }

      await user.update(updateData);
      const attemptsRemaining = maxAttempts - newFailedAttempts;

      return res.status(401).json({
        success: false,
        attemptsRemaining,
        message: `Invalid employee number or password. ${attemptsRemaining} attempt(s) remaining before account lockout.`
      });
    }

    // 4. Reset lockout state on successful login
    await user.update({
      failedLoginAttempts: 0,
      lockoutUntil: null,
      lastLogin: new Date()
    });

    // 5. Role and Power handling (Matching Frontend Expectations)
    const role = user.Role || await Role.findByPk(user.roleId);
    const roleClaims = role ? {
      roleName: role.roleName,
      power: role.power,
      role: {
        id: role.id,
        roleName: role.roleName,
        abbreviation: role.abbreviation,
        power: role.power
      }
    } : {};

    // 6. Generate RS256 tokens with embedded role claims
    const token = user.generateToken(roleClaims);
    const refreshToken = user.generateRefreshToken();

    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          ...userResponse,
          Role: role, // Keep full Role object for frontend permission checks
          role: role ? role.roleName : 'User',
          power: role ? role.power : 'Admin' // Restore power property for Sidenav rendering
        },
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

  

static async logout(req, res) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];

      if (token) {
        // Invalidate session in DB
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

      // Verify refresh token (RS256 with HS256 fallback)
      const jwt = require('jsonwebtoken');
      const { getPublicKey } = require('../utils/keyUtils');
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, getPublicKey(), { algorithms: ['RS256'] });
      } catch (verifyErr) {
        if (process.env.JWT_SECRET && (verifyErr.name === 'JsonWebTokenError' || verifyErr.message.includes('algorithm'))) {
          decoded = jwt.verify(refreshToken, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        } else {
          throw verifyErr;
        }
      }

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
