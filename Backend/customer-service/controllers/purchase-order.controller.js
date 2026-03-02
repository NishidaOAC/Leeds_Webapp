const PurchaseOrder = require("../models/purchase-order.model");
const PODocument = require("../models/po-document.model");

exports.createPO = async (req, res) => {
  try {
    const po = await PurchaseOrder.create(req.body);
    res.status(201).json(po);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadPODocument = async (req, res) => {
  try {
    const { poId } = req.params;
    const { documentType } = req.body;

    if (!['EUC', 'ECC'].includes(documentType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const doc = await PODocument.create({ poId, documentType });
    res.status(201).json(doc);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validatePO = async (req, res) => {
  const { poId } = req.params;

  const docs = await PODocument.findAll({ where: { poId } });
  const types = docs.map(d => d.documentType);

  if (!types.includes('EUC') || !types.includes('ECC')) {
    return res.status(400).json({
      message: 'EUC and ECC are mandatory for every PO'
    });
  }

  res.json({ message: 'PO is valid' });
};
