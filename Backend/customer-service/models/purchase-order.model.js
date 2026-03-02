const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PurchaseOrder = sequelize.define('PurchaseOrder', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  poNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'purchase_orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = PurchaseOrder;
