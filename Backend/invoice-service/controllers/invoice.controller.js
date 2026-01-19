const { PerformaInvoice, PerformaInvoiceStatus, Company } = require('../models');
const { publishEvent } = require('../utils/eventPublisher');
const axios = require('axios');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { findUsersByIds, getAllowedUserIdsForUser, getTeamUsers } = require('../utils/userFinder');
const { getUserById } = require('../utils/userFinder');
const emailService = require('../services/emailService');
const notificationService = require('../services/notificationService');
// Removed unused nodemailer/ExcelJS and legacy email signature helpers


exports.dashboardCreditCard = async (req, res) => {
  try {
    const status = req.query.status;
    const where = { paymentMode: 'CreditCard' };

    if (status && status !== 'undefined') {
      where.status = status;
    }

    let limit, offset;
    if (
      req.query.pageSize &&
      req.query.page &&
      req.query.pageSize !== 'undefined' &&
      req.query.page !== 'undefined'
    ) {
      limit = parseInt(req.query.pageSize, 10);
      offset = (parseInt(req.query.page, 10) - 1) * limit;
    }

    // 1️⃣ Fetch invoices
    const invoices = await PerformaInvoice.findAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      include: [{ model: PerformaInvoiceStatus }]
    });

    const totalCount = await PerformaInvoice.count({ where });

    // 2️⃣ Collect unique userIds
    const userIds = [
      ...new Set(
        invoices.flatMap(inv => [
          inv.salesPersonId,
          inv.kamId,
          inv.amId,
          inv.accountantId,
          inv.addedById
        ]).filter(Boolean)
      )
    ];

    // 3️⃣ Fetch users using helper
    const usersMap = await findUsersByIds(
      userIds,
      req.headers.authorization
    );

    // 4️⃣ Enrich invoices
    const enrichedInvoices = invoices.map(inv => {
      const i = inv.toJSON();
      return {
        ...i,
        salesPerson: usersMap[i.salesPersonId] || null,
        kam: usersMap[i.kamId] || null,
        am: usersMap[i.amId] || null,
        accountant: usersMap[i.accountantId] || null,
        addedBy: usersMap[i.addedById] || null,
      };
    });

    // 5️⃣ Response
    if (limit !== undefined) {
      res.json({ count: totalCount, items: enrichedInvoices });
    } else {
      res.json(enrichedInvoices);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.dashboardWireTransfer = async (req, res) => {
  try {
    const status = req.query.status;
    const where = { paymentMode: 'WireTransfer' };

    if (status && status !== 'undefined') {
      where.status = status;
    }

    let limit, offset;
    if (
      req.query.pageSize &&
      req.query.page &&
      req.query.pageSize !== 'undefined' &&
      req.query.page !== 'undefined'
    ) {
      limit = parseInt(req.query.pageSize, 10);
      offset = (parseInt(req.query.page, 10) - 1) * limit;
    }

    // 1️⃣ Fetch invoices (NO User includes)
    const invoices = await PerformaInvoice.findAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      include: [{ model: PerformaInvoiceStatus }]
    });

    const totalCount = await PerformaInvoice.count({ where });

    // 2️⃣ Collect unique userIds
    const userIds = [
      ...new Set(
        invoices.flatMap(inv => [
          inv.salesPersonId,
          inv.kamId,
          inv.amId,
          inv.accountantId,
          inv.addedById
        ]).filter(Boolean)
      )
    ];

    // 3️⃣ Fetch users from auth-service
    const usersMap = await findUsersByIds(
      userIds,
      req.headers.authorization
    );

    // 4️⃣ Enrich invoices with user info
    const enrichedInvoices = invoices.map(inv => {
      const i = inv.toJSON();
      return {
        ...i,
        salesPerson: usersMap[i.salesPersonId] || null,
        kam: usersMap[i.kamId] || null,
        am: usersMap[i.amId] || null,
        accountant: usersMap[i.accountantId] || null,
        addedBy: usersMap[i.addedById] || null,
      };
    });

    // 5️⃣ Response
    if (limit !== undefined) {
      res.json({
        count: totalCount,
        items: enrichedInvoices
      });
    } else {
      res.json(enrichedInvoices);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.saveInvoice = async (req, res) => {
  try {
    const { piNo, ...invoiceData } = req.body;
    const userId = req.user.id;

    const existingInvoice = await PerformaInvoice.findOne({ where: { piNo } });
    if (existingInvoice) {
      return res.status(400).json({ error: 'Invoice already exists' });
    }

    const status =
      invoiceData.paymentMode === 'CreditCard'
        ? 'INITIATED'
        : 'GENERATED';

    const invoice = await PerformaInvoice.create({
      ...invoiceData,
      piNo,
      status,
      salesPersonId: userId,
      addedById: userId,
    });

    await PerformaInvoiceStatus.create({
      performaInvoiceId: invoice.id,
      status,
      date: new Date(),
    });

    await publishEvent('INVOICE_CREATED', {
      invoiceId: invoice.id,
      piNo: invoice.piNo,
      status: invoice.status,
      userId,
      recipientId:
        invoiceData.paymentMode === 'CreditCard'
          ? invoiceData.amId
          : invoiceData.kamId,
    });

    await publishEvent('SEND_EMAIL', {
      type: 'INVOICE_CREATED',
      invoice: invoice.toJSON(),
      recipientEmail: req.body.recipientEmail,
    });

    res.json({
      pi: invoice,
      message: 'Invoice saved successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findInvoices = async (req, res) => {
  const { status, page, pageSize, role } = req.query;
  // const userId = req.user.id;

  let where = {};

  // if (role === 'sales') where.salesPersonId = userId;
  // if (role === 'kam') where.kamId = userId;
  // if (role === 'am') where.amId = userId;
  // if (role === 'accountant') where.accountantId = userId;

  if (status && status !== 'undefined') {
    where.status = status;
  }

  const limit = parseInt(pageSize) || 10;
  const offset = page ? (parseInt(page) - 1) * limit : 0;

  const result = await PerformaInvoice.findAndCountAll({
    // where,
    // limit,
    // offset,
    order: [['id', 'DESC']],
  });

  res.json({ count: result.count, items: result.rows });
};

exports.updateInvoiceStatus = async (req, res) => {
  const { status, comment } = req.body;
  const userId = req.user.id;

  const validTransitions = {
    GENERATED: ['KAM_VERIFIED', 'KAM_REJECTED'],
    KAM_VERIFIED: ['AM_VERIFIED', 'AM_REJECTED'],
    AM_VERIFIED: ['ACCOUNTANT_APPROVED', 'ACCOUNTANT_REJECTED'],
    AM_APPROVED: ['CARD_PAYMENT_SUCCESS', 'PAYMENT_FAILED'],
  };

  try {
    const invoice = await PerformaInvoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    if (!validTransitions[invoice.status]?.includes(status)) {
      return res.status(400).json({ error: 'Invalid status transition' });
    }

    const oldStatus = invoice.status;
    invoice.status = status;
    await invoice.save();

    await PerformaInvoiceStatus.create({
      performaInvoiceId: invoice.id,
      status,
      date: new Date(),
      comment,
      changedBy: userId,
    });

    await publishEvent('INVOICE_STATUS_CHANGED', {
      invoiceId: invoice.id,
      oldStatus,
      newStatus: status,
      changedBy: userId,
      comment,
    });

    res.json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPI =  async(req, res) => {
    let status = req.query.status;
    
    let where = {};
    if(status != '' && status != 'undefined'){
        where = { status: status}
    }

    let limit; 
    let offset; 
    if (req.query.pageSize && req.query.page && req.query.pageSize != 'undefined' && req.query.page != 'undefined') {
        limit = parseInt(req.query.pageSize, 10);
        offset = (parseInt(req.query.page, 10) - 1) * limit;
    }

    try {
        const pi = await PerformaInvoice.findAll({
            where: where, limit, offset,
            order: [['id', 'DESC']],
            include:[
                { model: Company, as: 'suppliers' }, 
                { model: Company, as: 'customers' }, 
                { model: PerformaInvoiceStatus }
            ],
        })
        const totalCount = await PerformaInvoice.count({ where: where });

        if (req.query.pageSize && req.query.page && req.query.pageSize != 'undefined' && req.query.page != 'undefined') {
            const response = {
                count: totalCount,
                items: pi,
            };
            res.json(response);
        } else {
            res.send(pi);
        }
    } catch (error) {
        res.send(error.message)
    }
}

exports.addPI = async (req, res) => {
    let { piNo, url, kamId, amId, supplierId, supplierSoNo, supplierPoNo, supplierCurrency, supplierPrice, purpose, customerId,
        customerPoNo, customerSoNo, customerCurrency, poValue, notes, paymentMode } = req.body;
    if (Array.isArray(purpose)) {
        purpose = purpose.join(', ');
    }
    const userId = req.user.id;
    let status;

    kamId = kamId === '' ? null : kamId;
    amId = amId === '' ? null : amId;
    customerId = customerId === '' ? null : customerId;

    if (paymentMode === 'CreditCard') {
        if (!amId) {
            return res.send('Please Select Account Manager');
        }
        status = 'INITIATED';
    } else if (paymentMode === 'WireTransfer') {
        if (!kamId) {
            return res.send('Please Select Key Account Manager');
        }
        status = 'GENERATED';
    }

    try {
        let recipientEmail = null;
        let notificationRecipientId = null;
        
        // Get recipient info based on payment mode
        if (paymentMode === 'CreditCard') {
            const am = await getUserById(
                amId,
                req.headers.authorization
            );
            recipientEmail = am.user ? am.user.email : null;
            notificationRecipientId = amId;
            if (!recipientEmail) {
                return res.send("AM project email is missing.\n Please inform the admin to add it.");
            }
        } else if (paymentMode === 'WireTransfer') {
            const kam = await getUserById(
                kamId,
                req.headers.authorization
            );
            recipientEmail = kam.user ? kam.user.email : null;
            notificationRecipientId = kamId;
            if (!recipientEmail) {
                return res.send("KAM project email is missing. \n Please inform the admin to add it.");
            }
        }

        // Check for existing invoice
        const existingInvoice = await PerformaInvoice.findOne({ where: { piNo } });
        if (existingInvoice) {
            return res.json({ error: 'Invoice is already saved' });
        }

        // Create new PI
        const newPi = await PerformaInvoice.create({
            piNo, url, status, salesPersonId: userId, kamId, supplierId, amId,
            supplierSoNo, supplierPoNo, supplierCurrency, supplierPrice, purpose,
            customerId, customerPoNo, customerSoNo, customerCurrency, poValue,
            addedById: userId, notes, paymentMode
        });

        // Create status record
        await PerformaInvoiceStatus.create({
            performaInvoiceId: newPi.id,
            status,
            date: new Date(),
        });

        // Handle different URL formats
        let urlsToProcess = [];
        
        if (Array.isArray(url)) {
            // If URL is an array of objects with url property
            urlsToProcess = url.map(item => item.url).filter(Boolean);
        } else if (typeof url === 'string') {
            // If URL is a simple string
            urlsToProcess = [url];
        } else if (url && url.url) {
            // If URL is an object with url property
            urlsToProcess = [url.url];
        }
        
        const emailContent = await emailService.prepareNewPIEmailContent({
            supplierId,
            customerId,
            urls: urlsToProcess  // Pass as urls (plural)
        });

        // Get finance emails
        const financeEmails = await emailService.findFinanceEmails();
        // Ensure attachments is always an array
        const emailAttachments = Array.isArray(emailContent.attachments) ? emailContent.attachments : [];
        // Send email using EmailService
        const emailResult = await emailService.sendNewPIEmail({
            piNo,
            supplierName: emailContent.supplierName,
            supplierPoNo,
            supplierSoNo,
            supplierPrice,
            supplierCurrency,
            status,
            paymentMode,
            purpose,
            customerName: emailContent.customerName,
            customerPoNo,
            customerSoNo,
            poValue,
            customerCurrency,
            notes,
            requestedBy: req.user.name,
            toEmail: recipientEmail,
            ccEmails: financeEmails,
            attachments: emailAttachments
        });
        try {
            // Assuming notification service runs on port 3001
            // You can make this configurable via environment variables
            const notificationResponse = await axios.post(`${process.env.AUTH_SERVICE_URL}/notification/create`, {
                userId: notificationRecipientId,
                message: `New Payment Request Generated ${piNo} / ${supplierPoNo}`,
                isRead: false,
                type: 'PI_CREATED', // Add type if your notification service supports it
                metadata: {
                    piNo: piNo,
                    piId: newPi.id,
                    paymentMode: paymentMode,
                    requestedBy: req.user.name,
                    supplierPoNo: supplierPoNo
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authentication headers if needed
                    'Authorization': req.headers.authorization || ''
                }
            });
        } catch (notificationError) {
            // Log the error but don't fail the main operation
            console.error('Failed to create notification:', notificationError.message);
            // You might want to implement a retry mechanism or queue for failed notifications
        }

        res.json({
            pi: newPi,
            message: 'Proforma Invoice saved successfully and email sent.'
        });
    } catch (error) {
        console.error('Error in addPI:', error);
        res.status(500).send(error.message);
    }
}

exports.updatePIBySE = async (req, res) => {
    let { url, kamId, supplierId, supplierSoNo, supplierPoNo, supplierCurrency, supplierPrice, purpose, 
        customerId, customerSoNo, customerPoNo, customerCurrency, poValue, notes, paymentMode, amId } = req.body;

    if (Array.isArray(purpose)) {
        purpose = purpose.join(', ');
    }
    
    kamId = kamId === '' ? null : kamId;
    amId = amId === '' ? null : amId;
    customerId = customerId === '' ? null : customerId;

    let recipientEmail = null;
    let notificationRecipientId = null;

    try {
        // Get recipient info based on payment mode
        if (paymentMode === 'CreditCard') {
            if (!amId) {
                return res.send('Please select Account Manager and proceed');
            }
            const am = await getUserById(
                amId,
                req.headers.authorization
            );
            recipientEmail = am.user ? am.user.email : null;
            notificationRecipientId = amId;

            if (!recipientEmail) {
                return res.send("AM email is missing. Please inform the admin to add it.");
            }
        } else if (paymentMode === 'WireTransfer') {
            if (!kamId) {
                return res.send('Please select Key Account Manager and proceed');
            }
            const kam = await getUserById(
                kamId,
                req.headers.authorization
            );
            recipientEmail = kam.user ? kam.user.email : null;
            notificationRecipientId = kamId;

            if (!recipientEmail) {
                return res.send("KAM email is missing. Please inform the admin to add it.");
            }
        }
    } catch (error) {
        console.error('Error getting user info:', error);
        return res.status(500).send(error.message);
    }

    try {
        const pi = await PerformaInvoice.findByPk(req.params.id);
        if (!pi) {
            return res.status(404).send('Proforma Invoice not found.');
        }

        const piNo = pi.piNo;
        let status;

        if (paymentMode === 'CreditCard') {
            if (!amId) {
                return res.send('Please select Account Manager.');
            }
            status = 'INITIATED';
        } else if (paymentMode === 'WireTransfer') {
            if (!kamId) {
                return res.send('Please select Key Account Manager.');
            }
            status = 'GENERATED';
        }

        // Update PI
        const updateData = {
            url,
            kamId,
            amId,
            count: pi.count + 1,
            status,
            supplierSoNo,
            supplierId,
            supplierPoNo,
            supplierCurrency,
            supplierPrice,
            purpose,
            customerId,
            customerSoNo,
            customerPoNo,
            customerCurrency,
            poValue,
            paymentMode,
            notes
        };

        await pi.update(updateData);

        // Create status record
        await PerformaInvoiceStatus.create({
            performaInvoiceId: pi.id,
            status: status,
            date: new Date(),
            count: pi.count
        });

        // Handle different URL formats for email attachments
        let urlsToProcess = [];
        
        if (Array.isArray(url)) {
            // If URL is an array of objects with url property
            urlsToProcess = url.map(item => item.url || item.file).filter(Boolean);
        } else if (typeof url === 'string') {
            // If URL is a simple string
            urlsToProcess = [url];
        } else if (url && (url.url || url.file)) {
            // If URL is an object with url or file property
            urlsToProcess = [url.url || url.file];
        }

        const emailContent = await emailService.prepareNewPIEmailContent({
            supplierId,
            customerId,
            urls: urlsToProcess
        });

        // Get finance emails for CC
        const financeEmails = await emailService.findFinanceEmails();
        
        // Ensure attachments is always an array
        const emailAttachments = Array.isArray(emailContent.attachments) ? emailContent.attachments : [];

        // Send email using EmailService
        const emailResult = await emailService.sendUpdatedPIEmail({
            piNo: piNo,
            supplierName: emailContent.supplierName,
            supplierPoNo: supplierPoNo,
            supplierSoNo: supplierSoNo,
            supplierPrice: supplierPrice,
            supplierCurrency: supplierCurrency,
            status: status,
            paymentMode: paymentMode,
            purpose: purpose,
            customerName: emailContent.customerName,
            customerPoNo: customerPoNo,
            customerSoNo: customerSoNo,
            customerCurrency: customerCurrency,
            poValue: poValue,
            notes: notes,
            updatedBy: req.user.name,
            toEmail: recipientEmail,
            ccEmails: financeEmails,
            attachments: emailAttachments,
            action: 'updated'
        });

        try {
            // Send notification to notification service
            const notificationResponse = await axios.post(`${process.env.AUTH_SERVICE_URL}/notification/create`, {
                userId: notificationRecipientId,
                message: `Payment Request Updated ${piNo} / ${supplierPoNo}`,
                isRead: false,
                type: 'PI_UPDATED',
                metadata: {
                    piNo: piNo,
                    piId: pi.id,
                    paymentMode: paymentMode,
                    updatedBy: req.user.name,
                    supplierPoNo: supplierPoNo,
                    updatedAt: new Date().toISOString()
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization || ''
                }
            });
        } catch (notificationError) {
            // Log the error but don't fail the main operation
            console.error('Failed to create notification:', notificationError.message);
        }

        res.json({
            piNo: piNo,
            status: status,
            pi: pi,
            message: 'Proforma Invoice updated successfully'
        });

    } catch (error) {
        console.error('Error in updatePIBySE:', error);
        res.status(500).send(error.message);
    }
};

exports.addPIKAM = async (req, res) => {
    let { 
        piNo, url, amId, supplierId, supplierSoNo, supplierPoNo, 
        supplierCurrency, supplierPrice, purpose, customerId,
        customerPoNo, customerSoNo, customerCurrency, poValue,  
        notes, paymentMode 
    } = req.body;

    // Handle array purpose (if coming from multi-select)
    if (Array.isArray(purpose)) {
        purpose = purpose.join(', ');
    }

    const userId = req.user.id;
    
    // Validate required fields
    if (!amId) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please Select Manager to be assigned' 
        });
    }

    // Determine status based on payment mode
    let status;
    if (paymentMode === 'CreditCard') {
        status = 'INITIATED';
    } else {
        status = 'KAM VERIFIED';
    }

    try {
        // 1. Get recipient information (using auth service since users are in different DB)
        const am = await emailService.getRecipientInfo(amId, req.headers.authorization);
        console.log(am);
        
        if (!am || !am.email) {
            return res.status(400).json({ 
                success: false, 
                message: "AM email is missing. Please inform the admin to add it." 
            });
        }

        // 2. Check for duplicate invoice
        const existingInvoice = await PerformaInvoice.findOne({ where: { piNo } });
        if (existingInvoice) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invoice is already saved' 
            });
        }

        // 3. Create new invoice
        const newPi = await PerformaInvoice.create({
            piNo, 
            url, 
            status, 
            kamId: userId, 
            amId, 
            supplierId,
            supplierSoNo, 
            supplierPoNo, 
            supplierCurrency, 
            supplierPrice, 
            purpose, 
            customerId, 
            customerPoNo, 
            customerSoNo,
            customerCurrency, 
            poValue, 
            addedById: userId, 
            notes, 
            paymentMode
        });

        // 4. Create status record
        await PerformaInvoiceStatus.create({
            performaInvoiceId: newPi.id,
            status: status,
            date: new Date(),
        });
        // Handle different URL formats
        let urlsToProcess = [];
        
        if (Array.isArray(url)) {
            // If URL is an array of objects with url property
            urlsToProcess = url.map(item => item.url).filter(Boolean);
        } else if (typeof url === 'string') {
            // If URL is a simple string
            urlsToProcess = [url];
        } else if (url && url.url) {
            // If URL is an object with url property
            urlsToProcess = [url.url];
        }
        // 5. Prepare email content
        const emailContent = await emailService.prepareNewPIEmailContent({
            supplierId,
            customerId,
            urls: urlsToProcess  // Pass as urls (plural)
        });

        // const supplierName = supplier ? supplier.companyName : 'Unknown Supplier';
        // const customerName = customer ? customer.companyName : 'Unknown Customer';

        // Get finance emails for CC
        const financeEmails = await emailService.findFinanceEmails();
        const emailAttachments = Array.isArray(emailContent.attachments) ? emailContent.attachments : [];
        let recipientEmail = null;
        let notificationRecipientId = null;
        
        // Get recipient info based on payment mode
        if (paymentMode === 'CreditCard') {
            const am = await getUserById(
                amId,
                req.headers.authorization
            );
            recipientEmail = am.user ? am.user.email : null;
            notificationRecipientId = amId;
            if (!recipientEmail) {
                return res.send("AM project email is missing.\n Please inform the admin to add it.");
            }
        } else if (paymentMode === 'WireTransfer') {
            const am = await getUserById(
                amId,
                req.headers.authorization
            );
            recipientEmail = am.user ? am.user.email : null;
            notificationRecipientId = amId;
            if (!recipientEmail) {
                return res.send("AM email is missing. \n Please inform the admin to add it.");
            }
        }
        // 6. Send email notification
        
        const emailResult = await emailService.sendNewPIEmail({
            piNo,
            supplierName: emailContent.supplierName,
            supplierPoNo,
            supplierSoNo,
            supplierPrice,
            supplierCurrency,
            status,
            paymentMode,
            purpose,
            customerName: emailContent.customerName,
            customerPoNo,
            customerSoNo,
            customerCurrency,
            notes,
            requestedBy: req.user.name,
            toEmail: recipientEmail,
            ccEmails: financeEmails,
            attachments: emailAttachments
        });

        // 7. Create notification (using notification service)
        // notificationService.handleStatusNotification({
        //     pi: newPi,
        //     status,
        //     kamId: userId,
        //     authToken: req.headers.authorization
        // }).catch(error => {
        //     console.error('Background notification creation failed:', error);
        // });

        // 8. Return success response
        res.status(201).json({
            success: true,
            message: 'Proforma Invoice saved successfully',
            pi: newPi
        });

    } catch (error) {
        console.error('Error in addPIKAM:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create proforma invoice',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.updatePIKAM = async (req, res) => {
    
    let { 
        url, 
        amId, 
        supplierId, 
        supplierSoNo, 
        supplierPoNo, 
        supplierCurrency, 
        supplierPrice, 
        purpose, 
        customerId,
        customerSoNo, 
        customerPoNo, 
        customerCurrency, 
        poValue, 
        notes, 
        paymentMode 
    } = req.body;

    // Handle array purpose (if coming from multi-select)
    if (Array.isArray(purpose)) {
        purpose = purpose.join(', ');
    }

    // Validate AM selection
    if (!amId) {
        return res.status(400).json({
            success: false,
            message: "Select a manager and proceed"
        });
    }

    // Determine status based on payment mode
    let status;
    if (paymentMode === 'CreditCard') {
        status = 'INITIATED';
    } else {
        status = 'KAM VERIFIED';
    }

    let recipientEmail = null;
    let notificationRecipientId = null;

    try {
        // Get recipient information using auth service
        const am = await getUserById(amId, req.headers.authorization);
        
        if (!am || !am.user || !am.user.email) {
            return res.status(400).json({
                success: false,
                message: "AM email is missing. Please inform the admin to add it."
            });
        }
        
        recipientEmail = am.user.email;
        notificationRecipientId = amId;

    } catch (error) {
        console.error('Error getting AM info:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    try {
        // Find the existing PI
        const pi = await PerformaInvoice.findByPk(req.params.id);
        if (!pi) {
            return res.status(404).json({
                success: false,
                message: 'Proforma Invoice not found'
            });
        }

        const piNo = pi.piNo;

        // Update PI fields
        const updateData = {
            url: url || pi.url,
            amId: amId || pi.amId,
            supplierId: supplierId || pi.supplierId,
            supplierSoNo: supplierSoNo || pi.supplierSoNo,
            supplierPoNo: supplierPoNo || pi.supplierPoNo,
            supplierCurrency: supplierCurrency || pi.supplierCurrency,
            supplierPrice: supplierPrice || pi.supplierPrice,
            purpose: purpose || pi.purpose,
            customerId: customerId === '' ? null : (customerId || pi.customerId),
            customerSoNo: customerSoNo || pi.customerSoNo,
            customerPoNo: customerPoNo || pi.customerPoNo,
            customerCurrency: customerCurrency || pi.customerCurrency,
            poValue: poValue || pi.poValue,
            paymentMode: paymentMode || pi.paymentMode,
            notes: notes || pi.notes,
            count: pi.count + 1,
            status: status
        };

        // Preserve KAM ID (should be the current user for KAM updates)
        updateData.kamId = req.user.id;

        await pi.update(updateData);

        // Create status record
        await PerformaInvoiceStatus.create({
            performaInvoiceId: pi.id,
            status: status,
            date: new Date(),
            count: pi.count
        });

        // Handle different URL formats for email attachments
        let urlsToProcess = [];
        const urlData = url || pi.url;
        
        if (Array.isArray(urlData)) {
            // If URL is an array of objects with url property
            urlsToProcess = urlData.map(item => item.url || item.file).filter(Boolean);
        } else if (typeof urlData === 'string') {
            // If URL is a simple string
            urlsToProcess = [urlData];
        } else if (urlData && (urlData.url || urlData.file)) {
            // If URL is an object with url or file property
            urlsToProcess = [urlData.url || urlData.file];
        } else if (pi.url) {
            // Fallback to existing PI URL
            if (Array.isArray(pi.url)) {
                urlsToProcess = pi.url.map(item => item.url || item.file).filter(Boolean);
            } else if (typeof pi.url === 'string') {
                urlsToProcess = [pi.url];
            }
        }

        // Prepare email content using email service
        const emailContent = await emailService.prepareNewPIEmailContent({
            supplierId: updateData.supplierId,
            customerId: updateData.customerId,
            urls: urlsToProcess
        });

        // Get finance emails for CC
        const financeEmails = await emailService.findFinanceEmails();
        
        // Ensure attachments is always an array
        const emailAttachments = Array.isArray(emailContent.attachments) ? emailContent.attachments : [];

        // Send email using EmailService
        const emailResult = await emailService.sendUpdatedPIEmail({
            piNo: piNo,
            supplierName: emailContent.supplierName,
            supplierPoNo: updateData.supplierPoNo,
            supplierSoNo: updateData.supplierSoNo,
            supplierPrice: updateData.supplierPrice,
            supplierCurrency: updateData.supplierCurrency,
            status: status,
            paymentMode: updateData.paymentMode,
            purpose: updateData.purpose,
            customerName: emailContent.customerName,
            customerPoNo: updateData.customerPoNo,
            customerSoNo: updateData.customerSoNo,
            customerCurrency: updateData.customerCurrency,
            poValue: updateData.poValue,
            notes: updateData.notes,
            updatedBy: req.user.name,
            toEmail: recipientEmail,
            ccEmails: financeEmails,
            attachments: emailAttachments,
            action: 'updated'
        });

        // Create notification using notification service
        try {
            await axios.post(`${process.env.AUTH_SERVICE_URL}/notification/create`, {
                userId: notificationRecipientId,
                message: `Payment Request Updated ${piNo} / ${updateData.supplierPoNo}`,
                isRead: false,
                type: 'PI_UPDATED_BY_KAM',
                metadata: {
                    piNo: piNo,
                    piId: pi.id,
                    paymentMode: updateData.paymentMode,
                    updatedBy: req.user.name,
                    supplierPoNo: updateData.supplierPoNo,
                    updatedAt: new Date().toISOString(),
                    status: status
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization || ''
                }
            });
        } catch (notificationError) {
            // Log the error but don't fail the main operation
            console.error('Failed to create notification:', notificationError.message);
        }

        // Return success response
        res.json({
            success: true,
            piNo: pi.piNo,
            status: status,
            pi: pi,
            message: 'Proforma Invoice updated successfully by KAM'
        });

    } catch (error) {
        console.error('Error in updatePIKAM:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.addPIAM = async (req, res) => {
    // const emailSignature = await getEmailSignature(req.user.id, req.user.name);

    let { piNo, url, accountantId, supplierId, supplierSoNo, supplierPoNo, supplierCurrency, supplierPrice, purpose,
        customerId, customerPoNo, customerSoNo, customerCurrency, poValue, notes, paymentMode, kamId } = req.body;

    if (Array.isArray(purpose)) {
        purpose = purpose.join(', ');
    }

    const userId = req.user.id;
    kamId = kamId === '' ? null : kamId;
    accountantId = accountantId === '' ? null : accountantId;
    customerId = customerId === '' ? null : customerId;

    let status;
   

    if (paymentMode === 'CreditCard') {
        if (kamId == null) {
            return res.send('Please Select Key Account Manager');
        }
        status = 'AM APPROVED';
    } else {
        if (accountantId == null) {
            return res.send('Please Select Accountant');
        }
        status = 'AM VERIFIED';
    }
    let recipientEmail = null;
    let notificationRecipientId = null;
    
    // Get recipient info based on payment mode
    if (paymentMode === 'CreditCard') {
        const am = await getUserById(
            accountantId,
            req.headers.authorization
        );
        recipientEmail = am.user ? am.user.email : null;
        notificationRecipientId = accountantId;
        if (!recipientEmail) {
            return res.send("AM project email is missing.\n Please inform the admin to add it.");
        }
    } else if (paymentMode === 'WireTransfer') {
        const accountant = await getUserById(
            accountantId,
            req.headers.authorization
        );
        recipientEmail = accountant.user ? accountant.user.email : null;
        notificationRecipientId = accountantId;
        if (!recipientEmail) {
            return res.send("Accountant email is missing. \n Please inform the admin to add it.");
        }
    }

    try {
        const existingInvoice = await PerformaInvoice.findOne({ where: { piNo: piNo } });
        if (existingInvoice) {
            return res.send('Invoice is already saved') 
        }

        const newPi = await PerformaInvoice.create({
            kamId, piNo, url, accountantId, status: status, amId: userId,
            supplierId, supplierSoNo, supplierPoNo, supplierCurrency, supplierPrice, purpose, customerId,
            customerSoNo, customerPoNo, customerCurrency, poValue, notes, paymentMode, addedById: userId
        });

        const piId = newPi.id;
        await PerformaInvoiceStatus.create({
            performaInvoiceId: piId,
            status: status,
            date: new Date(),
        });

        let urlsToProcess = [];
        
        if (Array.isArray(url)) {
            // If URL is an array of objects with url property
            urlsToProcess = url.map(item => item.url).filter(Boolean);
        } else if (typeof url === 'string') {
            // If URL is a simple string
            urlsToProcess = [url];
        } else if (url && url.url) {
            // If URL is an object with url property
            urlsToProcess = [url.url];
        }
        
        const emailContent = await emailService.prepareNewPIEmailContent({
            supplierId,
            customerId,
            urls: urlsToProcess  // Pass as urls (plural)
        });

        // Get finance emails
        const financeEmails = await emailService.findFinanceEmails();
        // Ensure attachments is always an array
        const emailAttachments = Array.isArray(emailContent.attachments) ? emailContent.attachments : [];
        // Send email using EmailService
        const emailResult = await emailService.sendNewPIEmail({
            piNo,
            supplierName: emailContent.supplierName,
            supplierPoNo,
            supplierSoNo,
            supplierPrice,
            supplierCurrency,
            status,
            paymentMode,
            purpose,
            customerName: emailContent.customerName,
            customerPoNo,
            customerSoNo,
            customerCurrency,
            notes,
            requestedBy: req.user.name,
            toEmail: recipientEmail,
            ccEmails: financeEmails,
            attachments: emailAttachments
        });

        try {
            // Assuming notification service runs on port 3001
            // You can make this configurable via environment variables
            const notificationResponse = await axios.post(`${process.env.AUTH_SERVICE_URL}/notification/create`, {
                userId: notificationRecipientId,
                message: `New Payment Request Generated ${piNo} / ${supplierPoNo}`,
                isRead: false,
                type: 'PI_CREATED', // Add type if your notification service supports it
                metadata: {
                    piNo: piNo,
                    piId: newPi.id,
                    paymentMode: paymentMode,
                    requestedBy: req.user.name,
                    supplierPoNo: supplierPoNo
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authentication headers if needed
                    'Authorization': req.headers.authorization || ''
                }
            });
        } catch (notificationError) {
            // Log the error but don't fail the main operation
            console.error('Failed to create notification:', notificationError.message);
            // You might want to implement a retry mechanism or queue for failed notifications
        }
        

        res.json({
            pi: newPi,
            status: status, 
            message: 'Proforma Invoice saved successfully'
        });
    } catch (error) {
        res.send(error.message);
    }
}

exports.updatePIAM = async (req, res) => {
    let { 
        url, 
        kamId, 
        accountantId, 
        supplierId, 
        supplierSoNo,
        supplierPoNo,
        supplierCurrency, 
        supplierPrice, 
        purpose, 
        customerId, 
        customerPoNo,
        customerSoNo,
        customerCurrency, 
        poValue,
        paymentMode, 
        notes
    } = req.body;

    // Handle array purpose (if coming from multi-select)
    if (Array.isArray(purpose)) {
        purpose = purpose.join(', ');
    }

    try {
        // Determine status based on payment mode
        let status;
        let validationError = null;

        if (paymentMode === 'CreditCard') {
            if (!kamId) {
                validationError = 'Please Select Key Account Manager';
            }
            status = 'AM APPROVED';
        } else {
            if (!accountantId) {
                validationError = 'Please Select Accountant';
            }
            status = 'AM VERIFIED';
        }

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        let recipientEmail = null;
        let notificationRecipientId = null;

        // Get recipient info based on payment mode
        try {
            if (paymentMode === 'CreditCard') {
                const kam = await getUserById(kamId, req.headers.authorization);
                recipientEmail = kam?.user?.email || null;
                notificationRecipientId = kamId;

                if (!recipientEmail) {
                    return res.status(400).json({
                        success: false,
                        message: "KAM email is missing. Please inform the admin to add it."
                    });
                }
            } else if (paymentMode === 'WireTransfer') {
                const accountant = await getUserById(accountantId, req.headers.authorization);
                recipientEmail = accountant?.user?.email || null;
                notificationRecipientId = accountantId;

                if (!recipientEmail) {
                    return res.status(400).json({
                        success: false,
                        message: "Accountant email is missing. Please inform the admin to add it."
                    });
                }
            }
        } catch (error) {
            console.error('Error getting recipient info:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        // Find the existing PI
        const pi = await PerformaInvoice.findByPk(req.params.id);
        if (!pi) {
            return res.status(404).json({
                success: false,
                message: 'Proforma Invoice not found'
            });
        }

        const piNo = pi.piNo;

        // Clean up IDs
        kamId = kamId === '' ? null : kamId;
        accountantId = accountantId === '' ? null : accountantId;
        customerId = customerId === '' ? null : customerId;

        // Update PI fields
        const updateData = {
            url: url || pi.url,
            kamId: kamId || pi.kamId,
            accountantId: accountantId || pi.accountantId,
            supplierId: supplierId || pi.supplierId,
            supplierPoNo: supplierPoNo || pi.supplierPoNo,
            supplierSoNo: supplierSoNo || pi.supplierSoNo,
            supplierCurrency: supplierCurrency || pi.supplierCurrency,
            supplierPrice: supplierPrice || pi.supplierPrice,
            purpose: purpose || pi.purpose,
            customerId: customerId || pi.customerId,
            customerPoNo: customerPoNo || pi.customerPoNo,
            customerSoNo: customerSoNo || pi.customerSoNo,
            customerCurrency: customerCurrency || pi.customerCurrency,
            poValue: poValue || pi.poValue,
            paymentMode: paymentMode || pi.paymentMode,
            notes: notes || pi.notes,
            count: pi.count + 1,
            status: status
        };

        // Preserve AM ID (should be the current user for AM updates)
        updateData.amId = req.user.id;

        await pi.update(updateData);

        // Create status record - use the determined status
        await PerformaInvoiceStatus.create({
            performaInvoiceId: pi.id,
            status: status,
            date: new Date(),
            count: pi.count
        });

        // Handle different URL formats for email attachments
        let urlsToProcess = [];
        const urlData = url || pi.url;
        
        if (Array.isArray(urlData)) {
            // If URL is an array of objects with url property
            urlsToProcess = urlData.map(item => item.url || item.file).filter(Boolean);
        } else if (typeof urlData === 'string') {
            // If URL is a simple string
            urlsToProcess = [urlData];
        } else if (urlData && (urlData.url || urlData.file)) {
            // If URL is an object with url or file property
            urlsToProcess = [urlData.url || urlData.file];
        } else if (pi.url) {
            // Fallback to existing PI URL
            if (Array.isArray(pi.url)) {
                urlsToProcess = pi.url.map(item => item.url || item.file).filter(Boolean);
            } else if (typeof pi.url === 'string') {
                urlsToProcess = [pi.url];
            }
        }

        // Prepare email content using email service
        const emailContent = await emailService.prepareNewPIEmailContent({
            supplierId: updateData.supplierId,
            customerId: updateData.customerId,
            urls: urlsToProcess
        });

        // Get finance emails for CC
        const financeEmails = await emailService.findFinanceEmails();
        
        // Ensure attachments is always an array
        const emailAttachments = Array.isArray(emailContent.attachments) ? emailContent.attachments : [];

        // Send email using EmailService
        const emailResult = await emailService.sendUpdatedPIEmail({
            piNo: piNo,
            supplierName: emailContent.supplierName,
            supplierPoNo: updateData.supplierPoNo,
            supplierSoNo: updateData.supplierSoNo,
            supplierPrice: updateData.supplierPrice,
            supplierCurrency: updateData.supplierCurrency,
            status: status,
            paymentMode: updateData.paymentMode,
            purpose: updateData.purpose,
            customerName: emailContent.customerName,
            customerPoNo: updateData.customerPoNo,
            customerSoNo: updateData.customerSoNo,
            customerCurrency: updateData.customerCurrency,
            poValue: updateData.poValue,
            notes: updateData.notes,
            updatedBy: req.user.name,
            toEmail: recipientEmail,
            ccEmails: financeEmails,
            attachments: emailAttachments,
            action: 'updated'
        });

        // Create notification using notification service
        try {
            await axios.post(`${process.env.AUTH_SERVICE_URL}/notification/create`, {
                userId: notificationRecipientId,
                message: `Payment Request Updated ${piNo} / ${updateData.supplierPoNo}`,
                isRead: false,
                type: paymentMode === 'CreditCard' ? 'PI_AM_APPROVED' : 'PI_AM_VERIFIED',
                metadata: {
                    piNo: piNo,
                    piId: pi.id,
                    paymentMode: updateData.paymentMode,
                    updatedBy: req.user.name,
                    supplierPoNo: updateData.supplierPoNo,
                    updatedAt: new Date().toISOString(),
                    status: status
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization || ''
                }
            });
        } catch (notificationError) {
            // Log the error but don't fail the main operation
            console.error('Failed to create notification:', notificationError.message);
        }

        // Return success response
        res.json({
            success: true,
            piNo: pi.piNo,
            status: status,
            pi: pi,
            message: 'Proforma Invoice updated successfully by AM'
        });

    } catch (error) {
        console.error('Error in updatePIAM:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updatePIAdmin = async (req, res) => {
    let { 
        url, 
        kamId,
        accountantId,
        supplierId, 
        supplierSoNo,
        supplierPoNo,
        supplierCurrency, 
        supplierPrice, 
        purpose, 
        customerId, 
        customerPoNo,
        customerSoNo,
        customerCurrency, 
        poValue,
        paymentMode, 
        notes
    } = req.body;

    // Handle array purpose (if coming from multi-select)
    if (Array.isArray(purpose)) {
        purpose = purpose.join(', ');
    }

    try {
        // Find the existing PI
        const pi = await PerformaInvoice.findByPk(req.params.id);
        if (!pi) {
            return res.status(404).json({
                success: false,
                message: 'Proforma Invoice not found'
            });
        }

        const piNo = pi.piNo;

        // Update PI fields - preserve accountant ID if not provided
        const updateData = {
            url: url || pi.url,
            kamId: kamId === '' ? null : (kamId || pi.kamId),
            accountantId: accountantId === '' ? null : (accountantId || pi.accountantId),
            supplierId: supplierId || pi.supplierId,
            supplierPoNo: supplierPoNo || pi.supplierPoNo,
            supplierSoNo: supplierSoNo || pi.supplierSoNo,
            supplierCurrency: supplierCurrency || pi.supplierCurrency,
            supplierPrice: supplierPrice || pi.supplierPrice,
            purpose: purpose || pi.purpose,
            customerId: customerId === '' ? null : (customerId || pi.customerId),
            customerPoNo: customerPoNo || pi.customerPoNo,
            customerSoNo: customerSoNo || pi.customerSoNo,
            customerCurrency: customerCurrency || pi.customerCurrency,
            poValue: poValue || pi.poValue,
            paymentMode: paymentMode || pi.paymentMode,
            notes: notes || pi.notes,
            count: pi.count + 1,
            // Keep the existing status - don't override it
            status: pi.status
        };

        await pi.update(updateData);

        // Create status record with existing status
        await PerformaInvoiceStatus.create({
            performaInvoiceId: pi.id,
            status: pi.status,
            date: new Date(),
            count: pi.count
        });

        // Handle different URL formats for email attachments (if needed in future)
        let urlsToProcess = [];
        const urlData = url || pi.url;
        
        if (Array.isArray(urlData)) {
            // If URL is an array of objects with url property
            urlsToProcess = urlData.map(item => item.url || item.file).filter(Boolean);
        } else if (typeof urlData === 'string') {
            // If URL is a simple string
            urlsToProcess = [urlData];
        } else if (urlData && (urlData.url || urlData.file)) {
            // If URL is an object with url or file property
            urlsToProcess = [urlData.url || urlData.file];
        }

        // Optional: Send email notification if needed
        // This is commented out since the original function doesn't send emails
        /*
        if (recipientEmail) {
            const emailContent = await emailService.prepareNewPIEmailContent({
                supplierId: updateData.supplierId,
                customerId: updateData.customerId,
                urls: urlsToProcess
            });

            const emailResult = await emailService.sendUpdatedPIEmail({
                piNo: piNo,
                supplierName: emailContent.supplierName,
                supplierPoNo: updateData.supplierPoNo,
                supplierSoNo: updateData.supplierSoNo,
                supplierPrice: updateData.supplierPrice,
                supplierCurrency: updateData.supplierCurrency,
                status: pi.status,
                paymentMode: updateData.paymentMode,
                purpose: updateData.purpose,
                customerName: emailContent.customerName,
                customerPoNo: updateData.customerPoNo,
                customerSoNo: updateData.customerSoNo,
                customerCurrency: updateData.customerCurrency,
                poValue: updateData.poValue,
                notes: updateData.notes,
                updatedBy: req.user.name,
                toEmail: recipientEmail,
                attachments: emailAttachments,
                action: 'updated'
            });
        }
        */

        // Optional: Create notification if needed
        /*
        try {
            await axios.post(`${process.env.AUTH_SERVICE_URL}/notification/create`, {
                userId: notificationRecipientId,
                message: `Payment Request Updated ${piNo} / ${updateData.supplierPoNo}`,
                isRead: false,
                type: 'PI_UPDATED_BY_ACCOUNTANT',
                metadata: {
                    piNo: piNo,
                    piId: pi.id,
                    updatedBy: req.user.name,
                    updatedAt: new Date().toISOString()
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization || ''
                }
            });
        } catch (notificationError) {
            console.error('Failed to create notification:', notificationError.message);
        }
        */

        // Return success response
        res.json({
            success: true,
            piNo: pi.piNo,
            status: pi.status,
            pi: pi,
            message: 'Proforma Invoice updated successfully'
        });

    } catch (error) {
        console.error('Error in updatePIAccountant:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPIByAdmin = async (req, res) => {
  try {
    let status = req.query.status;
    let search = req.query.search;
    
    // Default where condition
    let where = {};
    
    if (status && status !== '' && status !== 'undefined' && status !== 'REJECTED') {
      where.status = status;
    } else if (status === 'REJECTED') {
      where.status = { [Op.or]: ['KAM REJECTED', 'AM REJECTED'] };
    }
    
    if (search && search !== '' && search !== 'undefined') {
      const searchTerm = search.replace(/\s+/g, '').trim().toLowerCase();
      where[Op.or] = [
        ...(where[Op.or] || []),
        sequelize.where(
          sequelize.fn('LOWER', sequelize.fn('REPLACE', sequelize.col('piNo'), ' ', '')),
          {
            [Op.like]: `%${searchTerm}%`
          }
        )
      ];
    }

    let limit, offset;
    if (
      req.query.pageSize &&
      req.query.page &&
      req.query.pageSize !== 'undefined' &&
      req.query.page !== 'undefined'
    ) {
      limit = parseInt(req.query.pageSize, 10);
      offset = (parseInt(req.query.page, 10) - 1) * limit;
    }

    // 1️⃣ Fetch invoices
    const invoices = await PerformaInvoice.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']],
      include: [
        { model: PerformaInvoiceStatus },
        { model: Company, as: 'customers', attributes: ['companyName'] }
      ]
    });

    const totalCount = await PerformaInvoice.count({ where: where });

    // 2️⃣ Collect unique userIds from all invoice fields
    const userIds = [
      ...new Set(
        invoices.flatMap(inv => [
          inv.salesPersonId,
          inv.kamId,
          inv.amId,
          inv.accountantId,
          inv.addedById
        ]).filter(Boolean)
      )
    ];

    // 3️⃣ Fetch users using helper function
    const usersMap = await findUsersByIds(
      userIds,
      req.headers.authorization
    );

    // 4️⃣ Enrich invoices with user data
    const enrichedInvoices = invoices.map(inv => {
      const invoice = inv.toJSON();
      return {
        ...invoice,
        salesPerson: usersMap[invoice.salesPersonId] || null,
        kam: usersMap[invoice.kamId] || null,
        am: usersMap[invoice.amId] || null,
        accountant: usersMap[invoice.accountantId] || null,
        addedBy: usersMap[invoice.addedById] || null,
      };
    });

    // 5️⃣ Response
    if (limit !== undefined) {
      res.json({
        count: totalCount,
        items: enrichedInvoices
      });
    } else {
      res.json(enrichedInvoices);
    }

  } catch (error) {
    console.error('Error in getPIByAdmin:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPIByMA = async (req, res) => {
  try {
    let status = req.query.status;
    let search = req.query.search;
    let user = req.user.id;

    // Build where clause
    let where = { accountantId: user };

    if (status && status !== '' && status !== 'undefined' && status !== 'REJECTED' && status !== 'BANK SLIP ISSUED') {
      where.status = status;
    } else if (status === 'BANK SLIP ISSUED') {
      where.status = { [Op.or]: ['BANK SLIP ISSUED', 'CARD PAYMENT SUCCESS'] };
    } else if (status === 'REJECTED') {
      where.status = { [Op.or]: ['KAM REJECTED', 'AM REJECTED'] };
    }
    
    if (search && search !== '' && search !== 'undefined') {
      const searchTerm = search.replace(/\s+/g, '').trim().toLowerCase();
      where[Op.or] = [
        ...(where[Op.or] || []),
        sequelize.where(
          sequelize.fn('LOWER', sequelize.fn('REPLACE', sequelize.col('piNo'), ' ', '')),
          {
            [Op.like]: `%${searchTerm}%`
          }
        )
      ];
    }

    let limit, offset;
    if (
      req.query.pageSize &&
      req.query.page &&
      req.query.pageSize !== 'undefined' &&
      req.query.page !== 'undefined'
    ) {
      limit = parseInt(req.query.pageSize, 10);
      offset = (parseInt(req.query.page, 10) - 1) * limit;
    }

    // 1️⃣ Fetch invoices
    const invoices = await PerformaInvoice.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']],
      include: [
        { model: PerformaInvoiceStatus },
        { model: Company, as: 'customers', attributes: ['companyName'] }
      ]
    });

    const totalCount = await PerformaInvoice.count({ where: where });

    // 2️⃣ Collect unique userIds from all invoice fields
    const userIds = [
      ...new Set(
        invoices.flatMap(inv => [
          inv.salesPersonId,
          inv.kamId,
          inv.amId,
          inv.accountantId,
          inv.addedById
        ]).filter(Boolean)
      )
    ];

    // 3️⃣ Fetch users using helper function
    const usersMap = await findUsersByIds(
      userIds,
      req.headers.authorization
    );

    // 4️⃣ Enrich invoices with user data
    const enrichedInvoices = invoices.map(inv => {
      const invoice = inv.toJSON();
      return {
        ...invoice,
        salesPerson: usersMap[invoice.salesPersonId] || null,
        kam: usersMap[invoice.kamId] || null,
        am: usersMap[invoice.amId] || null,
        accountant: usersMap[invoice.accountantId] || null,
        addedBy: usersMap[invoice.addedById] || null,
      };
    });

    // 5️⃣ Response
    if (limit !== undefined) {
      res.json({
        count: totalCount,
        items: enrichedInvoices
      });
    } else {
      res.json(enrichedInvoices);
    }

  } catch (error) {
    console.error('Error in getAccountantPI:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAMPIs = async (req, res) => {
  try {
    let status = req.query.status;
    let search = req.query.search;
    let amId = req.user.id;
    
    let where = {};

    // Build where clause based on status
    if (status === 'GENERATED') {
      where.status = { [Op.or]: ['GENERATED', 'INITIATED'] };
    } else {
      where.amId = amId;
      
      if (status && status !== '' && status !== 'undefined') {
        if (status === 'BANK SLIP ISSUED') {
          where.status = { [Op.or]: ['BANK SLIP ISSUED', 'CARD PAYMENT SUCCESS'] };
        } else if (status === 'KAM VERIFIED') {
          where.status = { [Op.or]: ['KAM VERIFIED', 'INITIATED'] };
        } else if (status === 'REJECTED') {
          where.status = { [Op.or]: ['KAM REJECTED', 'AM REJECTED'] };
        } else if (
          status !== 'REJECTED' && 
          status !== 'KAM VERIFIED' && 
          status !== 'BANK SLIP ISSUED' && 
          status !== 'GENERATED'
        ) {
          where.status = status;
        }
      }
    }
    
    // Add search functionality
    if (search && search !== '' && search !== 'undefined') {
      const searchTerm = search.replace(/\s+/g, '').trim().toLowerCase();
      where[Op.or] = [
        ...(where[Op.or] || []),
        sequelize.where(
          sequelize.fn('LOWER', sequelize.fn('REPLACE', sequelize.col('piNo'), ' ', '')),
          {
            [Op.like]: `%${searchTerm}%`
          }
        )
      ];
    }

    // Handle pagination
    let limit, offset;
    if (
      req.query.pageSize &&
      req.query.page &&
      req.query.pageSize !== 'undefined' &&
      req.query.page !== 'undefined'
    ) {
      limit = parseInt(req.query.pageSize, 10);
      offset = (parseInt(req.query.page, 10) - 1) * limit;
    }

    // 1️⃣ Fetch invoices with minimal includes
    const invoices = await PerformaInvoice.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']],
      include: [
        { model: PerformaInvoiceStatus },
        { model: Company, as: 'customers', attributes: ['companyName'] }
      ]
    });

    // Get total count
    const totalCount = await PerformaInvoice.count({ where: where });

    // 2️⃣ Extract unique user IDs from invoices
    const userIdsSet = new Set();
    invoices.forEach(inv => {
      if (inv.salesPersonId) userIdsSet.add(inv.salesPersonId);
      if (inv.kamId) userIdsSet.add(inv.kamId);
      if (inv.amId) userIdsSet.add(inv.amId);
      if (inv.accountantId) userIdsSet.add(inv.accountantId);
      if (inv.addedById) userIdsSet.add(inv.addedById);
    });

    const userIdsArray = Array.from(userIdsSet);

    // 3️⃣ Fetch users in a single query
    let usersMap = {};
    if (userIdsArray.length > 0) {
      // Use authClient to fetch users
      const authHeader = req.headers['authorization'];
      
      try {
        const userMapFromAuth = await findUsersByIds(userIdsArray, authHeader);
        
        // Transform to the format you need
        Object.entries(userMapFromAuth).forEach(([id, user]) => {
          usersMap[id] = {
            id: user.id,
            name: user.name,
            email: user.email,
            empNo: user.empNo, // Make sure your auth service returns empNo
            role: {
              id: user.roleId,
              roleName: user.roleName, // You might need separate call for role details
              abbreviation: user.abbreviation
            }
          };
        });
      } catch (error) {
        console.error('Error fetching users from auth service:', error);
        // Continue with empty usersMap
      }
    }

    // 3️⃣ TEMPORARY: Return basic data without user enrichment
    const enrichedInvoices = invoices.map(inv => {
      const invoice = inv.toJSON();
      return {
        ...invoice,
        salesPerson: usersMap[invoice.salesPersonId] || null,
        kam: usersMap[invoice.kamId] || null,
        am: usersMap[invoice.amId] || null,
        accountant: usersMap[invoice.accountantId] || null,
        addedBy: usersMap[invoice.addedById] || null,
      };
    });

    // 5️⃣ Prepare response
    if (limit !== undefined) {
      res.json({
        success: true,
        count: totalCount,
        items: enrichedInvoices
      });
    } else {
      res.json({
        success: true,
        data: enrichedInvoices
      });
    }

  } catch (error) {
    console.error('Error in getAMPIs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AM invoices',
      error: error.message
    });
  }
};

exports.getKAMPIs = async (req, res) => {
  try {
    let status = req.query.status;
    let search = req.query.search;
    let kamId = req.user.id;
    
    // Build where clause
    let where = { kamId: kamId };

    if (status && status !== '' && status !== 'undefined') {
      if (status === 'GENERATED') {
        where.status = { [Op.or]: ['GENERATED', 'AM APPROVED'] };
      } else if (status === 'BANK SLIP ISSUED') {
        where.status = { [Op.or]: ['BANK SLIP ISSUED', 'CARD PAYMENT SUCCESS'] };
      } else if (status === 'REJECTED') {
        where.status = { [Op.or]: ['KAM REJECTED', 'AM REJECTED'] };
      } else if (
        status !== 'REJECTED' && 
        status !== 'GENERATED' && 
        status !== 'BANK SLIP ISSUED'
      ) {
        where.status = status;
      }
    }
    
    // Add search functionality
    if (search && search !== '' && search !== 'undefined') {
      const searchTerm = search.replace(/\s+/g, '').trim().toLowerCase();
      where[Op.or] = [
        ...(where[Op.or] || []),
        sequelize.where(
          sequelize.fn('LOWER', sequelize.fn('REPLACE', sequelize.col('piNo'), ' ', '')),
          {
            [Op.like]: `%${searchTerm}%`
          }
        )
      ];
    }

    // Handle pagination
    let limit, offset;
    if (
      req.query.pageSize &&
      req.query.page &&
      req.query.pageSize !== 'undefined' &&
      req.query.page !== 'undefined'
    ) {
      limit = parseInt(req.query.pageSize, 10);
      offset = (parseInt(req.query.page, 10) - 1) * limit;
    }

    // 1️⃣ Fetch invoices with minimal includes
    const invoices = await PerformaInvoice.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']],
      include: [
        { model: PerformaInvoiceStatus },
        { model: Company, as: 'customers', attributes: ['companyName'] }
      ]
    });

    // Get total count
    const totalCount = await PerformaInvoice.count({ where: where });

    // 2️⃣ Extract unique user IDs from invoices
    const userIdsSet = new Set();
    invoices.forEach(inv => {
      if (inv.salesPersonId) userIdsSet.add(inv.salesPersonId);
      if (inv.kamId) userIdsSet.add(inv.kamId);
      if (inv.amId) userIdsSet.add(inv.amId);
      if (inv.accountantId) userIdsSet.add(inv.accountantId);
      if (inv.addedById) userIdsSet.add(inv.addedById);
    });

    const userIdsArray = Array.from(userIdsSet);

    // 3️⃣ Fetch users in a single query
    let usersMap = {};
    if (userIdsArray.length > 0) {
      // Use authClient to fetch users
      const authHeader = req.headers['authorization'];
      
      try {
        const userMapFromAuth = await findUsersByIds(userIdsArray, authHeader);
        
        // Transform to the format you need
        Object.entries(userMapFromAuth).forEach(([id, user]) => {
          usersMap[id] = {
            id: user.id,
            name: user.name,
            email: user.email,
            empNo: user.empNo, // Make sure your auth service returns empNo
            role: {
              id: user.roleId,
              roleName: user.roleName, // You might need separate call for role details
              abbreviation: user.abbreviation
            }
          };;
        });
      } catch (error) {
        console.error('Error fetching users from auth service:', error);
        // Continue with empty usersMap
      }
    }

    // 3️⃣ TEMPORARY: Return basic data without user enrichment
    const enrichedInvoices = invoices.map(inv => {
      const invoice = inv.toJSON();
      return {
        ...invoice,
        salesPerson: usersMap[invoice.salesPersonId] || null,
        kam: usersMap[invoice.kamId] || null,
        am: usersMap[invoice.amId] || null,
        accountant: usersMap[invoice.accountantId] || null,
        addedBy: usersMap[invoice.addedById] || null,
      };
    });


    // 4️⃣ Prepare response
    if (limit !== undefined) {
      res.json({
        success: true,
        count: totalCount,
        items: enrichedInvoices,
        note: 'User details not available'
      });
    } else {
      res.json({
        success: true,
        data: enrichedInvoices,
        note: 'User details not available'
      });
    }

  } catch (error) {
    console.error('Error in getKAMPIs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KAM invoices',
      error: error.message
    });
  }
};

exports.getSalesTeamPIs = async (req, res) => {
  try {
    const status = req.query.status;
    const search = req.query.search;
    const userId = req.user.id;

    let where = { salesPersonId: userId };

    // Handle status filtering
    if (status && status !== '' && status !== 'undefined') {
      if (status === 'GENERATED') {
        where.status = { [Op.or]: ['GENERATED', 'INITIATED'] };
      } else if (status === 'BANK SLIP ISSUED') {
        where.status = { [Op.or]: ['BANK SLIP ISSUED', 'CARD PAYMENT SUCCESS'] };
      } else if (status === 'REJECTED') {
        where.status = { [Op.or]: ['KAM REJECTED', 'AM REJECTED', 'AM DECLINED'] };
      } else if (
        status !== 'REJECTED' && 
        status !== 'BANK SLIP ISSUED' && 
        status !== 'GENERATED'
      ) {
        where.status = status;
      }
    }
    
    if (search && search !== '' && search !== 'undefined') {
      const searchTerm = search.replace(/\s+/g, '').trim().toLowerCase();
      where[Op.or] = [
        ...(where[Op.or] || []),
        sequelize.where(
          sequelize.fn('LOWER', sequelize.fn('REPLACE', sequelize.col('piNo'), ' ', '')),
          {
            [Op.like]: `%${searchTerm}%`
          }
        )
      ];
    }


    let limit, offset;
    if (
      req.query.pageSize &&
      req.query.page &&
      req.query.pageSize !== 'undefined' &&
      req.query.page !== 'undefined'
    ) {
      limit = parseInt(req.query.pageSize, 10);
      offset = (parseInt(req.query.page, 10) - 1) * limit;
    }

    const allowedUserIds = await getAllowedUserIdsForUser(
      userId,
      req.headers['authorization']
    );

    if (allowedUserIds.length > 0) {
      where.salesPersonId = { [Op.in]: allowedUserIds };
    }

    // 1️⃣ Fetch invoices with minimal includes
    const invoices = await PerformaInvoice.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']],
      include: [
        { model: Company, as: 'suppliers' },
        { model: Company, as: 'customers' },
        { model: PerformaInvoiceStatus }
      ]
    });

    const totalCount = await PerformaInvoice.count({ where: where });

    // 2️⃣ Extract unique user IDs from invoices
    const userIdsSet = new Set();
    invoices.forEach(inv => {
      if (inv.salesPersonId) userIdsSet.add(inv.salesPersonId);
      if (inv.kamId) userIdsSet.add(inv.kamId);
      if (inv.amId) userIdsSet.add(inv.amId);
      if (inv.accountantId) userIdsSet.add(inv.accountantId);
      if (inv.addedById) userIdsSet.add(inv.addedById);
    });

    const userIdsArray = Array.from(userIdsSet);

    // 3️⃣ Fetch users in a single query
    let usersMap = {};
    if (userIdsArray.length > 0) {
      const authHeader = req.headers['authorization'];

      try {
        const userMapFromAuth = await findUsersByIds(userIdsArray, authHeader);

        Object.entries(userMapFromAuth).forEach(([id, user]) => {
          usersMap[id] = {
            id: user.id,
            name: user.name,
            email: user.email,
            empNo: user.empNo,
            role: {
              id: user.roleId,
              roleName: user.roleName,
              abbreviation: user.abbreviation
            }
          };
        });
      } catch (error) {
        console.error('Error fetching users from auth service:', error);
      }
    }

    // 4️⃣ Enrich invoices with user data
    const enrichedInvoices = invoices.map(inv => {
      const invoice = inv.toJSON();
      return {
        ...invoice,
        salesPerson: usersMap[invoice.salesPersonId] || null,
        kam: usersMap[invoice.kamId] || null,
        am: usersMap[invoice.amId] || null,
        accountant: usersMap[invoice.accountantId] || null,
        addedBy: usersMap[invoice.addedById] || null,
      };
    });

    // 5️⃣ Prepare response
    if (limit !== undefined) {
      res.json({
        success: true,
        count: totalCount,
        items: enrichedInvoices
      });
    } else {
      res.json({
        success: true,
        data: enrichedInvoices
      });
    }

  } catch (error) {
    console.error('Error in getSalesTeamPIs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales team invoices',
      error: error.message
    });
  }
};

exports.getSalesTeamPIReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, fromDate, toDate, userIds, export: exportFormat, format } = req.query;

    const allowedUserIds = await getAllowedUserIdsForUser(
      userId,
      req.headers['authorization']
    );

    if (!allowedUserIds || allowedUserIds.length === 0) {
      if (exportFormat === 'excel' || format === 'excel') {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'SalesTeamInvoices');
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="sales-team-invoices.xlsx"');
        return res.send(buffer);
      }

      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    let where = {
      salesPersonId: { [Op.in]: allowedUserIds }
    };

    // Filter by specific users (sales persons) within the team
    if (userIds && userIds !== '' && userIds !== 'undefined') {
      const requestedIds = userIds
        .split(',')
        .map(id => parseInt(id.trim(), 10))
        .filter(id => !Number.isNaN(id));

      const filteredUserIds = requestedIds.filter(id => allowedUserIds.includes(id));

      if (filteredUserIds.length === 0) {
        if (exportFormat === 'excel' || format === 'excel') {
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet([]);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'SalesTeamInvoices');
          const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename="sales-team-invoices.xlsx"');
          return res.send(buffer);
        }

        return res.json({
          success: true,
          count: 0,
          data: []
        });
      }

      where.salesPersonId = { [Op.in]: filteredUserIds };
    }

    // Handle status filtering
    if (status && status !== '' && status !== 'undefined') {
      if (status === 'GENERATED') {
        where.status = { [Op.or]: ['GENERATED', 'INITIATED'] };
      } else if (status === 'BANK SLIP ISSUED') {
        where.status = { [Op.or]: ['BANK SLIP ISSUED', 'CARD PAYMENT SUCCESS'] };
      } else if (status === 'REJECTED') {
        where.status = { [Op.or]: ['KAM REJECTED', 'AM REJECTED', 'AM DECLINED'] };
      } else if (
        status !== 'REJECTED' &&
        status !== 'BANK SLIP ISSUED' &&
        status !== 'GENERATED'
      ) {
        where.status = status;
      }
    }

    // Handle date range filtering (based on createdAt)
    if ((fromDate && fromDate !== 'undefined') || (toDate && toDate !== 'undefined')) {
      const createdAtFilter = {};

      if (fromDate && fromDate !== 'undefined') {
        const from = new Date(fromDate);
        if (!Number.isNaN(from.getTime())) {
          createdAtFilter[Op.gte] = from;
        }
      }

      if (toDate && toDate !== 'undefined') {
        const to = new Date(toDate);
        if (!Number.isNaN(to.getTime())) {
          to.setHours(23, 59, 59, 999);
          createdAtFilter[Op.lte] = to;
        }
      }

      if (Object.keys(createdAtFilter).length > 0) {
        where.createdAt = createdAtFilter;
      }
    }

    // Fetch invoices without pagination for reporting
    const invoices = await PerformaInvoice.findAll({
      where,
      order: [['id', 'DESC']],
      include: [
        { model: Company, as: 'suppliers' },
        { model: Company, as: 'customers' },
        { model: PerformaInvoiceStatus }
      ]
    });

    const totalCount = invoices.length;

    const userIdsSet = new Set();
    invoices.forEach(inv => {
      if (inv.salesPersonId) userIdsSet.add(inv.salesPersonId);
      if (inv.kamId) userIdsSet.add(inv.kamId);
      if (inv.amId) userIdsSet.add(inv.amId);
      if (inv.accountantId) userIdsSet.add(inv.accountantId);
      if (inv.addedById) userIdsSet.add(inv.addedById);
    });

    const userIdsArray = Array.from(userIdsSet);

    let usersMap = {};
    if (userIdsArray.length > 0) {
      const authHeader = req.headers['authorization'];

      try {
        const userMapFromAuth = await findUsersByIds(userIdsArray, authHeader);

        Object.entries(userMapFromAuth).forEach(([id, user]) => {
          usersMap[id] = {
            id: user.id,
            name: user.name,
            email: user.email,
            empNo: user.empNo,
            role: {
              id: user.roleId,
              roleName: user.roleName,
              abbreviation: user.abbreviation
            }
          };
        });
      } catch (error) {
        console.error('Error fetching users from auth service:', error);
      }
    }

    const enrichedInvoices = invoices.map(inv => {
      const invoice = inv.toJSON();
      return {
        ...invoice,
        salesPerson: usersMap[invoice.salesPersonId] || null,
        kam: usersMap[invoice.kamId] || null,
        am: usersMap[invoice.amId] || null,
        accountant: usersMap[invoice.accountantId] || null,
        addedBy: usersMap[invoice.addedById] || null,
      };
    });

    const wantsExcel = exportFormat === 'excel' || format === 'excel';

    if (wantsExcel) {
      const rows = enrichedInvoices.map(inv => ({
        'PI No': inv.piNo,
        'Status': inv.status,
        'Created At': inv.createdAt,
        'Supplier': inv.suppliers && inv.suppliers.companyName ? inv.suppliers.companyName : '',
        'Customer': inv.customers && inv.customers.companyName ? inv.customers.companyName : '',
        'Sales Person': inv.salesPerson && inv.salesPerson.name ? inv.salesPerson.name : '',
        'KAM': inv.kam && inv.kam.name ? inv.kam.name : '',
        'AM': inv.am && inv.am.name ? inv.am.name : '',
        'Accountant': inv.accountant && inv.accountant.name ? inv.accountant.name : '',
        'Payment Mode': inv.paymentMode || '',
        'PO Value': inv.poValue || ''
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'SalesTeamInvoices');

      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

      const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
      const filename = `sales-team-invoices-${timestamp}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(buffer);
    }

    return res.json({
      success: true,
      count: totalCount,
      data: enrichedInvoices
    });
  } catch (error) {
    console.error('Error in getSalesTeamPIReport:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate sales team invoice report',
      error: error.message
    });
  }
};

exports.findPIById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1️⃣ Fetch the PI with basic includes (excluding user-related models)
    const pi = await PerformaInvoice.findByPk(id, {
      include: [
        { model: Company, as: 'suppliers' },
        { model: Company, as: 'customers' },
        { model: PerformaInvoiceStatus }
      ]
    });

    if (!pi) {
      return res.status(404).json({ error: 'Proforma Invoice not found' });
    }

    // 2️⃣ Extract user IDs from the PI
    const userIds = new Set();
    if (pi.salesPersonId) userIds.add(pi.salesPersonId);
    if (pi.kamId) userIds.add(pi.kamId);
    if (pi.amId) userIds.add(pi.amId);
    if (pi.accountantId) userIds.add(pi.accountantId);
    if (pi.addedById) userIds.add(pi.addedById);
    
    const userIdsArray = Array.from(userIds);

    // 3️⃣ Fetch users from auth service
    let usersMap = {};
    if (userIdsArray.length > 0) {
      try {
        const authHeader = req.headers['authorization'];
        usersMap = await findUsersByIds(userIdsArray, authHeader);
        
        console.log(`Fetched ${Object.keys(usersMap).length} users from auth service`);
      } catch (error) {
        console.error('Error fetching users from auth service:', error.message);
        // Continue with empty usersMap - users will show as IDs
      }
    }

    // 4️⃣ Format the response with user details
    const formattedPI = {
      ...pi.toJSON(),
      salesPerson: pi.salesPersonId ? usersMap[pi.salesPersonId] : null,
      kam: pi.kamId ? usersMap[pi.kamId] : null,
      am: pi.amId ? usersMap[pi.amId] : null,
      accountant: pi.accountantId ? usersMap[pi.accountantId] : null,
      addedBy: pi.addedById ? usersMap[pi.addedById] : null
    };

    res.json(formattedPI);
    
  } catch (error) {
    console.error('Error fetching PI:', error);
    res.status(500).json({ error: 'Failed to fetch Proforma Invoice' });
  }
};

exports.addBankSlip = async (req, res) => {
    const { bankSlip } = req.body;
    
    try {
        // 1️⃣ Fetch the PI with basic includes
        const pi = await PerformaInvoice.findByPk(req.params.id, {
            include: [
                { model: Company, as: 'suppliers' },
                { model: Company, as: 'customers' },
                { model: PerformaInvoiceStatus }
            ]
        });

        if (!pi) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        let message = 'processed';
        if (pi.bankSlip != null) {
            message = 'updated';
            pi.count += 1;
            await pi.save();

            // Delete old bank slip from S3
            const key = pi.bankSlip;
            const fileKey = key ? key.replace(`https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/`, '') : null;
            try {
                if (!fileKey) {
                    return res.status(400).json({ error: 'No file key provided' });
                }

                const deleteParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fileKey
                };

                await s3.deleteObject(deleteParams).promise();
                console.log(`Old bank slip deleted: ${fileKey}`);
            } catch (error) {
                console.error('Error deleting old bank slip:', error);
                return res.status(500).json({ error: error.message });
            }
        }

        // 2️⃣ Determine new status
        let newStat;
        if (pi.status === 'AM APPROVED' || pi.status === 'CARD PAYMENT SUCCESS') {
            newStat = 'CARD PAYMENT SUCCESS';
        } else if (pi.status === 'AM VERIFIED' || pi.status === 'BANK SLIP ISSUED') {
            newStat = 'BANK SLIP ISSUED';
        } else {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // 3️⃣ Update PI
        pi.bankSlip = bankSlip;
        pi.status = newStat;
        await pi.save();

        // 4️⃣ Log status change
        await PerformaInvoiceStatus.create({
            performaInvoiceId: pi.id,
            status: newStat,
            date: new Date()
        });

        // 5️⃣ Get user information for emails and notifications
        const userIds = new Set();
        const userIdsArray = [];
        
        // Collect user IDs with their roles
        const userRoles = [];
        if (pi.salesPersonId) {
            userIds.add(pi.salesPersonId);
            userIdsArray.push(pi.salesPersonId);
            userRoles.push({ id: pi.salesPersonId, role: 'SalesPerson' });
        }
        if (pi.kamId) {
            userIds.add(pi.kamId);
            userIdsArray.push(pi.kamId);
            userRoles.push({ id: pi.kamId, role: 'KAM' });
        }
        if (pi.amId) {
            userIds.add(pi.amId);
            userIdsArray.push(pi.amId);
            userRoles.push({ id: pi.amId, role: 'AM' });
        }
        if (pi.accountantId) {
            userIds.add(pi.accountantId);
            userIdsArray.push(pi.accountantId);
            userRoles.push({ id: pi.accountantId, role: 'Accountant' });
        }
        
        const authHeader = req.headers['authorization'];
        const usersMap = await findUsersByIds(userIdsArray, authHeader);
        console.log(usersMap);
        
        // 6️⃣ Check for missing user emails
        const missingEmails = userRoles
            .filter(user => {
                const userInfo = usersMap[user.id];
                return !userInfo || !userInfo.email;
            })
            .map(user => {
                const userInfo = usersMap[user.id];
                return `${user.role} (ID: ${user.id}) is missing an email.`;
            });

        if (missingEmails.length > 0) {
            return res.status(400).json({ 
                error: 'Missing user emails',
                details: missingEmails 
            });
        }

        // 7️⃣ Collect recipient emails (all except accountant)
        const recipientEmails = userRoles
            .filter(user => user.id !== pi.accountantId)
            .map(user => {
                const userInfo = usersMap[user.id];
                return userInfo?.email;
            })
            .filter(Boolean);
          console.log(recipientEmails,"recipientEmails");
          
        // Get finance emails for CC
        const financeEmails = await emailService.findFinanceEmails();
            console.log(financeEmails, "financeEmails");
            
        // 8️⃣ Prepare email content using EmailService
        if (recipientEmails.length > 0) {
            try {
                // Prepare attachments
                let attachments = [];
                
                // Add PI files
                if (pi.url && Array.isArray(pi.url)) {
                    try {
                        const urls = pi.url
                            .filter(item => item?.url && typeof item.url === 'string')
                            .map(item => item.url);
                        
                        if (urls.length > 0) {
                            attachments = await emailService.getAttachmentsFromS3(urls);
                        }
                    } catch (s3Error) {
                        console.warn('Failed to fetch PI attachments:', s3Error.message);
                    }
                }

                // Add bank slip
                if (bankSlip && typeof bankSlip === 'string') {
                    try {
                        const bankSlipAttachments = await emailService.getAttachmentsFromS3([bankSlip]);
                        attachments.push(...bankSlipAttachments);
                    } catch (s3Error) {
                        console.warn('Failed to fetch bank slip attachment:', s3Error.message);
                    }
                }

                // Prepare email data
                const emailData = {
                    piNo: pi.piNo,
                    supplierName: pi.suppliers?.companyName || 'Unknown Supplier',
                    supplierPoNo: pi.supplierPoNo,
                    supplierSoNo: pi.supplierSoNo,
                    supplierPrice: pi.supplierPrice,
                    supplierCurrency: pi.supplierCurrency,
                    status: newStat,
                    paymentMode: pi.paymentMode,
                    purpose: pi.purpose,
                    customerName: pi.customers?.companyName || 'Unknown Customer',
                    customerPoNo: pi.customerPoNo,
                    customerSoNo: pi.customerSoNo,
                    customerCurrency: pi.customerCurrency,
                    poValue: pi.poValue,
                    notes: pi.notes,
                    requestedBy: req.user?.name || 'System'
                };

                // Customize subject based on status
                let emailSubject;
                if (newStat === 'CARD PAYMENT SUCCESS') {
                    emailSubject = `Card Payment Successfully ${message.charAt(0).toUpperCase() + message.slice(1)} for Proforma Invoice - ${pi.piNo}`;
                } else {
                    emailSubject = `Payslip Issued for Proforma Invoice - ${pi.piNo}`;
                }

                // Send email using EmailService's sendNewPIEmail method
                await emailService.sendBankSlipEmail({
                    piNo: pi.piNo,
                    supplierName: emailData.supplierName,
                    supplierPoNo: emailData.supplierPoNo,
                    supplierSoNo: emailData.supplierSoNo,
                    supplierPrice: emailData.supplierPrice,
                    supplierCurrency: emailData.supplierCurrency,
                    status: emailData.status,
                    paymentMode: emailData.paymentMode,
                    purpose: emailData.purpose,
                    customerName: emailData.customerName,
                    customerPoNo: emailData.customerPoNo,
                    customerSoNo: emailData.customerSoNo,
                    customerCurrency: emailData.customerCurrency,
                    notes: emailData.notes,
                    requestedBy: emailData.requestedBy,
                    toEmail: recipientEmails.join(','),
                    ccEmails: financeEmails,
                    attachments: attachments,
                    // Override subject for bank slip emails
                    subject: emailSubject
                });

                console.log(`Bank slip ${message} email sent successfully to ${recipientEmails.length} recipients`);

            } catch (emailError) {
                console.error('Failed to send bank slip email:', emailError);
                // Don't fail the whole operation if email fails
            }
        } else {
            console.warn('No recipients defined for bank slip email');
        }

        // 9️⃣ Create notifications using NotificationService
        const notificationMessage = `${newStat} for Proforma Invoice ID: ${pi.piNo}.`;
        
        await notificationService.createNotification({
            userIds: userIdsArray,
            message: notificationMessage,
            piId: pi.id,
            status: newStat,
            createdBy: req.user?.id || 'system'
        });

        console.log(`Notifications created for ${userIds.size} users`);

        // 🔟 Format response with user details
        const formattedPI = {
            ...pi.toJSON(),
            salesPerson: pi.salesPersonId ? {
                id: pi.salesPersonId,
                name: usersMap[pi.salesPersonId]?.name,
                email: usersMap[pi.salesPersonId]?.email
            } : null,
            kam: pi.kamId ? {
                id: pi.kamId,
                name: usersMap[pi.kamId]?.name,
                email: usersMap[pi.kamId]?.email
            } : null,
            am: pi.amId ? {
                id: pi.amId,
                name: usersMap[pi.amId]?.name,
                email: usersMap[pi.amId]?.email
            } : null,
            accountant: pi.accountantId ? {
                id: pi.accountantId,
                name: usersMap[pi.accountantId]?.name,
                email: usersMap[pi.accountantId]?.email
            } : null
        };

        return res.json({ 
            success: true, 
            pi: formattedPI, 
            status: newStat,
            message: `Bank slip ${message} successfully`,
            emailSentTo: recipientEmails
        });

    } catch (error) {
        console.error('Error in addBankSlip:', error);
        return res.status(500).json({ error: error.message });
    }
};
 
exports.deleteInvoice = async(req,res)=>{
  console.log("delete invoice", req.params.id);
  
  try {
    // Find the invoice first
    const invoice = await PerformaInvoice.findOne({
      where: { id: req.params.id }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'PerformaInvoice with that ID not found'
      });
    }

    // Debug: Log what's actually in the fields
    console.log("Invoice data:", {
      id: invoice.id,
      url: invoice.url,
      urlType: typeof invoice.url,
      urlIsArray: Array.isArray(invoice.url),
      bankSlip: invoice.bankSlip,
      bankSlipType: typeof invoice.bankSlip
    });

    // Helper function to safely extract URLs
    const extractUrlFromValue = (value) => {
      if (!value) return null;
      
      // If it's a string URL
      if (typeof value === 'string') {
        return value.trim() !== '' ? value : null;
      }
      
      // If it's an object with a url property
      if (typeof value === 'object' && value !== null && value.url) {
        if (typeof value.url === 'string' && value.url.trim() !== '') {
          return value.url;
        }
      }
      
      // If it's an object with other URL properties
      if (typeof value === 'object' && value !== null) {
        // Check for common URL property names
        const urlProps = ['url', 'fileUrl', 'fileURL', 'path', 'location', 'key'];
        for (const prop of urlProps) {
          if (value[prop] && typeof value[prop] === 'string' && value[prop].trim() !== '') {
            return value[prop];
          }
        }
      }
      
      return null;
    };

    // Collect all files to delete
    const filesToDelete = [];
    
    // Handle 'url' field - could be array, object, or string
    if (invoice.url) {
      // If it's an array
      if (Array.isArray(invoice.url)) {
        invoice.url.forEach(item => {
          const url = extractUrlFromValue(item);
          if (url) {
            filesToDelete.push(url);
          }
        });
      } else {
        // If it's a single value (string, object, etc.)
        const url = extractUrlFromValue(invoice.url);
        if (url) {
          filesToDelete.push(url);
        }
      }
    }
    
    // Handle 'bankSlip' field
    if (invoice.bankSlip) {
      const url = extractUrlFromValue(invoice.bankSlip);
      if (url) {
        filesToDelete.push(url);
      }
    }
    
    // Log what we're trying to delete
    console.log(`Found ${filesToDelete.length} files to delete:`, filesToDelete);
    
    // Delete all files from file service - USE QUERY PARAMETER
    const deletePromises = filesToDelete.map(async (fileUrl) => {
      try {
        // Call the file service delete endpoint with query parameter
        const response = await axios.delete(`${process.env.FILE_SERVICE_URL}/filedeletebyurl`, {
          params: { key: fileUrl }, // Send as query parameter, not in body
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        });
        console.log(`Successfully deleted file: ${fileUrl}`);
        return { 
          success: true, 
          fileUrl, 
          response: response.data 
        };
      } catch (error) {
        console.warn(`Failed to delete file ${fileUrl}:`, error.message);
        return { 
          success: false, 
          fileUrl, 
          error: error.message,
          status: error.response?.status
        };
      }
    });
    
    // Wait for all file deletion attempts
    const fileDeletionResults = await Promise.allSettled(deletePromises);
    
    // Delete all related status records
    await PerformaInvoiceStatus.destroy({
      where: { performaInvoiceId: req.params.id }
    });
    
    // Then delete the invoice from database
    const result = await PerformaInvoice.destroy({
      where: { id: req.params.id },
      force: true,
    });

    // Process results
    const fulfilledResults = fileDeletionResults
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);
    
    const successfulDeletions = fulfilledResults.filter(r => r.success).length;
    const failedDeletions = fulfilledResults.filter(r => !r.success).length;
    
    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
      invoiceId: req.params.id,
      files: {
        total: filesToDelete.length,
        deleted: successfulDeletions,
        failed: failedDeletions
      },
      details: filesToDelete.length > 0 ? {
        filesAttempted: filesToDelete,
        results: fulfilledResults
      } : undefined
    });
    
  } catch (error) {
    console.error("Delete error:", error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to delete invoice',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

exports.getAdminReports = async (req, res) => {
    try {
        const { invoiceNo, addedBy, status, startDate, endDate, teamId } = req.body;
        const authHeader = req.headers.authorization; // Get auth header for user service

        let teamUserIds = [];
        if (teamId) {
            const teamUsers = await getTeamUsers(teamId, req.headers['authorization']);
            teamUserIds = teamUsers.map(user => user.id);
            
            if (teamUserIds.length === 0) {
                return res.json([]);
            }
        }
        console.log(teamUserIds, "teamUserIdsaaaaa11111111111");
        // Build where clause including team filter if applicable
        const whereClause = buildWhereClause(req.body, teamUserIds);
        
        // Fetch invoices
        const invoices = await PerformaInvoice.findAll({
            where: whereClause,
            include: [
                { model: Company, as: 'suppliers' }, 
                { model: Company, as: 'customers' }, 
                // Remove User model includes since we'll fetch from external service
                // { model: User, as: 'addedBy', attributes: ['name', 'email'] },
                // { model: User, as: 'salesPerson', attributes: ['name', 'email'] },
                // { model: User, as: 'kam', attributes: ['name', 'email'] },
                // { model: User, as: 'am', attributes: ['name', 'email'] },
                // { model: User, as: 'accountant', attributes: ['name', 'email'] }
            ],
            order: [['createdAt', 'DESC']],
            raw: true, // Get raw data for easier manipulation
            nest: true // Nest the results properly
        });

        // Extract all unique user IDs from invoices
        const userIds = new Set();
        invoices.forEach(invoice => {
            if (invoice.addedById) userIds.add(invoice.addedById);
            if (invoice.salesPersonId) userIds.add(invoice.salesPersonId);
            if (invoice.kamId) userIds.add(invoice.kamId);
            if (invoice.amId) userIds.add(invoice.amId);
            if (invoice.accountantId) userIds.add(invoice.accountantId);
        });

        // Fetch user details from external service
        const usersMap = await findUsersByIds(Array.from(userIds), authHeader);

        // Attach user details to each invoice
        const enrichedInvoices = invoices.map(invoice => {
            const enriched = { ...invoice };
            
            // Attach addedBy user
            if (invoice.addedById && usersMap[invoice.addedById]) {
                enriched.addedBy = usersMap[invoice.addedById];
            } else if (invoice.addedById) {
                enriched.addedBy = {
                    id: invoice.addedById,
                    name: 'Unknown User',
                    email: null,
                    isActive: false
                };
            }

            // Attach salesPerson user
            if (invoice.salesPersonId && usersMap[invoice.salesPersonId]) {
                enriched.salesPerson = usersMap[invoice.salesPersonId];
            } else if (invoice.salesPersonId) {
                enriched.salesPerson = {
                    id: invoice.salesPersonId,
                    name: 'Unknown User',
                    email: null,
                    isActive: false
                };
            }

            // Attach kam user
            if (invoice.kamId && usersMap[invoice.kamId]) {
                enriched.kam = usersMap[invoice.kamId];
            } else if (invoice.kamId) {
                enriched.kam = {
                    id: invoice.kamId,
                    name: 'Unknown User',
                    email: null,
                    isActive: false
                };
            }

            // Attach am user
            if (invoice.amId && usersMap[invoice.amId]) {
                enriched.am = usersMap[invoice.amId];
            } else if (invoice.amId) {
                enriched.am = {
                    id: invoice.amId,
                    name: 'Unknown User',
                    email: null,
                    isActive: false
                };
            }

            // Attach accountant user
            if (invoice.accountantId && usersMap[invoice.accountantId]) {
                enriched.accountant = usersMap[invoice.accountantId];
            } else if (invoice.accountantId) {
                enriched.accountant = {
                    id: invoice.accountantId,
                    name: 'Unknown User',
                    email: null,
                    isActive: false
                };
            }

            return enriched;
        });

        res.json(enrichedInvoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message 
        });
    }
};

// Helper function to build where clause
function buildWhereClause(filters, teamUserIds = []) {
  const {
    invoiceNo,
    addedBy,
    status,
    startDate,
    endDate
  } = filters;

  const where = {};

  // 🔢 Invoice No (case-insensitive, trimmed)
  if (invoiceNo) {
    where.piNo = {
      [Op.iLike]: `%${invoiceNo.replace(/\s+/g, '')}%`
    };
  }

  // 👤 Team-based restriction
  if (teamUserIds.length > 0) {
    where.addedById = { [Op.in]: teamUserIds };
  }

  // 👤 Specific addedBy filter (within team)
  if (addedBy) {
    if (teamUserIds.length > 0 && !teamUserIds.includes(Number(addedBy))) {
      // Force empty result safely
      where.addedById = -1;
    } else {
      where.addedById = addedBy;
    }
  }

  // 📌 Status mapping
  if (status) {
    if (status === 'GENERATED') {
      where.status = { [Op.in]: ['GENERATED', 'INITIATED'] };
    } else if (status === 'AM VERIFIED') {
      where.status = { [Op.in]: ['AM VERIFIED', 'AM APPROVED'] };
    } else if (status === 'BANK SLIP ISSUED') {
      where.status = {
        [Op.in]: ['BANK SLIP ISSUED', 'CARD PAYMENT SUCCESS']
      };
    } else {
      where.status = status;
    }
  }

  // 📅 Date range (safe handling)
  if (startDate || endDate) {
    where.createdAt = {};

    if (startDate) {
      where.createdAt[Op.gte] = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt[Op.lte] = end;
    }
  }

  return where;
}

function getStatusFilter(status) {
    const statusGroups = {
        'GENERATED': ['GENERATED', 'INITIATED'],
        'AM VERIFIED': ['AM VERIFIED', 'AM APPROVED'],
        'BANK SLIP ISSUED': ['BANK SLIP ISSUED', 'CARD PAYMENT SUCCESS']
    };

    return statusGroups[status] 
        ? { [Op.in]: statusGroups[status] }
        : status;
}
// const findPIByIdWithExternalUsers = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const authHeader = req.headers['authorization'];
    
//     // 1️⃣ Fetch the PI with all includes (except user models from other DB)
//     const pi = await PerformaInvoice.findByPk(id, {
//       include: [
//         { model: Company, as: 'suppliers' },
//         { model: Company, as: 'customers' },
//         { model: PerformaInvoiceStatus }
//         // Note: Removed User includes since they're in another DB
//       ]
//     });

//     if (!pi) {
//       return res.status(404).json({ error: 'Proforma Invoice not found' });
//     }

//     // 2️⃣ Prepare response object
//     const response = pi.toJSON();
    
//     // 3️⃣ Add user details from external service
//     const userFields = [
//       { field: 'salesPersonId', key: 'salesPerson' },
//       { field: 'kamId', key: 'kam' },
//       { field: 'amId', key: 'am' },
//       { field: 'accountantId', key: 'accountant' },
//       { field: 'addedById', key: 'addedBy' }
//     ];

//     // Fetch all users in one go
//     const userIds = userFields
//       .map(field => response[field.field])
//       .filter(id => id !== null && id !== undefined);
    
//     const uniqueUserIds = [...new Set(userIds)];
    
//     if (uniqueUserIds.length > 0) {
//       try {
//         const usersMap = await findUsersByIds(uniqueUserIds, authHeader);
        
//         // Assign user details to response
//         userFields.forEach(({ field, key }) => {
//           const userId = response[field];
//           if (userId && usersMap[userId]) {
//             response[key] = {
//               id: usersMap[userId].id,
//               name: usersMap[userId].name,
//               email: usersMap[userId].email,
//               empNo: usersMap[userId].empNo,
//               // Add role if available from auth service
//               role: usersMap[userId].role || null
//             };
//           }
//         });
//       } catch (userError) {
//         console.error('Error fetching users:', userError.message);
//         // Leave user fields as IDs
//       }
//     }

//     res.json(response);
    
//   } catch (error) {
//     console.error('Error fetching PI:', error);
//     res.status(500).json({ error: 'Failed to fetch Proforma Invoice' });
//   }
// };

exports.updateKAM = async (req, res) => {
    try {
        const { kamId } = req.body;
        // const emailSignature = await getEmailSignature(req.user.id, req.user.name);

        if (!kamId) {
            return res.send('Please select Key Account Manager and proceed');
        }

        // Legacy UserPosition lookup removed in favour of auth-service user API

        // if (!kam?.projectMailId) {
        //     return res.send("KAM project email is missing. Please inform the admin to add it.");
        // }

            const kam = await getUserById(
                kamId,
                req.headers.authorization
            );

            recipientEmail = kam.user ? kam.user.email : null;
            notificationRecipientId = kamId;

        const pi = await PerformaInvoice.findByPk(req.params.id, {
            include: [
                { model: Company, as: 'customers', attributes: ['companyName'] },
                { model: Company, as: 'suppliers', attributes: ['companyName'] },
            ]
        });

        if (!pi) return res.send('Proforma Invoice not found.');

        pi.kamId = kamId;

        // const attachments = await getEmailAttachmentsFromS3(pi.url);

        // await sendEmail({
        //     to: recipientEmail,
        //     subject: `Proforma Invoice Updated - ${pi.piNo}`,
        //     attachments,
        //     html: `
        //         <p>Proforma Invoice updated by <strong>${req.user.name}</strong></p>
        //         <p>${pi.kam.name} is unavailable, so KAM changed to <strong>${kam.user.name}</strong></p>
        //         <p><strong>Entry Number:</strong> ${pi.piNo}</p>
        //         <p><strong>Supplier:</strong> ${pi.suppliers.companyName}</p>
        //         <p><strong>Status:</strong> ${pi.status}</p>
        //         <p><strong>Payment Mode:</strong> ${pi.paymentMode}</p>
        //         <p><strong>Notes:</strong> ${pi.notes}</p>
        //         ${emailSignature}
        //     `
        // });

        // await Notification.create({
        //     userId: kamId,
        //     message: `Payment Request Updated ${pi.piNo} / ${pi.supplierPoNo}`,
        //     isRead: false,
        // });

        await pi.save();

        await emailService.sendUpdatedPIEmail({
          piNo: pi.piNo,
          supplierName: pi.supplierName,
          supplierPoNo: pi.supplierPoNo,
          supplierSoNo: pi.supplierSoNo,
          supplierPrice: pi.supplierPrice,
          supplierCurrency: pi.supplierCurrency,
          status: pi.status,
          paymentMode: pi.paymentMode,
          purpose: pi.purpose,
          customerName: pi.customerName,
          customerPoNo: pi.customerPoNo,
          customerSoNo: pi.customerSoNo,
          customerCurrency: pi.customerCurrency,
          poValue: pi.poValue,
          notes: pi.notes,
          updatedBy: req.user.name,
          toEmail: recipientEmail,
          attachments: await emailService.getAttachmentsFromS3(pi.url),
          action: 'KAM Changed'
        });

        res.json({
            piNo: pi.piNo,
            message: 'Proforma Invoice updated successfully',
        });

    } catch (error) {
        res.send(error.message);
    }
};

exports.downloadExcel = async (req, res) => {
  const data = req.body.invoices;
  const { startDate, endDate, status, addedBy, invoiceNo } = req.body;
  
  console.log(`Exporting ${data?.length || 0} invoices...`);
  
  // Validate required data
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ 
      error: 'Invalid data format. Expected an array of invoices.' 
    });
  }

  if (data.length === 0) {
    return res.status(400).json({ 
      error: 'No data available to export. Please select invoices to export.' 
    });
  }

  try {
    const workbook = new ExcelJS.Workbook();
    
    // Add metadata
    workbook.creator = 'AeroAssist FinTech System';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    const worksheet = workbook.addWorksheet('Proforma Report');

    // ========== ADD TITLE AND HEADER ROWS ==========
    
    // Title row
    const titleRow = worksheet.addRow(['PROFORMA INVOICES REPORT']);
    titleRow.font = { 
      bold: true, 
      size: 16, 
      color: { argb: '1F4E78' } 
    };
    titleRow.alignment = { 
      horizontal: 'center',
      vertical: 'middle'
    };
    worksheet.mergeCells('A1:V1');
    
    // Subtitle with date range
    let subtitleText = 'All Proforma Invoices';
    if (startDate && endDate) {
      subtitleText = `Date Range: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`;
    }
    
    const subtitleRow = worksheet.addRow([subtitleText]);
    subtitleRow.font = { 
      italic: true, 
      size: 11,
      color: { argb: '666666' }
    };
    subtitleRow.alignment = { 
      horizontal: 'center',
      vertical: 'middle'
    };
    worksheet.mergeCells('A2:V2');
    
    // Generated info row
    const generatedRow = worksheet.addRow([`Generated on: ${new Date().toLocaleString()} by AeroAssist System`]);
    generatedRow.font = { 
      size: 10,
      color: { argb: '999999' }
    };
    generatedRow.alignment = { 
      horizontal: 'center',
      vertical: 'middle'
    };
    worksheet.mergeCells('A3:V3');
    
    // Empty row for spacing
    worksheet.addRow([]);
    
    // ========== DEFINE COLUMNS ==========
    const columns = [
      { header: 'PI NO', key: 'piNo', width: 12 },
      { header: 'PO NO', key: 'supplierPoNo', width: 12 },
      { header: 'Supplier', key: 'supplier', width: 25 },
      { header: 'Invoice NO', key: 'supplierSoNo', width: 15 },
      { header: 'Amount', key: 'supplierPrice', width: 18 },
      { header: 'Purpose', key: 'purpose', width: 20 },
      { header: 'Customer', key: 'customer', width: 25 },
      { header: 'Customer SoNo', key: 'customerSoNo', width: 15 },
      { header: 'Customer PoNo', key: 'customerPoNo', width: 15 },
      { header: 'Customer Price', key: 'customerPrice', width: 18 },
      { header: 'Payment Mode', key: 'paymentMode', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Added By', key: 'addedBy', width: 20 },
      { header: 'Sales Person', key: 'salesPerson', width: 20 },
      { header: 'KAM', key: 'kamName', width: 20 },
      { header: 'AM', key: 'amName', width: 20 },
      { header: 'Accountant', key: 'accountant', width: 20 },
      { header: 'Created Date', key: 'createdDate', width: 20 },
      { header: 'Updated Date', key: 'updatedDate', width: 20 },
      { header: 'Attachments', key: 'url', width: 40 },
      { header: 'Wire Slip', key: 'bankSlip', width: 30 },
      { header: 'Notes', key: 'notes', width: 40 }
    ];
    
    // Add column headers at row 5
    const headerRow = worksheet.addRow(columns.map(col => col.header));
    
    // Style header row
    headerRow.eachCell((cell, colNumber) => {
      cell.font = { 
        bold: true, 
        color: { argb: 'FFFFFF' },
        size: 11
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2E7D32' } // Green color matching your theme
      };
      cell.alignment = { 
        vertical: 'middle', 
        horizontal: 'center',
        wrapText: true
      };
      cell.border = {
        top: { style: 'thin', color: { argb: '1B5E20' } },
        left: { style: 'thin', color: { argb: '1B5E20' } },
        bottom: { style: 'thin', color: { argb: '1B5E20' } },
        right: { style: 'thin', color: { argb: '1B5E20' } }
      };
    });
    
    // ========== ADD DATA ROWS ==========
    let rowIndex = 0;
    data.forEach((item) => {
      const rowData = [
        item.piNo || 'N/A',
        item.supplierPoNo || 'N/A',
        item.suppliers?.companyName || 'N/A',
        item.supplierSoNo || 'N/A',
        `${item.poValue || 0} ${item.supplierCurrency || ''}`,
        item.purpose || 'N/A',
        item.customers?.companyName || 'N/A',
        item.customerSoNo || 'N/A',
        item.customerPoNo || 'N/A',
        `${item.customerPrice || 0} ${item.customerCurrency || ''}`,
        item.paymentMode || 'N/A',
        item.status || 'N/A',
        item.addedBy?.name || 'N/A',
        item.salesPerson?.name || 'N/A',
        item.kam?.name || 'N/A',
        item.am?.name || 'N/A',
        item.accountant?.name || 'N/A',
        item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
        item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A',
        item.url?.length > 0 ? `${item.url.length} attachment(s)` : 'No attachments',
        item.bankSlip || 'No slip',
        item.notes || 'No notes'
      ];
      
      const row = worksheet.addRow(rowData);
      rowIndex++;
      
      // Add borders to all cells
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'DDDDDD' } },
          left: { style: 'thin', color: { argb: 'DDDDDD' } },
          bottom: { style: 'thin', color: { argb: 'DDDDDD' } },
          right: { style: 'thin', color: { argb: 'DDDDDD' } }
        };
        cell.alignment = {
          vertical: 'middle',
          wrapText: true
        };
      });
      
      // Alternate row colors for better readability
      if (rowIndex % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F8F9FA' }
        };
      }
      
      // Color code status column (column L)
      const statusCell = row.getCell(12); // Column L (12th column)
      switch((item.status || '').toLowerCase()) {
        case 'approved':
        case 'completed':
          statusCell.font = { color: { argb: '2E7D32' }, bold: true }; // Green
          break;
        case 'pending':
        case 'in progress':
          statusCell.font = { color: { argb: 'FF9800' }, bold: true }; // Orange
          break;
        case 'rejected':
        case 'cancelled':
          statusCell.font = { color: { argb: 'F44336' }, bold: true }; // Red
          break;
      }
    });
    
    // ========== AUTO-FIT COLUMNS ==========
    worksheet.columns.forEach((column, index) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      
      // Set column width with minimum and maximum limits
      const calculatedWidth = Math.min(maxLength + 2, 50);
      column.width = Math.max(calculatedWidth, columns[index]?.width || 10);
    });
    
    // ========== ADD SUMMARY SECTION ==========
    worksheet.addRow([]); // Empty row
    
    const totalRow = worksheet.addRow([`Total Records Exported: ${data.length}`]);
    totalRow.font = { bold: true, size: 12 };
    totalRow.alignment = { horizontal: 'right' };
    worksheet.mergeCells(`A${totalRow.number}:V${totalRow.number}`);
    
    // ========== FREEZE PANES (Header row) ==========
    worksheet.views = [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: 5, // Freeze rows 1-5 (title + header)
        activeCell: 'A6',
        showGridLines: true
      }
    ];
    
    // ========== GENERATE AND SEND FILE ==========
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `Proforma_Report_${timestamp}.xlsx`;

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Optional: Set cache control headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Write workbook to buffer and send as response
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Send the file
    res.send(buffer);
    
    console.log(`Excel report generated successfully: ${filename} (${data.length} records)`);

  } catch (error) {
    console.error('Error generating Excel report:', error);
    
    // Send JSON error (not binary)
    res.status(500).json({ 
      error: 'Failed to generate Excel report',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
