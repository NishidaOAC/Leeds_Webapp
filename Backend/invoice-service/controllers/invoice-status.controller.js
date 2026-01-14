const PerformaInvoice = require('../models/PerformaInvoice');
const PerformaInvoiceStatus = require('../models/PerformaInvoiceStatus');

exports.updatePIStatus = async ({
  performaInvoiceId,
  remarks,
  amId,
  accountantId,
  status,
  kamId,
  user
}) => {
  try {
    // Find the Proforma Invoice
    const pi = await PerformaInvoice.findByPk(performaInvoiceId);
    if (!pi) {
      return { success: false, message: 'Proforma Invoice not found.' };
    }
    console.log(pi,"pi founded");
    
    // Validate URLs
    if (!Array.isArray(pi.url) || pi.url.length === 0) {
      return { success: false, message: 'Proforma Invoice does not have an associated file or the URL is invalid.' };
    }

    // Use existing kamId if not provided
    const finalKamId = kamId || pi.kamId;

    // Create new status record
    const newStatus = await PerformaInvoiceStatus.create({
      performaInvoiceId,
      status,
      date: new Date(),
      remarks,
    });

    // Update PI record
    pi.status = status;
    if (finalKamId != null) pi.kamId = finalKamId;
    if (amId != null) pi.amId = amId;
    if (accountantId != null) pi.accountantId = accountantId;
    await pi.save();

    return {
      success: true,
      data: { pi, status: newStatus },
      kamId: finalKamId
    };

  } catch (error) {
    console.error('Error updating PI status:', error);
    return { success: false, message: error.message };
  }
};

exports.getPiStatuses = async (req, res) => {
    try {
        
        let whereClause = { performaInvoiceId: req.query.id };
        if (req.query.search && req.query.search != 'undefined') {
            const searchTerm = req.query.search.replace(/\s+/g, '').trim().toLowerCase();
            whereClause = {
              [Op.or]: [
                sequelize.where(
                  sequelize.fn('LOWER', sequelize.fn('REPLACE', sequelize.col('status'), ' ', '')),
                  {
                    [Op.like]: `%${searchTerm}%`
                  }
                )
              ], performaInvoiceId: req.query.id
            };
          }
        const piStatus = await PerformaInvoiceStatus.findAll({
            order:[['id','DESC']],
            where: whereClause
        })
        res.send(piStatus);
    } catch (error) {
        res.send(error.message)
    }
}