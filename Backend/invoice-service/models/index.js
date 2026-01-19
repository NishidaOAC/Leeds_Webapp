const { sequelize } = require('../config/database');
const PerformaInvoice = require('./PerformaInvoice');
const PerformaInvoiceStatus = require('./PerformaInvoiceStatus');
const Company = require('./company');

// Define associations
PerformaInvoiceStatus.belongsTo(PerformaInvoice, { foreignKey: 'performaInvoiceId' });
PerformaInvoice.hasMany(PerformaInvoiceStatus, { foreignKey: 'performaInvoiceId' });



// Supplier association
Company.hasMany(PerformaInvoice, {as: 'suppliers', foreignKey: 'supplierId', onUpdate: 'CASCADE'});
PerformaInvoice.belongsTo(Company, {as: 'suppliers',foreignKey: 'supplierId',onUpdate: 'CASCADE'});

// // Customer association
Company.hasMany(PerformaInvoice, {as: 'customers',foreignKey: 'customerId',onUpdate: 'CASCADE'});
PerformaInvoice.belongsTo(Company, {as: 'customers',foreignKey: 'customerId',onUpdate: 'CASCADE'});

const models = {
  PerformaInvoice,
  PerformaInvoiceStatus,
  Company
};

module.exports = models;