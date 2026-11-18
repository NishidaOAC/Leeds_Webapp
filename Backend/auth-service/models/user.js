const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const Role = require('./role');

const User = sequelize.define('user', { 
  email: { 
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  personalEmail: { 
    type: DataTypes.STRING,
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
    type: DataTypes.STRING
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
  lockoutUntil: {
    type: DataTypes.DATE,
    allowNull: true
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

// Instance method to generate JWT token (RS256 asymmetric)
User.prototype.generateToken = function(extraClaims = {}) {
  const jwt = require('jsonwebtoken');
  const { getPrivateKey } = require('../utils/keyUtils');
  const privateKey = getPrivateKey();

  const roleData = this.Role ? {
    id: this.Role.id,
    roleName: this.Role.roleName,
    abbreviation: this.Role.abbreviation,
    power: this.Role.power
  } : null;

  const payload = {
    id: this.id,
    userId: this.id,
    email: this.email,
    name: this.name,
    empNo: this.empNo,
    roleId: this.roleId,
    isActive: this.isActive,
    status: this.status,
    roleName: (this.Role && this.Role.roleName) || extraClaims.roleName || null,
    power: (this.Role && this.Role.power) || extraClaims.power || null,
    role: roleData || extraClaims.role || null,
    ...extraClaims
  };

  return jwt.sign(
    payload,
    privateKey,
    {
      algorithm: 'RS256',
      expiresIn: process.env.JWT_ACCESS_EXPIRY || process.env.JWT_EXPIRES_IN || '15m'
    }
  );
};

// Instance method to generate refresh token (RS256 asymmetric)
User.prototype.generateRefreshToken = function() {
  const jwt = require('jsonwebtoken');
  const { getPrivateKey } = require('../utils/keyUtils');
  const privateKey = getPrivateKey();
  return jwt.sign(
    { id: this.id, userId: this.id, type: 'refresh' },
    privateKey,
    {
      algorithm: 'RS256',
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
    }
  );
};

module.exports = User;
