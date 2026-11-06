const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SupplierDocument = sequelize.define('SupplierDocument', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  supplierId: { 
    type: DataTypes.UUID, 
    allowNull: false,
    field: 'supplier_id' 
  },
  documentType: { 
    type: DataTypes.STRING, 
    field: 'document_type' 
  },
  s3Key: { 
    type: DataTypes.STRING, 
    field: 's3_key' 
  },
  fileName: { 
    type: DataTypes.STRING, 
    field: 'file_name' 
  },
  fileUrl: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    field: 'file_url' 
  },
  
status: {
  type: DataTypes.STRING,
  defaultValue: 'ACTIVE'
},
  remarks: { type: DataTypes.TEXT }
}, {
  tableName: 'supplier_documents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = SupplierDocument;