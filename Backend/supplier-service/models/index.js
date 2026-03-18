const OnboardingStatus = require("./OnboardingStatus.js");
const Supplier = require("./supplier.model.js");
const SupplierDocument = require("./supplierDocument.model");


Supplier.hasMany(SupplierDocument, { 
  foreignKey: 'supplier_id', 
  as: 'Documents' // This alias must match what you use in your Controller 'include'
});

SupplierDocument.belongsTo(Supplier, { 
  foreignKey: 'supplier_id' 
});

Supplier.belongsTo(OnboardingStatus, { foreignKey: 'onboardingStatusId' });
OnboardingStatus.hasMany(Supplier, { foreignKey: 'onboardingStatusId' });

module.exports = { Supplier, SupplierDocument };