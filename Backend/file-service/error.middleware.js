const errorMiddleware = (err, req, res, next) => {
  // Handle specific error types
  if (err.name === 'MulterError') {
    if (err.message === 'File too large') {
      res.status(413).json({ 
        error: 'File too large', 
        message: 'Maximum file size is 10MB' 
      });
      return;
    }
    
    res.status(400).json({ 
      error: 'Upload error', 
      message: err.message 
    });
    return;
  }

  // Handle AWS S3 errors
  if (err.name === 'NoSuchKey') {
    res.status(404).json({ 
      error: 'File not found', 
      message: 'The requested file does not exist' 
    });
    return;
  }

  // Handle validation errors
  if (err.message.includes('Invalid file type')) {
    res.status(400).json({ 
      error: 'Invalid file type', 
      message: err.message 
    });
    return;
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

module.exports = errorMiddleware;