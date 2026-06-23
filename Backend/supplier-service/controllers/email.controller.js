const nodemailer = require('nodemailer');

// A. Reusable template generator (Single Source of Truth)
const buildCorporateTemplate = (supplierName, expiryDate) => {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      <div style="background-color: #0f172a; padding: 25px; text-align: left; border-bottom: 4px solid #e11d48;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">LEEDS AEROSPACE</h1>
        <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Global Supply Chain & Compliance Registry</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff;">
        <p>Dear Valued Supplier,</p>
        
        <p>We hope you are doing well.</p>
        
        <p>As part of our supplier quality records maintenance, we would appreciate receiving a copy of your latest quality certification, as our records indicate that the current certificate may be approaching its expiry date.</p>
        
        <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 12px 16px; margin: 20px 0; border-radius: 0 4px 4px 0;">
          <span style="font-size: 13px; color: #9f1239; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 2px;">Expiration Date</span>
          <span style="color: #e11d48; font-size: 18px; font-weight: 700; font-family: monospace;">${expiryDate}</span>
        </div>
        
        <p>At your convenience, kindly share the updated certificate so that we may keep our records current and ensure uninterrupted supplier approval status within our system.</p>
        
        <p>If the updated certification has already been provided, please disregard this message.</p>
        
        <p>Thank you for your continued support and partnership.</p>
        
        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 24px;">
          <p style="margin-bottom: 4px; color: #64748b; font-size: 13px;">Best Regards,</p>
          <p style="margin-top: 0; font-size: 14px; color: #0f172a;"><strong>Quality Team</strong><br><span style="color: #64748b; font-size: 13px;">Leeds Aerospace</span></p>
        </div>
      </div>
      <div style="background-color: #f8fafc; padding: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
        <p style="font-size: 11px; color: #94a3b8; margin: 0 0 8px 0;">This communication is an automated system dispatch from Leeds Aerospace. Confidentiality rules apply.</p>
        <p style="font-size: 10px; color: #cbd5e1; margin: 0; text-transform: uppercase;">Premise #S202/06, ASC, MBRAH, Dubai South, UAE</p>
      </div>
    </div>`;
};

// B. ENDPOINT 1: Returns raw HTML string back to your Angular App for previewing
exports.getEmailPreview = async (req, res) => {
  try {
    const { supplierName, expiryDate } = req.body;
    const compiledHtml = buildCorporateTemplate(supplierName, expiryDate);
    
    res.status(200).json({ 
      html: compiledHtml,
      subject: `Request for Updated Quality Certification - ${supplierName}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to compile layout preview.' });
  }
};

// C. ENDPOINT 2: Dispatches the exact same template via Nodemailer SMTP
exports.sendRenewalEmail = async (req, res) => {
  const { to, supplierName, expiryDate } = req.body;
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });

  const mailOptions = {
    from: `"Leeds Aerospace Quality Compliance" <${process.env.SMTP_USER}>`,
    to: to,
    subject: `Request for Updated Quality Certification - ${supplierName}`,
    html: buildCorporateTemplate(supplierName, expiryDate)
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Notice dispatched successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: "SMTP Pipeline processing error." });
  }
};