const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PODocument = sequelize.define('PODocument', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  poId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  documentType: {
    type: DataTypes.ENUM('EUC', 'ECC'),
    allowNull: false
  }
}, {
  tableName: 'po_documents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = PODocument;
