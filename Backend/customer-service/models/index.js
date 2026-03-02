const Customer = require('./customer.model');
const Document = require('./document.model');

// Define Associations
Customer.hasMany(Document, { 
  foreignKey: 'customerId', 
  as: 'Documents' 
});

Document.belongsTo(Customer, { 
  foreignKey: 'customerId',
  as: 'Customer'
});

module.exports = {
  Customer,
  Document
};