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
    allowNull: false,
    // No need for 'field' if underscored: true is set below
  },
  s3Key: { type: DataTypes.STRING, allowNull: true },
  fileName: { type: DataTypes.STRING, allowNull: true },
  fileSize: { type: DataTypes.INTEGER, allowNull: true },
  mimeType: { type: DataTypes.STRING, allowNull: true },
  documentType: {
    type: DataTypes.ENUM('KYC', 'EXPORT_COMPLIANCE', 'EUC', 'ECC', 'TAX_ID', 'INSURANCE'),
    allowNull: false,
    defaultValue: 'KYC' // Prevents "contains null values" crash
  },
  validFrom: { type: DataTypes.DATE },
  validTo: { type: DataTypes.DATE },
  isOneTime: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: {
    type: DataTypes.ENUM('PENDING', 'ACTIVE', 'EXPIRED', 'REJECTED'),
    defaultValue: 'PENDING'
  },
  remarks: { type: DataTypes.TEXT, allowNull: true },
  uploadedBy: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'documents',
  timestamps: true,
  underscored: true, // Automatically maps camelCase to snake_case
});

module.exports = Document;