const multer = require('multer');

// Detect file signature / magic bytes without external ESM dependency
const detectFileType = (buffer) => {
  if (!buffer || buffer.length < 4) return null;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { mime: 'image/jpeg' };
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return { mime: 'image/png' };
  }
  // PDF: 25 50 44 46 (%PDF)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return { mime: 'application/pdf' };
  }
  return null;
};

// 1. Configure Multer Memory Storage
const storage = multer.memoryStorage();

// 2. Strict Extension & MIME Validation Filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'text/plain'
  ];

  // Extension Check (Strict Regex)
  const allowedExtensions = /\.(jpg|jpeg|png|pdf|txt)$/i;
  const hasValidExt = allowedExtensions.test(file.originalname);

  if (allowedMimeTypes.includes(file.mimetype) && hasValidExt) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type or extension. Only JPEG, PNG, PDF, and TXT are allowed.'));
  }
};

// 3. Multer Instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  }
});

// 4. Custom Middleware for Magic Byte Checking (Buffer/Content Inspection)
const validateMagicBytes = async (req, res, next) => {
  try {
    if (!req.file && !req.files) return next();

    const filesToValidate = req.files || [req.file];

    for (const file of filesToValidate) {
      if (!file.buffer) continue;

      // Real File Signature / Magic Bytes Detection
      const detected = detectFileType(file.buffer);

      // TXT files have no magic bytes, handle plain text validation
      if (!detected) {
        if (file.mimetype === 'text/plain' && file.originalname.endsWith('.txt')) {
          continue; 
        }
        return res.status(400).json({
          success: false,
          error: `Security Alert: File '${file.originalname}' content format could not be verified.`
        });
      }

      const allowedDetectedMimes = ['image/jpeg', 'image/png', 'application/pdf'];

      if (!allowedDetectedMimes.includes(detected.mime)) {
        return res.status(400).json({
          success: false,
          error: `Security Alert: File spoofing detected for '${file.originalname}'. Extension does not match actual content!`
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  validateMagicBytes,
  detectFileType,
  fileFilter
};
