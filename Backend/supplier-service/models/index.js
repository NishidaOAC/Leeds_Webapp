const OnboardingStatus = require("./OnboardingStatus.js");
const Supplier = require("./supplier.model.js");
const SupplierDocument = require("./supplierDocument.model");

// 1. Documents Association
Supplier.hasMany(SupplierDocument, { 
  foreignKey: 'supplier_id', 
  as: 'Documents' 
});

SupplierDocument.belongsTo(Supplier, { 
  foreignKey: 'supplier_id' 
});

// 2. Onboarding Status Association (CLEANED UP)
// Use ONE consistent definition. 
// If your DB column is onboarding_status_id, use that for the foreignKey.
Supplier.belongsTo(OnboardingStatus, { 
    foreignKey: 'onboarding_status_id', 
    as: 'OnboardingStatus' 
});

OnboardingStatus.hasMany(Supplier, { 
    foreignKey: 'onboarding_status_id' 
});

module.exports = { Supplier, SupplierDocument, OnboardingStatus }; // Export Status too!