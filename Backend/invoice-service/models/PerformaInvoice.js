const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PerformaInvoice = sequelize.define('PerformaInvoice',{
    piNo : {type : DataTypes.STRING, allowNull : false},
    url: { type: DataTypes.ARRAY(DataTypes.JSON), allowNull: true },
    bankSlip : {type : DataTypes.STRING},
    status: {type : DataTypes.STRING, defaultValue: 'Generated'},
    salesPersonId :{type : DataTypes.INTEGER },
    kamId : {type : DataTypes.INTEGER, allowNull : true},
    amId: {type : DataTypes.INTEGER, allowNull : true},
    accountantId : {type : DataTypes.INTEGER, allowNull : true},
    count: {type : DataTypes.INTEGER, defaultValue: 1},

    supplierId: { type: DataTypes.INTEGER},
    supplierSoNo: { type: DataTypes.STRING },
    supplierPoNo: { type: DataTypes.STRING },
    supplierCurrency: { type: DataTypes.STRING },
    supplierPrice: { type: DataTypes.STRING },
    
    customerId: { type: DataTypes.INTEGER, allowNull : true},
    customerSoNo: { type: DataTypes.STRING },
    customerPoNo: { type: DataTypes.STRING },
    customerCurrency: { type: DataTypes.STRING },
    poValue: { type: DataTypes.STRING },
    paymentMode:  { type: DataTypes.STRING },


    purpose: { type: DataTypes.STRING },
    addedById: { type: DataTypes.INTEGER },
    notes:  { type: DataTypes.TEXT }
})

PerformaInvoice.sync({ alter: true }).then(() => {
    console.log('Tables synced successfully.');
}).catch(err => {
    console.error('Error syncing tables:', err);
});

module.exports = PerformaInvoice;
