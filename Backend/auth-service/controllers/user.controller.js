const { User, Role } = require("../models");
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/emailService');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');


exports.getByRolename = async (req, res) => {
  try {
    const users = await User.findAll({
      include: { model: Role, where: [{ roleName: req.params.roleName} ] }
    });
    res.send(users);
  } catch (error) {
    res.send(error.message );
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    // let whereClause = { separated: false, status: true };
    let whereClause;
    let limit;
    let offset;
    if (req.query.search && req.query.search !== 'undefined') {
      const searchTerm = req.query.search.replace(/\s+/g, '').trim().toLowerCase();
      whereClause = {
        [Op.and]: [
          {
            [Op.or]: [
              sequelize.where(
                sequelize.fn('LOWER', sequelize.fn('REPLACE', sequelize.col('name'), ' ', '')),
                { [Op.like]: `%${searchTerm}%` }
              ),
              sequelize.where(
                sequelize.fn('LOWER', sequelize.fn('REPLACE', sequelize.col('empNo'), ' ', '')),
                { [Op.like]: `%${searchTerm}%` }
              ),
              sequelize.where(
                sequelize.fn('LOWER', sequelize.fn('REPLACE', sequelize.col('email'), ' ', '')),
                { [Op.like]: `%${searchTerm}%` }
              ),
            ]
          },
          // { isActive: true },
          // { separated: false }
        ]
      };
    } else {
      if (req.query.pageSize && req.query.page && req.query.pageSize !== 'undefined' && req.query.page !== 'undefined') {
        limit = parseInt(req.query.pageSize, 10);
        offset = (parseInt(req.query.page, 10) - 1) * limit;
      }
    }
    
    // Fetch paginated data
    const users = await User.findAll({
      where: whereClause,
      order: [['empNo']],
      include: [
        { model: Role, attributes: ['id', 'roleName'] }
      ],
      limit,
      offset
    });

    // Count total records that match the search condition
    const totalCount = await User.count({
      where: whereClause
    });

    // Return the response
    if (req.query.page !== 'undefined' && req.query.pageSize !== 'undefined') {
      const response = {
        count: totalCount,
        items: users // Paginated data
      };

      res.json(response);
    } else {
      res.send(users);
    }
  } catch (error) {
    res.send(error.message);
  }
}

exports.addUser = async (req, res) => {
  const { name, email, empNo, password, roleId } = req.body;

  // Validate required fields
  if (!name || !email || !empNo || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, employee number, and password are required'
    });
  }

  try {
    // FIXED: Use Op.or for OR logic instead of AND
    const userExist = await User.findOne({
      where: { empNo: empNo }
    });
    
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this employee number'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with all required fields and defaults
    const user = await User.create({
      name, 
      empNo, 
      email, 
      password: hashedPassword, 
      roleId: roleId || 1,
      isActive: true,
      status: 'approved',
      failedLoginAttempts: 0,
      passwordChangedAt: new Date()
    });
    
    // Send welcome email
    if (email) {
      try {
        const emailSubject = `Welcome to LeedsAeroSpace Payment App`;
        const fromEmail = process.env.EMAIL_USER;
        const emailPassword = process.env.EMAIL_PASSWORD;
        const frontEndUrl = process.env.FRONT_END || 'http://localhost:4200';
        
        // Simple HTML email
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px;">
              <h2>Welcome to LeedsAeroSpace Payment App</h2>
            </div>
            
            <p>Dear <strong>${name}</strong>,</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
              <p><strong>🎉 Great News!</strong> You have been included in the LeedsAeroSpace Payment Application.</p>
              <p>You can now upload payment documents through our secure portal using your login credentials below.</p>
            </div>
            
            <div style="background: #f0f8ff; padding: 20px; border: 1px solid #007bff; border-radius: 5px; margin: 20px 0;">
              <h3>🔐 Your Login Credentials:</h3>
              <p><strong>Username:</strong> ${empNo}</p>
              <p><strong>Password:</strong> ${password}</p>
              <p><strong>Login URL:</strong> <a href="${frontEndUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0;">Access Payment Portal</a></p>
            </div>
            
            <div style="color: #dc3545; font-weight: bold; background: #ffe6e6; padding: 10px; border-radius: 4px;">
              <p>⚠️ <strong>Security Notice:</strong></p>
              <ul>
                <li>Please keep your login credentials secure and confidential</li>
                <li>Do not share your password with anyone</li>
                <li>Change your password after first login</li>
                <li>Log out after each session</li>
              </ul>
            </div>
            <p>If you need assistance, please contact the system administrator.</p>
            
            <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
              <p><strong>LeedsAeroSpace Finance Department</strong></p>
              <p><em>This is an automated email. Please do not reply to this message.</em></p>
            </div>
          </div>
        `;
        
        if (fromEmail && emailPassword) {
          await sendEmail(fromEmail, emailPassword, email, emailSubject, html);
        } else {
          console.warn('Email credentials not configured, skipping email send');
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
        // Don't fail user creation if email fails
      }
    }

    // Return user without password
    const userResponse = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse
    });
    
  } catch (error) {
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'A user with this email or employee number already exists'
      });
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, roleId, status, isActive, empNo } = req.body;

  try {
    // Find the user to update
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email or empNo is being changed and if they already exist (excluding current user)
    // if (email && email !== user.email) {
    //   const emailExists = await User.findOne({
    //     where: {
    //       email: email,
    //       id: { [Op.ne]: id } // Exclude current user
    //     }
    //   });
      
    //   if (emailExists) {
    //     return res.status(400).json({
    //       success: false,
    //       message: 'Another user already exists with this email'
    //     });
    //   }
    // }

    // Prepare update data
    const updateData = {
      name: name !== undefined ? name : user.name,
      email: email !== undefined ? email : user.email,
      roleId: roleId !== undefined ? roleId : user.roleId,
      status: status !== undefined ? status : user.status,
      isActive: isActive !== undefined ? isActive : user.isActive,
      empNo: empNo !== undefined ? empNo : user.empNo
    };

    // Handle approval logic
    if (status === 'approved' && user.status !== 'approved') {
      // Set approvedBy to current user if not already set
      if (!user.approvedBy && req.user?.id) {
        updateData.approvedBy = req.user.id;
      }
      
      // Set approvedAt timestamp if not already set
      if (!user.approvedAt) {
        updateData.approvedAt = new Date();
      }
      
      // Auto-activate when approving
      if (isActive === undefined) {
        updateData.isActive = true;
      }
    }

    // Handle activation/deactivation
    if (isActive === false) {
      // Reset failed login attempts when deactivating
      updateData.failedLoginAttempts = 0;
    }

    // Update the user
    await user.update(updateData);

    // Get updated user without password
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Role,
        attributes: ['id', 'roleName', 'abbreviation']
      }]
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });

  } catch (error) {
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry. Another user already exists with this email or employee number'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.deleteUser =  async (req, res) => {
  const id = req.params.id
  try {
    const user = await User.findByPk(id)
    // const fileKey = user.url;

    // if(fileKey){
    //   const deleteParams = {
    //     Bucket: process.env.AWS_BUCKET_NAME,
    //     Key: fileKey
    //   };
    //   await s3.deleteObject(deleteParams).promise();
    // }

    // const userDoc = await UserDocument.findAll({ where: {userId: user.id} });
    // if(userDoc.length > 0){
    //     for(let i = 0; i < userDoc.length; i++) {
    //       const docKey = userDoc[i].docUrl;
    //       const deleteParams = {
    //         Bucket: process.env.AWS_BUCKET_NAME,
    //         Key: docKey
    //       };
    //       await s3.deleteObject(deleteParams).promise();
    //     }
    // }

    const result = await user.destroy({
      force: true
    });
    if (result === 0) {
      return res.json({
        status: "fail",
        message: "User with that ID not found",
      });
    }

    res.status(204).json();
  } catch (error) {
    res.send(error.message)
  }
}

exports.validateToken = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in database
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: decoded.email },
          { id: decoded.userId || decoded.id }
        ],
        isActive: true
      },
      attributes: ['id', 'email', 'name', 'roleId', 'isActive', 'createdAt'],
      include: [{ model: Role, attributes: ['id','roleName','abbreviation','power'] }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Return user information
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
        isActive: user.isActive,
        role: user.Role ? {
          id: user.Role.id,
          roleName: user.Role.roleName,
          abbreviation: user.Role.abbreviation,
          power: user.Role.power
        } : null
      },
      tokenInfo: {
        expiresIn: decoded.exp ? new Date(decoded.exp * 1000) : null,
        issuedAt: decoded.iat ? new Date(decoded.iat * 1000) : null
      }
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findOne({
      where: {
        id: userId,
        isActive: true
      },
      attributes: ['id', 'email', 'name', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
      include: { model: Role }
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.validateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'isActive']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      userId: user.id,
      isActive: user.isActive,
      exists: true
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to validate user status'
    });
  }
};

/**
 * Bulk validate users (for batch operations)
 */
exports.bulkValidateUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        success: false,
        message: 'Array of user IDs is required'
      });
    }

    const users = await User.findAll({
      where: {
        id: userIds
      },
      attributes: ['id', 'email', 'name', 'roleId', 'isActive'],
      include: {model: Role}
    });
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = {
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
        roleName: user.Role.roleName,
        abbreviation: user.Role.abbreviation,
        power: user.Role.power,
        isActive: user.isActive,
        exists: true
      };
      return acc;
    }, {});

    // Add non-existent users
    userIds.forEach(id => {
      if (!userMap[id]) {
        userMap[id] = {
          id,
          exists: false,
          isActive: false
        };
      }
    });

    return res.status(200).json({
      success: true,
      users: userMap,
      count: Object.keys(userMap).length
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to validate users'
    });
  }
};

/**
 * Refresh token validation
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findOne({
      where: {
        id: decoded.userId,
        isActive: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId
      }
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired',
        code: 'REFRESH_TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to refresh token'
    });
  }
};

exports.resetPassword = async (req, res) => {
    const { password } = req.body;
    try {
        // If password is provided, hash it
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update the user record
        const updatedUser = await User.update(
            { password: hashedPassword }, 
            { where: { id: req.params.id } }
        )

        if (updatedUser[0] === 1) { 
            res.json({ message: 'User updated successfully', updatedUser });
        } else {
            res.json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getTeamLeaders = async (req, res) => {
  try {
    const role = await Role.findOne({
      where: {
        abbreviation: 'TL'
      }
    });
    console.log(role.id);
    const users = await User.findAll({
      where: {
        roleId: role.id
      }
    });
    res.send(users);
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch team leaders'
    });
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          where: {
            power: 'SalesExecutive',
            abbreviation: { [Op.ne]: 'TL' }
          },
          attributes: [] // remove if you want role data in response
        }
      ]
    });

    res.json(users);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch team members'
    });
  }
};