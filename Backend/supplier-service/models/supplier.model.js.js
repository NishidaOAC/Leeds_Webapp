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
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  internalSupplierNumber: {
    type: DataTypes.STRING,
    unique: true
  },
  hasQualityCert: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING'
  },
  currentReviewer: {
    type: DataTypes.ENUM('SALES', 'QUALITY'),
    allowNull: false
  },
  expiryDate: {
    type: DataTypes.DATEONLY
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Inside your Supplier Model
tradeReferences: {
  type: DataTypes.JSON, // Stores the array of 4 objects as a JSON string
  allowNull: true
},
}, {
  tableName: 'suppliers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Supplier;