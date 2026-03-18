const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OnboardingStatus = sequelize.define('OnboardingStatus', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  code: { 
    type: DataTypes.ENUM('ONE_YEAR', 'ONE_TIME', 'CONDITIONAL'), 
    allowNull: false,
    unique: true 
  },
  label: { 
    type: DataTypes.STRING, 
    allowNull: false // e.g., "One Year Approval"
  },
  requiresPo: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
}, {
  tableName: 'onboarding_statuses',
  timestamps: false
});

module.exports = OnboardingStatus;