const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const axios = require('axios');
const Company = require('../models/company'); // Adjust path as needed

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Email transporter
const transporter = nodemailer.createTransport({
service: 'Gmail',
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
},
});

class EmailService {
  /**
   * Send status update email
   */
  async sendStatusUpdateEmail({ pi, status, remarks, user, toEmail }) {
    try {
      // Input validation
      if (!toEmail) throw new Error('Recipient email is required');
      
      // Extract data
      const [supplier, customer] = await Promise.all([
        Company.findOne({ where: { id: pi.supplierId } }),
        Company.findOne({ where: { id: pi.customerId } })
      ]);

      const emailData = {
        piNo: pi.piNo,
        supplierName: supplier?.companyName || 'Unknown Supplier',
        supplierPoNo: pi.supplierPoNo,
        supplierSoNo: pi.supplierSoNo,
        supplierPrice: pi.supplierPrice,
        supplierCurrency: pi.supplierCurrency,
        status,
        paymentMode: pi.paymentMode,
        purpose: pi.purpose,
        customerName: customer?.companyName || 'Unknown Customer',
        customerPoNo: pi.customerPoNo,
        customerSoNo: pi.customerSoNo,
        customerCurrency: pi.customerCurrency,
        poValue: pi.poValue,
        notes: remarks || pi.notes,
        requestedBy: user.name
      };

      // Handle attachments
      let attachments = [];
      if (pi.url && Array.isArray(pi.url)) {
        console.log(`Processing ${pi.url.length} URL objects for attachments`);
        
        try {
          // Extract URLs
          const urls = pi.url
            .filter(item => item?.url && typeof item.url === 'string')
            .map(item => item.url);
          
          if (urls.length > 0) {
            attachments = await this.getAttachmentsFromS3(urls);
          }
        } catch (s3Error) {
          console.warn('S3 attachment fetch failed, sending email without attachments:', s3Error.message);
          attachments = [];
        }
      }

      // Send email
      const mailOptions = {
        from: `Aeroassist - ${user.name} <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: this.getStatusMessage(pi.piNo, status),
        html: this.generateStatusUpdateTemplate(emailData),
        attachments: attachments
      };

      console.log(`Sending email to ${toEmail} with ${attachments.length} attachments...`);
      const result = await transporter.sendMail(mailOptions);
      
      console.log(`✅ Email sent: ${result.messageId}, Attachments: ${attachments.length}`);
      
      return { 
        success: true, 
        messageId: result.messageId,
        attachmentsCount: attachments.length
      };
      
    } catch (error) {
      console.error('❌ Email failed:', error.message);
      throw error;
    }
  }

    /**
   * Send new PI creation email (for addPIKAM)
   */
  async sendBankSlipEmail({ 
    piNo, 
    supplierName, 
    supplierPoNo, 
    supplierSoNo, 
    supplierPrice,
    supplierCurrency,
    status, 
    paymentMode, 
    purpose,
    customerName,
    customerPoNo,
    customerSoNo,
    customerCurrency,
    notes,
    requestedBy,
    toEmail,
    ccEmails = [],
    attachments = []
  }) {
    try {
      const mailOptions = {
        from: `Aeroassist - ${requestedBy} <${process.env.SMTP_USER}>`,
        to: toEmail,
        cc: ccEmails,
        subject: `Payment Completed - ${piNo} / ${supplierPoNo}`,
        html: this.generateNewPITemplate({
          piNo,
          supplierName,
          supplierPoNo,
          supplierSoNo,
          supplierPrice,
          supplierCurrency,
          status,
          paymentMode,
          purpose,
          customerName,
          customerPoNo,
          customerSoNo,
          customerCurrency,
          notes,
          requestedBy,
          action: 'BankSlip Added'
        }),
        attachments: attachments
      };

      const result = await transporter.sendMail(mailOptions);
      console.log(`New PI email sent successfully to ${toEmail}: ${result.messageId}`);
      
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error('New PI email sending failed:', error);
      throw new Error(`Failed to send new PI email: ${error.message}`);
    }
  }

  async sendUpdatedPIEmail({ 
    piNo, 
    supplierName, 
    supplierPoNo, 
    supplierSoNo, 
    supplierPrice,
    supplierCurrency,
    status, 
    paymentMode, 
    purpose,
    customerName,
    customerPoNo,
    customerSoNo,
    customerCurrency,
    poValue,
    notes,
    updatedBy,
    toEmail,
    ccEmails = [],
    attachments = [],
    action = 'updated'
  }) {
    try {
      // Input validation
      if (!toEmail) {
        throw new Error('Recipient email is required for update email');
      }

      const actionText = action.charAt(0).toUpperCase() + action.slice(1);
      const subject = `Proforma Invoice ${actionText} - ${piNo}`;

      // Generate email HTML
      const htmlContent = this.generateNewPITemplate({
        piNo,
        supplierName,
        supplierPoNo,
        supplierSoNo,
        supplierPrice,
        supplierCurrency,
        status,
        paymentMode,
        purpose,
        customerName,
        customerPoNo,
        customerSoNo,
        poValue,
        customerCurrency,
        poValue,
        notes,
        action: 'Payment Request Updated',
        updatedBy,
        attachmentsCount: attachments.length,
      });

      // Prepare mail options
      const mailOptions = {
        from: `Aeroassist - ${updatedBy} <${process.env.EMAIL_USER}>`,
        to: toEmail,
        cc: ccEmails && ccEmails.length > 0 ? ccEmails.join(',') : undefined,
        subject: subject,
        html: htmlContent,
        attachments: attachments
      };

      console.log(`Sending ${action} email for PI ${piNo} to ${toEmail} with ${attachments.length} attachments...`);
      const result = await transporter.sendMail(mailOptions);
      
      console.log(`✅ ${actionText} email sent: ${result.messageId}`);
      
      return { 
        success: true, 
        messageId: result.messageId,
        attachmentsCount: attachments.length
      };
      
    } catch (error) {
      console.error(`❌ Failed to send ${action} email:`, error.message);
      throw new Error(`Failed to send ${action} email: ${error.message}`);
    }
  }


  /**
   * Send new PI creation email (for addPIKAM)
   */
  async sendNewPIEmail({ 
    piNo, 
    supplierName, 
    supplierPoNo, 
    supplierSoNo, 
    supplierPrice,
    supplierCurrency,
    status, 
    paymentMode, 
    purpose,
    customerName,
    customerPoNo,
    customerSoNo,
    poValue,
    customerCurrency,
    notes,
    requestedBy,
    toEmail,
    ccEmails = [],
    attachments = []
  }) {
    try {
      const mailOptions = {
        from: `Aeroassist - ${requestedBy} <${process.env.SMTP_USER}>`,
        to: toEmail,
        cc: ccEmails,
        subject: `New Payment Request Generated - ${piNo} / ${supplierPoNo}`,
        html: this.generateNewPITemplate({
          piNo,
          supplierName,
          supplierPoNo,
          supplierSoNo,
          supplierPrice,
          supplierCurrency,
          status,
          paymentMode,
          purpose,
          customerName,
          customerPoNo,
          customerSoNo,
          poValue,
          customerCurrency,
          notes,
          requestedBy,
          action: 'New Payment Request Generated'
        }),
        attachments: attachments
      };

      const result = await transporter.sendMail(mailOptions);
      console.log(`New PI email sent successfully to ${toEmail}: ${result.messageId}`);
      
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error('New PI email sending failed:', error);
      throw new Error(`Failed to send new PI email: ${error.message}`);
    }
  }

  

  /**
   * Get notification message for status
   */
  getStatusMessage(piNo, status) {
    const messages = {
      'AM APPROVED': `The Proforma Invoice ${piNo} has been approved by AM.`,
      'INITIATED': `The Proforma Invoice ${piNo} has been initiated.`,
      'KAM VERIFIED': `The Proforma Invoice ${piNo} has been verified by KAM.`,
      'KAM REJECTED': `The Proforma Invoice ${piNo} has been rejected by KAM.`,
      'AM VERIFIED': `The Proforma Invoice ${piNo} has been verified by AM.`,
      'AM DECLINED': `The Proforma Invoice ${piNo} has been declined by AM.`,
      'AM REJECTED': `The Proforma Invoice ${piNo} has been rejected by AM.`
    };
    
    return messages[status] || `Status update for Proforma Invoice ${piNo}`;
  }

  /**
   * Generate HTML template for status updates
   */
  generateStatusUpdateTemplate(data) {
    return this.generateEmailTemplate(data, 'Status Update');
  }

  /**
   * Generate HTML template for new PI creation
   */
  generateNewPITemplate(data) {
    return this.generateEmailTemplate(data, data.action);
  }

  /**
   * Generic HTML email template generator
   */
  // ${data.requestedBy ? `<p><em>Request Generated By <strong>${data.requestedBy}</strong></em></p>` : ''}
  generateEmailTemplate(data, emailType = 'Proforma Invoice') {
    const isCustomerPurpose = data.purpose && data.purpose.toLowerCase().includes('customer');
    // const statusClass = this.getStatusClass(data.status);
    const statusBadge = this.getStatusBadgeText(data.status);
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; padding: 20px; border-radius: 8px 8px 0 0; 
            text-align: center; 
          }
          .content { background: #f9f9f9; padding: 25px; border-radius: 0 0 8px 8px; }
          .info-item { margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #555; min-width: 200px; display: inline-block; }
          .value { color: #222; }
          .footer { 
            margin-top: 25px; padding-top: 20px; border-top: 1px solid #ddd; 
            font-size: 12px; color: #777; text-align: center; 
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 12px;
            margin-left: 10px;
          }
          .status-approved { background: #d4edda; color: #155724; }
          .status-rejected { background: #f8d7da; color: #721c24; }
          .status-verified { background: #d1ecf1; color: #0c5460; }
          .status-pending { background: #fff3cd; color: #856404; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${emailType}</h2>
          </div>
          <div class="content">
            <div class="info-item">
              <span class="label">Entry Number:</span>
              <span class="value">${data.piNo}</span>
            </div>
            
            <div class="info-item">
              <span class="label">Supplier Name:</span>
              <span class="value">${data.supplierName}</span>
            </div>
            
            ${data.supplierPoNo ? `
              <div class="info-item">
                <span class="label">PO No:</span>
                <span class="value">${data.supplierPoNo}</span>
              </div>
            ` : ''}
            
            ${data.supplierSoNo ? `
              <div class="info-item">
                <span class="label">Supplier Invoice No:</span>
                <span class="value">${data.supplierSoNo}</span>
              </div>
            ` : ''}
            
            ${data.supplierPrice && data.supplierCurrency ? `
              <div class="info-item">
                <span class="label">Supplier Price:</span>
                <span class="value">${data.supplierPrice} ${data.supplierCurrency}</span>
              </div>
            ` : ''}
            
            ${data.status ? `
              <div class="info-item">
                <span class="label">Status:</span>
                <span class="value">${data.status}</span>
              </div>
            ` : ''}
            
            ${data.paymentMode ? `
              <div class="info-item">
                <span class="label">Payment Mode:</span>
                <span class="value">${data.paymentMode}</span>
              </div>
            ` : ''}
            
            <div class="info-item">
              <span class="label">Purpose:</span>
              <span class="value">${data.purpose}</span>
            </div>
            
            ${isCustomerPurpose ? `
              ${data.customerName ? `
                <div class="info-item">
                  <span class="label">Customer Name:</span>
                  <span class="value">${data.customerName}</span>
                </div>
              ` : ''}
              
              ${data.customerPoNo ? `
                <div class="info-item">
                  <span class="label">Customer PO No:</span>
                  <span class="value">${data.customerPoNo}</span>
                </div>
              ` : ''}
              
              ${data.customerSoNo ? `
                <div class="info-item">
                  <span class="label">Customer SO No:</span>
                  <span class="value">${data.customerSoNo}</span>
                </div>
              ` : ''}
              
              ${data.customerCurrency ? `
                <div class="info-item">
                  <span class="label">Customer Price:</span>
                  <span class="value">${data.poValue || 'N/A'} ${data.customerCurrency}</span>
                </div>
              ` : ''}
            ` : ''}
            
            ${data.notes ? `
              <div class="info-item">
                <span class="label">Notes:</span>
                <span class="value">${data.notes}</span>
              </div>
            ` : `<div class="info-item">
                  <span class="label">Notes:</span>
                  <span class="value">No notes provided</span>
                </div>`}
            
            <p style="margin-top: 20px; font-style: italic;">
              Please find the attached documents related to this Proforma Invoice.
            </p>
          </div>
          <div class="footer">
            <p>This is an automated notification from the Approval Management System.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get CSS class for status badge
   */
  // getStatusClass(status) {
  //   const statusMap = {
  //     'AM APPROVED': 'status-approved',
  //     'KAM VERIFIED': 'status-verified',
  //     'AM VERIFIED': 'status-verified',
  //     'KAM REJECTED': 'status-rejected',
  //     'AM REJECTED': 'status-rejected',
  //     'AM DECLINED': 'status-rejected',
  //     'INITIATED': 'status-pending',
  //     'GENERATED': 'status-pending'
  //   };
  //   return statusMap[status] || '';
  // }

  /**
   * Get status badge text
   */
  getStatusBadgeText(status) {
    const textMap = {
      'AM APPROVED': 'APPROVED',
      'KAM VERIFIED': 'VERIFIED',
      'AM VERIFIED': 'VERIFIED',
      'KAM REJECTED': 'REJECTED',
      'AM REJECTED': 'REJECTED',
      'AM DECLINED': 'DECLINED',
      'INITIATED': 'PENDING',
      'GENERATED': 'PENDING'
    };
    return textMap[status] || status;
  }

  /**
   * Fetch attachments from S3
   */
  async getAttachmentsFromS3(urls) {
      console.log('getAttachmentsFromS3 called with:', JSON.stringify(urls, null, 2));
      
      const attachments = [];
      
      // If urls is undefined or null, return empty array
      if (!urls) {
          console.log('No URLs provided');
          return attachments;
      }
      
      // Ensure we have a flat array
      let flatUrls = [];
      
      // Handle different input formats
      if (Array.isArray(urls)) {
          // Flatten the array and extract URLs
          flatUrls = urls.flat(Infinity)
              .map(item => {
                  if (typeof item === 'string') {
                      return item;
                  } else if (item && typeof item === 'object' && item.url) {
                      return item.url;
                  }
                  return null;
              })
              .filter(Boolean); // Remove null/undefined
      } else if (typeof urls === 'string') {
          flatUrls = [urls];
      } else if (urls && urls.url) {
          flatUrls = [urls.url];
      }
      
      console.log('Flat URLs to process:', flatUrls);
      
      if (flatUrls.length === 0) {
          console.log('No valid URLs found');
          return attachments;
      }
      
      for (const actualUrl of flatUrls) {
          try {
              console.log('Processing S3 URL:', actualUrl);
              
              if (!actualUrl || typeof actualUrl !== 'string') {
                  console.log('Skipping invalid URL');
                  continue;
              }

              // Extract file key from URL - FIXED VERSION
              const fileKey = this.extractS3KeyFromUrl(actualUrl);
              
              if (!fileKey) {
                  console.warn('Could not extract S3 key from URL:', actualUrl);
                  continue;
              }

              console.log('S3 Key extracted:', fileKey);
              
              const params = {
                  Bucket: process.env.AWS_BUCKET_NAME,
                  Key: fileKey,
              };

              console.log('Fetching from S3 with params:', { 
                  Bucket: params.Bucket, 
                  Key: params.Key.substring(0, 100) + (params.Key.length > 100 ? '...' : '')
              });
              
              const s3File = await s3.getObject(params).promise();
              
              console.log('S3 file fetched successfully:', {
                  size: s3File.Body.length,
                  contentType: s3File.ContentType
              });
              
              // Generate filename
              const filename = this.getFilenameFromS3Key(fileKey) || actualUrl.split('/').pop() || 'document.png';
              
              attachments.push({
                  filename: filename,
                  content: s3File.Body,
                  contentType: s3File.ContentType || this.getContentTypeFromFilename(filename),
                  encoding: 'base64'
              });
              
              console.log(`Attachment added: ${filename} (${s3File.Body.length} bytes)`);
              
          } catch (error) {
              console.warn(`Failed to fetch attachment from ${actualUrl}:`, error.message);
              console.error('S3 Error details:', error.code, error.statusCode);
              // Continue with other attachments
          }
      }
      
      console.log(`Total attachments prepared: ${attachments.length}`);
      return attachments;
  }

  // Improved S3 key extraction
  extractS3KeyFromUrl(url) {
      if (!url || typeof url !== 'string') return null;
      
      try {
          const urlObj = new URL(url);
          let key = urlObj.pathname;
          if (key.startsWith('/')) {
              key = key.substring(1);
          }
          key = decodeURIComponent(key);
          return key;
          
      } catch (error) {
          try {
              // Remove the S3 domain prefix
              const domainPattern = `${process.env.AWS_BUCKET_NAME}.${process.env.AWS_REGION}.amazonaws.com/`;
              if (url.startsWith(domainPattern)) {
                  let key = url.substring(domainPattern.length);
                  key = decodeURIComponent(key)
                  return key;
              }
          } catch (fallbackError) {
              console.error('Fallback extraction failed:', fallbackError);
          }
          
          return null;
      }
  }

  // Helper method to get filename from S3 key
  getFilenameFromS3Key(key) {
      if (!key) return null;
      
      try {
          // Get the last part of the key (after last slash)
          const parts = key.split('/');
          const filename = parts[parts.length - 1];
          
          // If empty or just a slash, return null
          if (!filename || filename === '' || filename === '/') {
              return null;
          }
          
          return filename;
      } catch (error) {
          console.error('Error getting filename from S3 key:', error);
          return null;
      }
  }

  // Helper method to determine content type from filename
  getContentTypeFromFilename(filename) {
      if (!filename) return 'application/octet-stream';
      
      const ext = filename.toLowerCase().split('.').pop();
      const contentTypes = {
          'pdf': 'application/pdf',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'doc': 'application/msword',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'xls': 'application/vnd.ms-excel',
          'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'txt': 'text/plain',
          'csv': 'text/csv',
          'zip': 'application/zip'
      };
      
      return contentTypes[ext] || 'application/octet-stream';
  }

  /**
   * Get recipient email based on status and user roles
   */
  async getRecipientEmail({ pi, status, kamId, amId, accountantId }) {
    try {
      // Collect all user IDs
      const userIds = [];
      if (pi.salesPersonId) userIds.push(pi.salesPersonId);
      if (kamId) userIds.push(kamId);
      if (amId) userIds.push(amId);
      if (accountantId) userIds.push(accountantId);
      
      // Remove duplicates and null values
      const uniqueUserIds = [...new Set(userIds.filter(id => id))];

      let usersMap = {};
      if (uniqueUserIds.length > 0) {
        // Fetch users from auth service
        usersMap = await this.fetchUsersByIds(uniqueUserIds);
        
        if (Object.keys(usersMap).length === 0) {
          console.warn('Auth service returned empty response, using fallback');
        }
      }

      // Extract emails from users map
      const salesPersonEmail = usersMap[pi.salesPersonId]?.email || null;
      const kamEmail = usersMap[kamId]?.email || null;
      const accountantEmail = usersMap[accountantId]?.email || null;
      const amEmail = usersMap[amId]?.email || null;

      let toEmail = null;

      switch (status) {
        case 'AM APPROVED':
          toEmail = kamEmail;
          break;
        case 'INITIATED':
          toEmail = amEmail;
          break;
        case 'KAM VERIFIED':
          toEmail = amEmail;
          break;
        case 'KAM REJECTED':
          toEmail = salesPersonEmail;
          break;
        case 'AM VERIFIED':
          toEmail = accountantEmail;
          break;
        case 'AM DECLINED':
        case 'AM REJECTED':
          toEmail = pi.addedById === pi.salesPersonId ? salesPersonEmail : kamEmail;
          break;
        default:
          throw new Error(`Invalid status: ${status}`);
      }

      if (!toEmail) {
        throw new Error(`Email is missing for recipient. Status: ${status}`);
      }

      return toEmail;
      
    } catch (error) {
      console.error('Error getting recipient email:', error);
      throw error;
    }
  }

  /**
   * Fetch users by IDs from auth service
   */
  async fetchUsersByIds(userIds, authToken = null) {
    try {
      if (!userIds || userIds.length === 0) {
        return {};
      }

      const headers = {
        'Content-Type': 'application/json'
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await axios.post(
        `${process.env.AUTH_SERVICE_URL}/api/users/bulk`,
        { userIds },
        {
          headers,
          timeout: 10000
        }
      );

      // Transform response to map
      const usersMap = {};
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(user => {
          usersMap[user.id] = {
            email: user.email,
            name: user.name
          };
        });
      }

      return usersMap;
      
    } catch (error) {
      console.error('Failed to fetch users from auth service:', error.message);
      return {};
    }
  }

  /**
   * Get recipient info from auth service (for addPIKAM)
   */
  async getRecipientInfo(userId, authHeader) {
    try {
      const authToken = authHeader?.split(' ')[1];
      const response = await axios.get(
        `${process.env.AUTH_SERVICE_URL}/users/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          timeout: 10000
        }
      );
      console.log(response);
      
      if (response.data && response.data.success) {
        return {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch user from auth service:', error.message);
      return null;
    }
  }

  /**
   * Prepare email content for new PI (for addPIKAM)
   */
  async prepareNewPIEmailContent({ supplierId, customerId, urls }) {
      const [supplier, customer] = await Promise.all([
        Company.findOne({ where: { id: supplierId } }),
        Company.findOne({ where: { id: customerId } })
      ]);

      // Prepare attachments from S3 - Pass the urls array directly
      const attachments = await this.getAttachmentsFromS3(urls);
      
      return { 
        supplier, 
        customer, 
        attachments,
        supplierName: supplier ? supplier.companyName : 'Unknown Supplier',
        customerName: customer ? customer.companyName : 'Unknown Customer'
      };
  }

  /**
   * Find finance emails for CC
   */
  async findFinanceEmails() {
    try {
      // You can implement this based on your system
      // Example: return await User.findAll({ where: { role: 'finance' } });
      // For now, return from environment or empty array
      const financeEmails = process.env.FINANCE_EMAILS ? 
        process.env.FINANCE_EMAILS.split(',').filter(email => email.trim()) : [];
      return financeEmails;
    } catch (error) {
      console.error('Failed to find finance emails:', error);
      return [];
    }
  }
}

module.exports = new EmailService();