require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const notRoutes = require('./routes/notificationRoutes');
const teamRoutes = require('./routes/teamRoutes');
const { sequelize, testConnection } = require('./config/database');
const { publishEvent } = require('./utils/eventPublisher');

// Initialize logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/auth-service.log' })
  ]
});

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Request logging middleware
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/role', roleRoutes);
app.use('/notification', notRoutes);
app.use('/team', teamRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  
  res.json({
    service: 'auth-service',
    status: 'running',
    timestamp: new Date().toISOString(),
    database: dbStatus ? 'connected' : 'disconnected',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    console.log(dbConnected);
    
    if (!dbConnected) {
      logger.warn('Database connection failed. Starting server anyway...');
    }

    // Sync database models
    // await sequelize.sync({ alter: true });
    logger.info('Database models synchronized');

    // Connect to RabbitMQ
    await publishEvent('SERVICE_STARTED', { service: 'auth-service' });
    console.log(PORT);
    
    app.listen(PORT, () => {
      logger.info(`Auth Service running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  
  try {
    await sequelize.close();
    logger.info('Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down...');
  process.exit(0);
});

startServer();