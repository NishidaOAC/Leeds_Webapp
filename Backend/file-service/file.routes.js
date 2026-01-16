const { Router } = require('express');
const FileController = require('./file.controller');
const uploadMiddleware = require('./upload.middleware');
const validationMiddleware = require('./validation.middleware');

const router = Router();
const fileController = new FileController();

// File upload routes
router.post( '/upload', uploadMiddleware.single('file'),validationMiddleware.validateFileUpload, fileController.uploadFile);


router.post('/bankslipupload', uploadMiddleware.single('file'), validationMiddleware.validateFileUpload, fileController.uploadBankSlip );

router.delete('/filedeletebyurl', fileController.deleteByUrl);

router.post(
  '/upload-multiple',
  uploadMiddleware.array('files', 10), // Max 10 files
  validationMiddleware.validateMultipleFiles,
  fileController.uploadMultipleFiles
);

// File retrieval routes
router.get('/:fileId', fileController.getFileInfo);
router.get('/download/:fileId', fileController.downloadFile);

// File management routes
router.put('/:fileId/metadata', fileController.updateFileMetadata);
router.delete('/:fileId', fileController.deleteFile);

// List files with pagination
router.get('/', fileController.listFiles);


module.exports = router;