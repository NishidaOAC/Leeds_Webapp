const { Router } = require('express');
const FileController = require('./file.controller');
const uploadMiddleware = require('./upload.middleware');
const validationMiddleware = require('./validation.middleware');

const router = Router();
const fileController = new FileController();

// File upload routes (with Double-Layer Magic Byte & MIME Validation)
router.post(
  '/upload',
  uploadMiddleware.upload.single('file'),
  uploadMiddleware.validateMagicBytes,
  validationMiddleware.validateFileUpload,
  fileController.uploadFile
);

router.post(
  '/bankslipupload',
  uploadMiddleware.upload.single('file'),
  uploadMiddleware.validateMagicBytes,
  validationMiddleware.validateFileUpload,
  fileController.uploadBankSlip
);

router.post(
  '/upload-multiple',
  uploadMiddleware.upload.array('files', 10), // Max 10 files
  uploadMiddleware.validateMagicBytes,
  validationMiddleware.validateMultipleFiles,
  fileController.uploadMultipleFiles
);

// File management & deletion routes
router.delete('/filedeletebyurl', fileController.deleteByUrl);

// File retrieval routes
router.get('/:fileId', fileController.getFileInfo);
router.get('/download/:fileId', fileController.downloadFile);

// File metadata management routes
router.put('/:fileId/metadata', fileController.updateFileMetadata);
router.delete('/:fileId', fileController.deleteFile);

// List files with pagination
router.get('/', fileController.listFiles);

module.exports = router;