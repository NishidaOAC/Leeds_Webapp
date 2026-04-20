// routes/email.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send-onboarding-email', async (req, res) => {
  const { to, subject, htmlContent, supplierName } = req.body;

  // 1. Configure Transporter (Use your SMTP details)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: '"AeroAssist Compliance" <compliance@aeroassist.com>',
    to: to,
    subject: subject,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;