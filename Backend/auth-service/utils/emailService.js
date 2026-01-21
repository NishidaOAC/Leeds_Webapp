// emailService.js
const nodemailer = require('nodemailer');
const fromEmail = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: fromEmail,
    pass: password,
  },
});

const sendApprovalRequestEmail = async ({
  to,
  adminName,
  userName,
  userEmail,
  empNo,
  requestedAt,
  approvalLink,
  dashboardLink
}) => {
  const mailOptions = {
    from: `"AeroAssist" <>`,
    to,
    subject: 'New User Registration Requires Approval',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1c4768; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AeroAssist Fintech</h1>
          <p style="color: #e0e0e0; margin: 10px 0 0;">Approval System</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">New Registration Requires Your Approval</h2>
          
          <div style="background-color: white; border-left: 4px solid #1c4768; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1c4768; margin-top: 0;">User Details:</h3>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Employee Number:</strong> ${empNo || 'Not provided'}</p>
            <p><strong>Requested At:</strong> ${requestedAt}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${approvalLink}" 
               style="background-color: #1c4768; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;
                      font-weight: bold; font-size: 16px;">
              Review & Approve
            </a>
          </div>
          
          <p style="color: #666;">
            You can also review this request from your 
            <a href="${dashboardLink}" style="color: #1c4768;">admin dashboard</a>.
          </p>
          
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            This approval request will expire in 48 hours.
          </p>
        </div>
        
        <div style="background-color: #f0f0f0; padding: 15px; text-align: center; 
                    color: #666; font-size: 12px;">
          <p>AeroAssist Fintech Approvals System</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendUserConfirmationEmail = async ({ to, userName, adminEmail }) => {
  const mailOptions = {
    from: `"AeroAssist" <>`,
    to,
    subject: 'Registration Received - Pending Approval',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1c4768; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AeroAssist Fintech</h1>
          <p style="color: #e0e0e0; margin: 10px 0 0;">Welcome Aboard</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hello ${userName},</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Thank you for registering with AeroAssist Fintech Approvals System. 
            Your registration has been received and is currently pending approval.
          </p>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; 
                     padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="color: #856404; margin: 0;">
              <strong>Status:</strong> Pending Approval<br>
              <strong>Next Steps:</strong> Your account will be reviewed by an administrator.
            </p>
          </div>
          
          <p style="color: #555;">
            Once your account is approved, you will receive another email with 
            instructions on how to access the system.
          </p>
          
          <p style="color: #555;">
            If you have any questions, please contact your administrator at 
            <a href="mailto:${adminEmail}" style="color: #1c4768;">${adminEmail}</a>.
          </p>
          
          <p style="color: #555;">
            Estimated approval time: 24-48 hours
          </p>
        </div>
        
        <div style="background-color: #f0f0f0; padding: 15px; text-align: center; 
                    color: #666; font-size: 12px;">
          <p>AeroAssist Fintech Approvals System</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

// In your sendEmail function, ensure attachments is properly handled:
const sendEmail = async (fromEmail, emailPassword, toEmail, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: fromEmail,
        pass: emailPassword
      }
    });

    const mailOptions = {
      from: `"LeedsAeroSpace Payment App" <${fromEmail}>`,
      to: toEmail,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  sendApprovalRequestEmail,
  sendUserConfirmationEmail,
  sendEmail
};