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
  // Added JSON field for multi-cert support
  certifications: {
    type: DataTypes.JSON, 
    allowNull: true,
    comment: "Stores array: [{type: 'FAA', expiry: '2026-01-01', s3Key: 'path/to/file.pdf'}]"
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
  // Add this field right underneath your certifications field
  additionalDocuments: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: "Stores array for conditional cases: [{description: 'One time approval sign-off', s3Key: 'path/to/doc.pdf'}]"
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  addedBy: {
  type: DataTypes.INTEGER,
  allowNull: true
},
}, {
  tableName: 'suppliers',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Supplier;