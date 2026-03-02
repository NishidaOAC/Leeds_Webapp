const Customer = require('./customer.model');
const Document = require('./document.model');
const PurchaseOrder = require('./purchase-order.model');
const PODocument = require('./po-document.model');

Customer.hasMany(Document, { foreignKey: 'customerId' });
Document.belongsTo(Customer, { foreignKey: 'customerId' });

Customer.hasMany(PurchaseOrder, { foreignKey: 'customerId' });
PurchaseOrder.belongsTo(Customer, { foreignKey: 'customerId' });

PurchaseOrder.hasMany(PODocument, { foreignKey: 'poId' });
PODocument.belongsTo(PurchaseOrder, { foreignKey: 'poId' });

module.exports = {
  Customer,
  Document,
  PurchaseOrder,
  PODocument
};
