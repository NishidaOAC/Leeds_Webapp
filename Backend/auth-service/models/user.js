const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const Role = require('./role');

const User = sequelize.define('user', { 
  email: { 
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  empNo: {
    type: DataTypes.STRING,
    unique: true
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('pending_approval', 'approved', 'rejected', 'suspended'),
    defaultValue: 'pending_approval'
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  failedLoginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  passwordChangedAt: {
    type: DataTypes.DATE
  },
  resetPasswordToken: {
    type: DataTypes.STRING
  },
  resetPasswordExpires: {
    type: DataTypes.DATE
  }
}, {
  // ... rest of the model configuration
});

// Instance method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate JWT token
User.prototype.generateToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: this.id, email: this.email, roleId: this.roleId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
};

// Instance method to generate refresh token
User.prototype.generateRefreshToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: this.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
};
    // const salt = await bcrypt.genSalt(12);
    
module.exports = User;