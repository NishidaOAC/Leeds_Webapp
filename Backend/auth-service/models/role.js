const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('Role', {
  roleName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },  
  abbreviation: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  power: {
    type: DataTypes.ENUM('Admin','SalesExecutive','KAM','Manager','Accountant'),
    allowNull: false,
    defaultValue: 'Admin'
  },
  description: {
    type: DataTypes.TEXT
  },
  permissions: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Role;
