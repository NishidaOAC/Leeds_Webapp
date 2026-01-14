class ValidationMiddleware {
  validateFileUpload = (req, res, next) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    // Validate file size
    if (req.file.size > 10 * 1024 * 1024) {
      res.status(400).json({ error: 'File size exceeds 10MB limit' });
      return;
    }

    // Validate required metadata
    if (req.body.context && typeof req.body.context !== 'string') {
      res.status(400).json({ error: 'Context must be a string' });
      return;
    }

    next();
  }

  validateMultipleFiles = (req, res, next) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ error: 'No files provided' });
      return;
    }

    if (req.files.length > 10) {
      res.status(400).json({ error: 'Maximum 10 files allowed' });
      return;
    }

    next();
  }
}

module.exports = new ValidationMiddleware();