// models/OnboardingStatus.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class OnboardingStatus extends Model {
  static async seed() {
    const statuses = [
      { id: 1, code: 'ONE_YEAR', label: 'One Year Approval', requiresPo: false },
      { id: 2, code: 'ONE_TIME', label: 'One Time Approval', requiresPo: true },
      { id: 3, code: 'CONDITIONAL', label: 'Conditional Approval', requiresPo: true }
    ];

    try {
      for (const status of statuses) {
        await this.findOrCreate({
          where: { code: status.code },
          defaults: status
        });
      }
      console.log('✅ Onboarding Statuses Seeded');
    } catch (error) {
      console.error('❌ Seeding Error:', error);
    }
  }
}

OnboardingStatus.init({
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  code: { 
    // Remove 'unique: true' from here to stop the SQL syntax error
    type: DataTypes.ENUM('ONE_YEAR', 'ONE_TIME', 'CONDITIONAL'), 
    allowNull: false 
  },
  label: { type: DataTypes.STRING, allowNull: false },
  requiresPo: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { 
  sequelize, 
  tableName: 'onboarding_statuses', 
  timestamps: false 
});

module.exports = OnboardingStatus;