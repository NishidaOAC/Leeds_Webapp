const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OnboardingStatus = sequelize.define('OnboardingStatus', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { 
    type: DataTypes.ENUM('ONE_YEAR', 'ONE_TIME', 'CONDITIONAL'), 
    allowNull: false 
  },
  label: { type: DataTypes.STRING }, // "One Year", "One Time", "Conditional"
  requiresPo: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'onboarding_statuses', timestamps: false });

module.exports = OnboardingStatus;