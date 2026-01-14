const FileService = require('./file.service');

class FileController {
  constructor() {
    this.fileService = new FileService();
  }

  uploadFile = async (req, res, next) => {
    console.log("uploading...............");
    
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file provided' 
        });
      }
      
      console.log('File received:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      
      // Parse metadata safely
      let customMetadata = {};
      try {
        if (req.body.metadata) {
          customMetadata = JSON.parse(req.body.metadata);
        }
      } catch (parseError) {
        console.warn('Failed to parse metadata:', parseError);
      }
      
      const metadata = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploaderId: req.body.uploaderId || 'anonymous',
        context: req.body.context || 'general',
        customMetadata: customMetadata
      };
      
      console.log('Metadata:', metadata);
      
      // Call the file service
      const result = await this.fileService.uploadFile(req.file, metadata);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'File uploaded successfully'
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      next(error);
    }
  }

  uploadBankSlip = async (req, res, next) => {
    console.log("Uploading bank slip...............");
    
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file uploaded' 
        });
      }
      
      console.log('Bank slip received:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      
      // Parse metadata safely
      let customMetadata = {};
      try {
        if (req.body.metadata) {
          customMetadata = JSON.parse(req.body.metadata);
        }
      } catch (parseError) {
        console.warn('Failed to parse metadata:', parseError);
      }
      
      const metadata = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploaderId: req.body.uploaderId || req.user?.id || 'anonymous',
        context: 'bank_slip',
        customMetadata: customMetadata,
        // Additional bank slip specific metadata
        transactionId: req.body.transactionId,
        paymentDate: req.body.paymentDate,
        amount: req.body.amount,
        referenceNumber: req.body.referenceNumber
      };
      
      console.log('Bank slip metadata:', metadata);
      
      // Call your file service
      const result = await this.fileService.uploadBankSlip(req.file, metadata);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Bank slip uploaded successfully'
      });
      
    } catch (error) {
      console.error('Bank slip upload error:', error);
      next(error);
    }
  };

  uploadMultipleFiles = async (req, res, next) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({ error: 'No files provided' });
        return;
      }

      const metadataList = req.files.map((file, index) => ({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        uploaderId: req.body.uploaderId || req.body[`uploaderId_${index}`],
        context: req.body.context || req.body[`context_${index}`],
        index
      }));

      const results = await this.fileService.uploadMultipleFiles(req.files, metadataList);

      res.status(201).json({
        success: true,
        data: results,
        message: `${results.length} files uploaded successfully`
      });
    } catch (error) {
      next(error);
    }
  }

  getFileInfo = async (req, res, next) => {
    try {
      const { fileId } = req.params;
      const fileInfo = await this.fileService.getFileInfo(fileId);
      
      res.status(200).json({
        success: true,
        data: fileInfo
      });
    } catch (error) {
      next(error);
    }
  }

  downloadFile = async (req, res, next) => {
    try {
      const { fileId } = req.params;
      const { stream, fileInfo } = await this.fileService.downloadFile(fileId);

      // Set headers for download
      res.setHeader('Content-Type', fileInfo.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.originalName}"`);
      res.setHeader('Content-Length', fileInfo.size);

      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  updateFileMetadata = async (req, res, next) => {
    try {
      const { fileId } = req.params;
      const metadata = req.body;
      
      const updatedFile = await this.fileService.updateFileMetadata(fileId, metadata);
      
      res.status(200).json({
        success: true,
        data: updatedFile,
        message: 'File metadata updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  deleteFile = async (req, res, next) => {
    try {
      const { fileId } = req.params;
      
      await this.fileService.deleteFile(fileId);
      
      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  listFiles = async (req, res, next) => {
    try {
      const { 
        page = '1', 
        limit = '10', 
        context, 
        uploaderId 
      } = req.query;
      
      const result = await this.fileService.listFiles({
        page: parseInt(page),
        limit: parseInt(limit),
        context: context,
        uploaderId: uploaderId
      });

      res.status(200).json({
        success: true,
        data: result.files,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FileController;