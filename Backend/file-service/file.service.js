const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const S3Client = require('./utils/s3.client');
const constants = require('./config/constants');

class FileService {
  constructor() {
    this.s3 = S3Client.getInstance();
    this.bucketName = process.env.AWS_BUCKET_NAME || 'your-bucket-name';
    this.ALLOWED_MIME_TYPES = constants.ALLOWED_MIME_TYPES;
    this.MAX_FILE_SIZE = constants.MAX_FILE_SIZE;
  }

  async deleteFileByKey(s3Key) {
    try {
      if (!s3Key) {
        throw new Error('S3 key is required');
      }

      // Remove the base URL if present
      const cleanKey = s3Key.replace(
        'https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/',
        ''
      );

      const params = {
        Bucket: this.bucketName,
        Key: cleanKey
      };
      // Delete from S3
      await this.s3.deleteObject(params).promise();
      
      // Optional: Delete from database if you store metadata
      // await this.deleteFileMetadataByKey(cleanKey);
      
      return {
        success: true,
        message: 'File deleted successfully',
        deletedKey: cleanKey
      };
      
    } catch (error) {
      // Handle specific S3 errors
      if (error.code === 'NoSuchKey') {
        throw new Error(`File not found with key: ${s3Key}`);
      }
      
      if (error.code === 'AccessDenied') {
        throw new Error('Access denied to delete file. Check IAM permissions.');
      }
      
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  async uploadFile(file, metadata) {
    try {
      this.validateFile(file);

      // Generate unique file ID
      const fileId = uuidv4();
      const extension = this.getFileExtension(file.originalname);
      const fileName = `${fileId}${extension}`;
      const s3Key = `leeds-webapp/invoices/${fileName}`;

      // Check file size (e.g., 10MB limit)
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) {
        throw new Error(`File size exceeds ${MAX_SIZE / 1024 / 1024}MB limit`);
      }

      // Prepare metadata - ALL VALUES MUST BE STRINGS
      const s3Metadata = {
        originalName: encodeURIComponent(file.originalname),
        fileId: fileId,
        uploaderId: metadata.uploaderId || 'anonymous',
        context: metadata.context || 'general'
      };

      // Add custom metadata, ensuring all values are strings
      if (metadata.customMetadata) {
        Object.keys(metadata.customMetadata).forEach(key => {
          const value = metadata.customMetadata[key];
          // Convert all values to strings
          s3Metadata[key] = String(value);
        });
      }

      // Add file info as strings
      s3Metadata.fileSize = String(file.size);
      s3Metadata.mimeType = file.mimetype;

      // Prepare S3 upload params
      const params = {
        Bucket: this.bucketName,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline', // For browser display
        ACL: 'public-read',
        Metadata: s3Metadata
      };
      
      // Upload to S3
      const s3Response = await this.s3.upload(params).promise();
      
      // Store file metadata in database (all types preserved here)
      const fileInfo = {
        fileId,
        originalName: file.originalname,
        fileName: s3Key,
        fileUrl: s3Response.Location,
        mimeType: file.mimetype,
        size: file.size, // Keep as number in DB
        uploaderId: metadata.uploaderId,
        context: metadata.context,
        uploadedAt: new Date().toISOString(),
        metadata: metadata.customMetadata, // Original types preserved
        s3Response: {
          ETag: s3Response.ETag,
          Bucket: s3Response.Bucket,
          Key: s3Response.Key
        }
      };

      // Save to database
      await this.saveFileMetadata(fileInfo);

      return {
        success: true,
        fileId,
        fileUrl: s3Response.Location,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        metadata: fileInfo,
        data: fileInfo  // Add this for frontend compatibility
      };
      
    } catch (error) {
      console.error('❌ Upload failed!');
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        name: error.name
      });
      
      if (error.code === 'AccessControlListNotSupported') {
        throw new Error('S3 Block Public Access is enabled. Please disable it in AWS Console.');
      }
      
      // Handle specific S3 errors
      if (error.code === 'NoSuchBucket') {
        throw new Error(`Bucket "${this.bucketName}" does not exist`);
      }
      
      if (error.code === 'AccessDenied') {
        throw new Error('Access denied to S3 bucket. Check IAM permissions.');
      }
      
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async uploadBankSlip(file, metadata) {
    try {
      this.validateFile(file);

      // Generate unique file ID
      const fileId = uuidv4();
      const extension = this.getFileExtension(file.originalname);
      const fileName = `${fileId}${extension}`;
      const s3Key = `leeds-webapp/bankslips/${fileName}`;

      // Check file size (e.g., 10MB limit)
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) {
        throw new Error(`File size exceeds ${MAX_SIZE / 1024 / 1024}MB limit`);
      }

      // Prepare metadata - ALL VALUES MUST BE STRINGS
      const s3Metadata = {
        originalName: encodeURIComponent(file.originalname),
        fileId: fileId,
        uploaderId: metadata.uploaderId || 'anonymous',
        context: 'bank_slip', // Specific context for bank slips
        transactionId: metadata.transactionId || 'unknown',
        paymentDate: metadata.paymentDate || new Date().toISOString(),
        amount: metadata.amount || '0',
        referenceNumber: metadata.referenceNumber || ''
      };

      // Add custom metadata, ensuring all values are strings
      if (metadata.customMetadata) {
        Object.keys(metadata.customMetadata).forEach(key => {
          const value = metadata.customMetadata[key];
          s3Metadata[key] = String(value);
        });
      }

      // Add file info as strings
      s3Metadata.fileSize = String(file.size);
      s3Metadata.mimeType = file.mimetype;

      // Prepare S3 upload params
      const params = {
        Bucket: this.bucketName,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
        ACL: 'public-read',
        Metadata: s3Metadata
      };

      // Upload to S3
      const s3Response = await this.s3.upload(params).promise();
      // Store bank slip metadata in database
      const fileInfo = {
        fileId,
        originalName: file.originalname,
        fileName: s3Key,
        fileUrl: s3Response.Location,
        mimeType: file.mimetype,
        size: file.size,
        uploaderId: metadata.uploaderId,
        context: 'bank_slip',
        transactionId: metadata.transactionId,
        paymentDate: metadata.paymentDate,
        amount: metadata.amount,
        referenceNumber: metadata.referenceNumber,
        uploadedAt: new Date().toISOString(),
        metadata: metadata.customMetadata,
        s3Response: {
          ETag: s3Response.ETag,
          Bucket: s3Response.Bucket,
          Key: s3Response.Key
        }
      };

      // Save to database
      await this.saveFileMetadata(fileInfo);

      return {
        success: true,
        fileId,
        fileUrl: s3Response.Location,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        metadata: fileInfo,
        data: fileInfo  // For frontend compatibility
      };
      
    } catch (error) {
      console.error('❌ Bank slip upload failed!');
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        name: error.name
      });
      
      if (error.code === 'AccessControlListNotSupported') {
        throw new Error('S3 Block Public Access is enabled. Please disable it in AWS Console.');
      }
      
      if (error.code === 'NoSuchBucket') {
        throw new Error(`Bucket "${this.bucketName}" does not exist`);
      }
      
      if (error.code === 'AccessDenied') {
        throw new Error('Access denied to S3 bucket. Check IAM permissions.');
      }
      
      throw new Error(`Bank slip upload failed: ${error.message}`);
    }
  }

  // Helper method to validate file
  validateFile(file) {
    if (!file || !file.buffer || !file.originalname) {
      throw new Error('Invalid file object');
    }
    
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} is not allowed`);
    }
  }

// Helper method to get file extension
  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  // ⭐ NEW METHOD: Verify Object ACL
  async verifyObjectACL(s3Key) {
    try {
      const aclParams = {
        Bucket: this.bucketName,
        Key: s3Key
      };
      
      const acl = await this.s3.getObjectAcl(aclParams).promise();
      
      acl.Grants.forEach((grant, index) => {;
      });
      
      // Check for public read grant
      const hasPublicRead = acl.Grants.some(grant => 
        grant.Grantee.Type === 'Group' && 
        grant.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers' &&
        grant.Permission === 'READ'
      );
      
      if (hasPublicRead) {
        console.log('✅ Object has public-read ACL');
      } else {
        console.log('❌ Object does NOT have public-read ACL');
        console.log('This could be due to:');
        console.log('1. S3 Block Public Access is enabled');
        console.log('2. Bucket policy overrides ACL');
        console.log('3. IAM user lacks s3:PutObjectAcl permission');
      }
      
      return hasPublicRead;
    } catch (error) {
      console.error('Failed to get object ACL:', error.message);
      return false;
    }
  }

  // ⭐ NEW METHOD: Test Public Access
  async testPublicAccess(fileUrl) {
    try {
      console.log('\nTesting public access to:', fileUrl);
      
      // Using fetch or axios to test
      const response = await fetch(fileUrl, { method: 'HEAD' });
      
      if (response.ok) {
        console.log('✅ File is publicly accessible!');
        console.log('Status:', response.status);
        console.log('Content-Type:', response.headers.get('content-type'));
        console.log('Content-Length:', response.headers.get('content-length'));
      } else {
        console.log('❌ File is NOT publicly accessible');
        console.log('Status:', response.status);
      }
    } catch (error) {
      console.log('❌ Cannot access file:', error.message);
    }
  }
  async uploadMultipleFiles(files, metadataList) {
    const uploadPromises = files.map((file, index) => 
      this.uploadFile(file, metadataList[index] || {})
    );

    return Promise.all(uploadPromises);
  }

  async getFileInfo(fileId) {
    // Retrieve from database (implement your DB logic)
    const fileInfo = await this.getFileMetadata(fileId);
    
    if (!fileInfo) {
      throw new Error(`File with ID ${fileId} not found`);
    }

    return fileInfo;
  }

  async downloadFile(fileId) {
    const fileInfo = await this.getFileInfo(fileId);
    
    const params = {
      Bucket: this.bucketName,
      Key: fileInfo.fileName
    };

    const stream = this.s3.getObject(params).createReadStream();
    
    return { stream, fileInfo };
  }

  async updateFileMetadata(fileId, metadata) {
    // Update in database (implement your DB logic)
    const updatedFileInfo = await this.updateFileMetadataInDB(fileId, metadata);
    
    return updatedFileInfo;
  }

  async deleteFile(fileId) {
    const fileInfo = await this.getFileInfo(fileId);
    
    // Delete from S3
    const params = {
      Bucket: this.bucketName,
      Key: fileInfo.fileName
    };

    await this.s3.deleteObject(params).promise();
    
    // Delete from database (implement your DB logic)
    await this.deleteFileMetadata(fileId);
  }

  async listFiles(params) {
    // Query database with pagination (implement your DB logic)
    const { page, limit, context, uploaderId } = params;
    const offset = (page - 1) * limit;

    // This is a mock - implement with your actual database
    const files = await this.queryFilesFromDB({ offset, limit, context, uploaderId });
    const total = await this.countFilesFromDB({ context, uploaderId });

    return {
      files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    };
  }

  validateFile(file) {
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} is not allowed`);
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size ${file.size} exceeds maximum allowed size of ${this.MAX_FILE_SIZE}`);
    }
  }

  getFileExtension(filename) {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
  }

  // Database methods (implement according to your database)
  async saveFileMetadata(fileInfo) {
    // Implement database save logic
    // Example with MongoDB:
    // await FileModel.create(fileInfo);
    console.log('Saving file metadata:', fileInfo.fileId);
  }

  async getFileMetadata(fileId) {
    return null; // Replace with actual implementation
  }

  async updateFileMetadataInDB(fileId, metadata) {
    // Implement database update logic
    throw new Error('Not implemented');
  }

  async deleteFileMetadata(fileId) {
    // Implement database delete logic
    console.log('Deleting file metadata for:', fileId);
  }

  async queryFilesFromDB(query) {
    // Implement database query logic
    return [];
  }

  async countFilesFromDB(query) {
    // Implement database count logic
    return 0;
  }
}

module.exports = FileService;