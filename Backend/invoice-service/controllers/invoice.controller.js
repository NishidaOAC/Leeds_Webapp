const { PerformaInvoice, PerformaInvoiceStatus, Company } = require('../models');
const { publishEvent } = require('../utils/eventPublisher');
const axios = require('axios');
const { Op } = require('sequelize');
const { findUsersByIds } = require('../utils/userFinder');
const { getUserById } = require('../utils/userFinder');
const nodemailer = require('nodemailer');
const emailService = require('../services/emailService');
const notificationService = require('../services/notificationService');
const User = require('../../auth-service/models/user');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
});

const getEmailSignature = async (userId, userName) => {
    const roleId = await UserPosition.findOne({ where: { userId } });
    const role = await Designation.findByPk(roleId?.designationId);
    const designation = role ? role.designationName : 'Employee';

    return `
    <br><br>
    Regards,
    <table style="width:28%; font-family: Arial, sans-serif; font-size: 14px;">
      <tr>
          <td style="padding-right: 5px; padding-top: 25px; vertical-align: top;">
              <img src="https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/images/leeds_logo.png" alt="LEEDS Aerospace Logo" style="width: 180px;">
              <p style="font-size: 8px; font-weight: bold; margin-top: 10px;padding-left: 0; font-style: italic; padding-right: 0;">
                  ASA-100 & ISO 9001:2015 accredited<br>
                  Compliant with FAA Advisory Circular 00-56B
              </p>
          </td>
          <td style="border-left: 2px solid #e00d0d; padding-left: 10px; vertical-align: top;">
              <strong style="font-size: 16px; color: #e00d0d;"> ${userName}</strong><br>
              <a style="font-size: 12px;"> ${designation}</a>
              <hr style="border: 1px solid black; margin: 5px 0;">
             
              <table style="font-size: 14px;">
                  <tr>
                      <td style="vertical-align: top;">
                          <img src="https://img.icons8.com/material-outlined/24/000000/phone.png" style="vertical-align: middle; width: 15px;" alt="Phone Logo">
                      </td>
                      <td style="padding-left: 5px; font-size: 12px;">
                          +971 42 325 872
                      </td>
                  </tr>
                  <tr>
                      <td style="vertical-align: top;">
                          <img src="https://img.icons8.com/material-outlined/24/000000/email.png" style="vertical-align: middle; width: 15px;">
                      </td>
                      <td style="padding-left: 5px; ; font-size: 12px;">
                          <a href="mailto:sales@leedsaerospace.com" style="color: black; text-decoration: none;">sales@leedsaerospace.com</a>
                      </td>
                  </tr>
                  <tr>
                      <td style="vertical-align: center;">
                          <img src="https://img.icons8.com/material-outlined/24/000000/internet.png" style="vertical-align: middle;  width: 15px;">
                      </td>
                      <td style="padding-left: 5px; ; font-size: 12px;">
                          <a href="https://www.leedsaerospace.com" style="color: black; text-decoration: none;">www.leedsaerospace.com</a>
                      </td>
                  </tr>
                  <tr>
                      <td style="vertical-align: center;">
                          <img src="https://img.icons8.com/material-outlined/24/000000/marker.png" style="vertical-align: middle; padding-top: 5px;  width: 15px;">
                      </td>
                      <td style="padding-left: 5px; font-size: 11px; ">
                          Premise#S202/06, ASC, MBRAH,
                          Near Al Maktoum Airport,
                          Dubai South, UAE
                      </td>
                  </tr>
              </table>
          </td>
      </tr>
      <tr>
          <td colspan="2" style="font-size: 9px; color: #666; padding-top: 5px; text-align: justify;">
              <div style="width: 100%;">
                  <p>
                      The content of this email is confidential and intended for the recipient specified in the message only. 
                      It is strictly forbidden to share any part of this message with any third party without written consent 
                      of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, 
                      so that we can ensure such a mistake does not occur in the future.
                  </p>
              </div>
          </td>
      </tr>
    </table>`;
};

async function findFinanceMail() {
    try {
        const userPositions = await UserPosition.findAll({
            include: [{
                model: Designation,
                where: { designationName: 'FINANCE MANAGER' },
                attributes: []
            }],
            attributes: ['projectMailId']
        });

        if (!userPositions || userPositions.length === 0) {
            return null;
        }

        return userPositions.map(user => user.projectMailId);

    } catch (error) {
        console.error("Error fetching finance manager emails:", error);
        return null;
    }
}

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

                { model: PerformaInvoiceStatus },
                
                
                { model: User, as: 'salesPerson', attributes: ['name'] },
                { model: User, as: 'kam', attributes: ['name'] },
                { model: User, as: 'am', attributes: ['name'] },
                { model: User, as: 'accountant', attributes: ['name'] },
                { model: User, as: 'addedBy', attributes: ['name','roleId'],
                    include: [
                        { model: Role, attributes: ['roleName']}
                        
                    ]
                }
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
              roleName: '', // You might need separate call for role details
              abbreviation: ''
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
              roleName: '', // You might need separate call for role details
              abbreviation: ''
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
    
    // Initialize the where clause
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
    
    // Handle search
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

    // Determine team members (if user is part of a team)
    let allowedUserIds = [userId]; // Start with current user
    
    // try {
    //   // Check if user is a team member
    //   const teamMember = await TeamMember.findOne({ where: { userId } });
      
    //   if (teamMember) {
    //     const teamId = teamMember.teamId;
    //     allowedUserIds = await getTeamUserIds(teamId);
    //   } else {
    //     // Check if user is a team leader
    //     const teamLeader = await TeamLeader.findOne({ where: { userId } });
        
    //     if (teamLeader) {
    //       const teamId = teamLeader.teamId;
    //       allowedUserIds = await getTeamUserIds(teamId);
    //     }
    //   }
    // } catch (teamError) {
    //   console.error('Error fetching team data:', teamError);
    //   // Continue with just the current user if team fetch fails
    // }

    // Update where clause to include all team user IDs
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
              roleName: '', // You might need separate call for role details
              abbreviation: ''
            }
          };
        });
      } catch (error) {
        console.error('Error fetching users from auth service:', error);
        // Continue with empty usersMap
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
    const emailSignature = await getEmailSignature(req.user.id, req.user.name);
    const financeEmail = await findFinanceMail()

    const { bankSlip } = req.body;
    try {
        pi = await PerformaInvoice.findByPk(req.params.id,
          {  include: [
                { model: User, as: 'salesPerson', attributes: ['name','empNo'] },
                { model: User, as: 'kam', attributes: ['name','empNo'] },
                { model: User, as: 'am', attributes: ['name','empNo'] },
                { model: User, as: 'accountant', attributes: ['name','empNo'] }
            ]}
        );
        if (!pi) {
            return res.send('Invoice not found' );
        }
        
        let message = 'processed'
        if( pi.bankSlip != null){
            message = 'updated'
            pi.count += 1;
            await pi.save();

            const key = pi.bankSlip;
            const fileKey = key ? key.replace(`https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/`, '') : null;
            try {
              if (!fileKey) {
                return res.send({ message: 'No file key provided' });
              }
    
              // Set S3 delete parameters
              const deleteParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey
              };
    
              await s3.deleteObject(deleteParams).promise();
              
            }catch (error) {
              res.send(error.message)
            }
        }

        const userRoles = [
            { id: pi.salesPersonId, role: 'SalesPerson', empNo: pi.salesPerson?.empNo, name: pi.salesPerson?.name },
            { id: pi.kamId, role: 'KAM', empNo: pi.kam?.empNo, name: pi.kam?.name  },
            { id: pi.amId, role: 'AM', empNo: pi.am?.empNo, name: pi.am?.name  },
            { id: pi.accountantId, role: 'Accountant', empNo: pi.accountant?.empNo, name: pi.accountant?.name  }
          ].filter(user => user.id !== null);
        
          if (userRoles.length === 0) {
            return res.send("No user IDs found in the invoice.");
          }
        
           // Step 2: Get project emails for all user roles
            const userPositions = await UserPosition.findAll({
                where: { userId: userRoles.map(user => user.id) },
                attributes: ['userId', 'projectMailId']
            });
  
            // Map user IDs to project emails
            const userEmailMap = new Map(userPositions.map(user => [user.userId, user.projectMailId]));
  
            // Check for missing emails
            const missingEmails = userRoles
                .filter(user => !userEmailMap.get(user.id) || userEmailMap.get(user.id) === null)
                .map(user => `${user.role}-${user.name} with ID ${user.empNo} is missing a project email.`);
        
            if (missingEmails.length > 0) {
                return res.send(`Missing project emails: \n${missingEmails.join('\n')}` );
            }
  
      // Step 3: Collect all other project emails except for the accountant's email
      const recipientEmails = userPositions
        .filter(user => user.userId !== pi.accountantId)
        .map(user => user.projectMailId);
  
      // Proceed with status validation and updates
      let newStat;
      if (pi.status === 'AM APPROVED' || pi.status === 'CARD PAYMENT SUCCESS') {
        newStat = 'CARD PAYMENT SUCCESS';
      } else if (pi.status === 'AM VERIFIED' || pi.status === 'BANK SLIP ISSUED') {
        newStat = 'BANK SLIP ISSUED';
      } else {
        return res.json({ message: 'Invalid status' });
      }
  
      // Update the invoice status and save
      pi.bankSlip = bankSlip;
      pi.status = newStat;
      await pi.save();
  
      // Log status change in PerformaInvoiceStatus
      await PerformaInvoiceStatus.create({
        performaInvoiceId: pi.id,
        status: newStat,
        date: new Date()
      });


    //  Fetch supplier and customer details for email
      const [supplier, customer] = await Promise.all([
        Company.findOne({ where: { id: pi.supplierId } }),
        Company.findOne({ where: { id: pi.customerId } })
      ]);
  
      const supplierName = supplier ? supplier.companyName : 'Unknown Supplier';
      const customerName = customer ? customer.companyName : 'Unknown Customer';
  
      const attachments = [];
  
      // Step 5: Prepare file attachments from S3 for invoice URL list
      for (const fileObj of pi.url) {
        const actualUrl = fileObj.url || fileObj.file;
        if (!actualUrl || typeof actualUrl !== 'string') continue;
  
        const fileKey = actualUrl.replace(`https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/`, '');
        const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: fileKey };
  
        try {
          const s3File = await s3.getObject(params).promise();
          attachments.push({
            filename: actualUrl.split('/').pop(),
            content: s3File.Body,
            contentType: s3File.ContentType,
          });
        } catch (error) {
          continue;
        }
      }
  
      // Step 6: Attach bank slip if available
      if (bankSlip && typeof bankSlip === 'string') {
        const fileKey = bankSlip.replace(`https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/`, '');
        const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: fileKey };
  
        try {
          const s3File = await s3.getObject(params).promise();
          attachments.push({
            filename: bankSlip.split('/').pop(),
            content: s3File.Body,
            contentType: s3File.ContentType,
          });
        } catch (error) {
          console.error("Error fetching bank slip from S3:", error);
        }
      }
  
      // Step 7: Prepare email subject and body
      let emailSubject, emailBody;
  
      if (pi.status === 'CARD PAYMENT SUCCESS') {
            emailSubject = `Card Payment Successfully Processed for Proforma Invoice - ${pi.piNo}`;
            emailBody = `
                <p>Dear Team,</p>
                <p>We are pleased to inform you that the card payment for proforma invoice: <strong>${pi.piNo}</strong> has been successfully ${message}.</p>
                <p>Please find the bank slip attached for your records. If you have any questions or require further assistance, feel free to reach out.</p>
                
                    <p><strong>Entry Number:</strong> ${pi.piNo}</p>
                <p><strong>Supplier Name:</strong> ${supplierName}</p>
                <p><strong>Supplier PO No:</strong> ${pi.supplierPoNo}</p>
                <p><strong>Supplier SO No:</strong> ${pi.supplierSoNo}</p>
                <p><strong>Status:</strong> ${pi.status}</p>
                ${pi.purpose === 'Stock' 
                    ? `<p><strong>Purpose:</strong> Stock</p>` 
                    : `<p><strong>Purpose:</strong> Customer</p>
                        <p><strong>Customer Name:</strong> ${customerName}</p>
                        <p><strong>Customer PO No:</strong> ${pi.customerPoNo}</p>
                        <p><strong>Customer SO No:</strong> ${pi.customerSoNo}</p>`
                }
                <p><strong>Payment Mode:</strong> ${pi.paymentMode}</p>
                <p><strong>Notes:</strong> ${pi.notes}</p>
                <p>Thank you for your attention to this matter.</p>
            
                ${emailSignature}`;
      } else if (pi.status === 'BANK SLIP ISSUED') {
            emailSubject = `Payslip Issued for Proforma Invoice - ${pi.piNo}`;
            emailBody = `
                <p>Dear Team,</p>
                <p>A bank slip has been issued for proforma invoice: <strong>${pi.piNo}</strong>. You may review the attached document for the payment details.</p>
                <p>Kindly review at your earliest convenience, and please reach out if you need any additional information.</p>
                <p><strong>Entry Number:</strong> ${pi.piNo}</p>
                <p><strong>Supplier Name:</strong> ${supplierName}</p>
                <p><strong>Supplier PO No:</strong> ${pi.supplierPoNo}</p>
                <p><strong>Supplier SO No:</strong> ${pi.supplierSoNo}</p>
                <p><strong>Status:</strong> ${pi.status}</p>
                ${pi.purpose === 'Stock' 
                    ? `<p><strong>Purpose:</strong> Stock</p>` 
                    : `<p><strong>Purpose:</strong> Customer</p>
                        <p><strong>Customer Name:</strong> ${customerName}</p>
                        <p><strong>Customer PO No:</strong> ${pi.customerPoNo}</p>
                        <p><strong>Customer SO No:</strong> ${pi.customerSoNo}</p>`
                }
                <p><strong>Payment Mode:</strong> ${pi.paymentMode}</p>
                <p><strong>Notes:</strong> ${pi.notes}</p>
                ${emailSignature}
            `;
        }
  
      const mailOptions = {
        from: `Proforma Invoice <${process.env.EMAIL_USER}>`,
        to: recipientEmails.join(','),
        cc: financeEmail,
        subject: emailSubject,
        html: emailBody,
        attachments: attachments
      };
  
      // Step 8: Send email if recipients are available
      if (recipientEmails.length > 0) {
        await transporter.sendMail(mailOptions);
      } else {
        console.error(`No recipients defined for ${newStat}. Email not sent.`);
      }
  
      // Step 9: Create notifications for each user involved in the invoice
      await Promise.all(userRoles.map(user => 
        Notification.create({
          userId: user.id,
          message: `${newStat} for Proforma Invoice ID: ${pi.piNo}.`,
          isRead: false,
        })
      ));
  
      return res.json({ pi, status: newStat });
  
    } catch (error) {
      return res.send(error.message );
    }
}

// Alternative: If you want to keep the original structure but fetch users separately
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