const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PerformaInvoiceStatus = sequelize.define('PerformaInvoiceStatus', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  performaInvoiceId: DataTypes.INTEGER,
  status: DataTypes.STRING,
  date: DataTypes.DATE,
  comment: DataTypes.TEXT,
  changedBy: DataTypes.INTEGER,
});

PerformaInvoiceStatus.sync({ force: true }).then(() => {
    console.log('Tables synced successfully.');
}).catch(err => {
    console.error('Error syncing tables:', err);
});

module.exports = PerformaInvoiceStatus;
