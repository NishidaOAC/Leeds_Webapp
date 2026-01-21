const FileService = require('./file.service');

class FileController {
  constructor() {
    this.fileService = new FileService();
  }

  uploadFile = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file provided' 
        });
      }
      
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
      
      // Call the file service
      const result = await this.fileService.uploadFile(req.file, metadata);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'File uploaded successfully'
      });
      
    } catch (error) {
      next(error);
    }
  }

  uploadBankSlip = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file uploaded' 
        });
      }
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
      
      const result = await this.fileService.uploadBankSlip(req.file, metadata);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Bank slip uploaded successfully'
      });
      
    } catch (error) {
      next(error);
    }
  };

  deleteUploaded =  async (req, res) => {
    let id = req.query.id;
    let index = req.query.index;
    let fileKey;
    let t;

    try {
      t = await sequelize.transaction();

      let result = await PerformaInvoice.findByPk(id, { transaction: t });

      if (!result || !result.url || !result.url[index]) {
        return res.send('File or index not found' );
      }

      fileKey = result.url[index].url;
      result.url.splice(index, 1); 

      result.setDataValue('url', result.url);
      result.changed('url', true);

      await result.save({ transaction: t });

      await t.commit();

      result = await PerformaInvoice.findByPk(id);

      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey.replace('https://approval-management-data-s3.s3.ap-south-1.amazonaws.com/', '')
      };

      await s3.deleteObject(deleteParams).promise();

      res.send({ message: 'File deleted successfully' });
    } catch (error) {
      if (t) await t.rollback();

      res.send( error.message );
    }
  }

  deleteByUrl = async (req, res) => {
    const { key } = req.query;
    try {
      if (!key) {
        return res.status(400).json({ 
          success: false, 
          message: 'File key is required' 
        });
      }

      const result = await this.fileService.deleteFileByKey(key);
      
      res.json(result);
      
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

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