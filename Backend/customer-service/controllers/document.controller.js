
const Customer = require('../models/customer.model');
const Document = require('../models/document.model');
const { getYearEndExpiry } = require('../utils/expiry.util');

exports.uploadDocument = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { documentType } = req.body;

    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const payload = {
      customerId,
      documentType
    };

    if (
      ['AIRLINE', 'MRO'].includes(customer.customerType) &&
      ['KYC', 'EXPORT_COMPLIANCE'].includes(documentType)
    ) {
      payload.validFrom = new Date();
      payload.validTo = getYearEndExpiry();
      payload.isOneTime = false;
    } else {
      payload.isOneTime = true;
    }

    const document = await Document.create(payload);
    res.status(201).json(document);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
