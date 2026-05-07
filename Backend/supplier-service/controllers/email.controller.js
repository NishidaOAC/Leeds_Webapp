const nodemailer = require('nodemailer');

exports.sendRenewalEmail = async (req, res) => {
  const { to, supplierName, expiryDate, customMessage } = req.body;

  // Use 'service: gmail' to handle host/port/secure defaults automatically
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER, // your email: anupama@onbaordaero.com
      pass: process.env.SMTP_PASS  // your 16-character App Password
    }
  });

  const mailOptions = {
    // Standard Corporate Sender Identity
    from: `"Aero Assist Compliance" <${process.env.SMTP_USER}>`,
    to: to,
    subject: `Official Notice: Certificate Renewal Required - ${supplierName}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #f0f0f0; padding: 25px;">
        <h2 style="color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 10px; margin-top: 0;">
          Certification Renewal Notice
        </h2>
        
        <p>Dear <strong>${supplierName}</strong>,</p>
        
        <p>This is a formal notification regarding your quality certification on file with <strong>Aero Assist</strong>, which is scheduled to expire on <span style="color: #d32f2f; font-weight: bold;">${expiryDate}</span>.</p>
        
        <p>${customMessage || 'To maintain your approved status in our supplier directory, please submit an updated copy of your certification at your earliest convenience.'}</p>
        
     
        <br>
        <p style="margin-bottom: 0;">Best Regards,</p>
        <p style="margin-top: 5px;"><strong>Quality Governance Team</strong><br>Aero Assist</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="font-size: 11px; color: #999; text-align: center;">
          This is an automated compliance message. Please disregard if you have already submitted your updated documentation.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Corporate reminder sent successfully.' });
  } catch (error) {
    // Provides clearer error feedback for debugging SMTP issues
    console.error("Nodemailer Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to dispatch email. Please verify SMTP credentials." });
  }
};