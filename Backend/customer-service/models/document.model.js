const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  s3Key: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileSize: {
    type: DataTypes.INTEGER, // in bytes
    allowNull: true
  },
  mimeType: {
    type: DataTypes.STRING, // e.g., 'application/pdf'
    allowNull: true
  },
  documentType: {
    type: DataTypes.ENUM('KYC', 'EXPORT_COMPLIANCE', 'EUC', 'ECC', 'TAX_ID', 'INSURANCE'),
    allowNull: false
  },
  validFrom: {
    type: DataTypes.DATE
  },
  validTo: {
    type: DataTypes.DATE
  },
  isOneTime: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'ACTIVE', 'EXPIRED', 'REJECTED'),
    defaultValue: 'PENDING'
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true // Useful for explaining why a doc was rejected
  },
  uploadedBy: {
    type: DataTypes.STRING, // Store user ID or name
    allowNull: true
  }
}, {
  tableName: 'documents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Document;