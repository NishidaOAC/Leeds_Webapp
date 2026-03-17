const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerType: {
    type: DataTypes.ENUM('AIRLINE', 'MRO', 'OTHER'),
    allowNull: false,
    defaultValue: 'OTHER' // Prevents crash if existing rows are empty
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'customers',
  timestamps: true,
  underscored: true, // Maps camelCase (createdAt) to snake_case (created_at)
});

module.exports = Customer;