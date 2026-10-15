const multer = require('multer');
const { fileTypeFromBuffer } = require('file-type');

// 1. Configure Multer to use Memory Storage (Prevents local disk RCE & Path Traversal)
const storage = multer.memoryStorage();

// 2. Initial MIME-type & File Extension Filter (Layer 1 Security)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'text/plain'
  ];

  // Extension Check using Regex
  const allowedExtensions = /\.(jpg|jpeg|png|pdf|txt)$/i;
  const hasValidExt = allowedExtensions.test(file.originalname);

  if (allowedMimeTypes.includes(file.mimetype) && hasValidExt) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type or extension. Only JPEG, PNG, PDF, and TXT files are allowed.'
      ),
      false
    );
  }
};

// 3. Multer Instance Definition
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10 // Max 10 files per request
  }
});

// 4. Magic Bytes Inspection Middleware (Layer 2 Security - Deep Content Inspection)
const validateMagicBytes = async (req, res, next) => {
  try {
    // Check single file (req.file), array of files (req.files array), or field map (req.files object)
    let filesToValidate = [];

    if (req.file) {
      filesToValidate.push(req.file);
    } else if (Array.isArray(req.files)) {
      filesToValidate = req.files;
    } else if (req.files && typeof req.files === 'object') {
      // Flatten upload.fields() object map into a single array
      Object.keys(req.files).forEach((key) => {
        filesToValidate.push(...req.files[key]);
      });
    }

    if (filesToValidate.length === 0) {
      return next();
    }

    for (const file of filesToValidate) {
      if (!file.buffer) continue;

      // Inspect binary header bytes (Magic Bytes)
      const detected = await fileTypeFromBuffer(file.buffer);

      // Handle Plain Text (.txt) files which do not contain binary magic signatures
      if (!detected) {
        if (file.mimetype === 'text/plain' && file.originalname.toLowerCase().endsWith('.txt')) {
          continue;
        }
        return res.status(400).json({
          success: false,
          error: `Security Alert: Content signature for file '${file.originalname}' could not be verified.`
        });
      }

      const allowedDetectedMimes = [
        'image/jpeg',
        'image/png',
        'application/pdf'
      ];

      // Prevent Extension Spoofing / RCE Payload Uploads
      if (!allowedDetectedMimes.includes(detected.mime)) {
        return res.status(400).json({
          success: false,
          error: `Security Alert: File spoofing detected for '${file.originalname}'. Extension does not match actual binary content!`
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
  validateMagicBytes
};