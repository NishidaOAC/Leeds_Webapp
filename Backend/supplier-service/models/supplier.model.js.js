const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  internalSupplierNumber: {
    type: DataTypes.STRING,
    unique: true
  },

  onboardingStatusId: {
    type: DataTypes.INTEGER,
    references: { model: 'onboarding_statuses', key: 'id' },
    allowNull: true
  },
  hasQualityCert: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  hasSefAndTradeRef: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  tradeReferences: {
    type: DataTypes.JSON,
    allowNull: true
  },

  poNumber: { type: DataTypes.STRING, allowNull: true },
  poDate: { type: DataTypes.DATEONLY, allowNull: true },
  expiryDate: { type: DataTypes.DATEONLY, allowNull: true },

  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING'
  },
  currentReviewer: {
    type: DataTypes.ENUM('SALES', 'QUALITY'),
    allowNull: false,
    defaultValue: 'SALES'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'suppliers',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Supplier;