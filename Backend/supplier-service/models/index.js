const Supplier = require("./supplier.model.js");
const SupplierDocument = require("./supplierDocument.model");


Supplier.hasMany(SupplierDocument, { 
  foreignKey: 'supplier_id', 
  as: 'Documents' // This alias must match what you use in your Controller 'include'
});

SupplierDocument.belongsTo(Supplier, { 
  foreignKey: 'supplier_id' 
});

module.exports = { Supplier, SupplierDocument };