// file-service/index.js
require('dotenv').config({ path: require('path').join(__dirname, '.env'), override: true });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');

const { sequelize, testConnection } = require('./config/database');
const { publishEvent } = require('./utils/eventPublisher');

// Initialize Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/file-service.log' })
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

// Request logging
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
const paymentRoutes = require('./file.routes');
app.use('/', paymentRoutes);

// Health check
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    service: 'file-service',
    status: 'running',
    timestamp: new Date().toISOString(),
    database: dbStatus ? 'connected' : 'disconnected',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Global error handler
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
const PORT = process.env.PORT || 3003;

async function startServer() {
  try {
    app.listen(PORT, () => {
      logger.info(`File Service running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    });

    // Test DB connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.warn('Database connection failed. Server is running, but database operations will fail until PostgreSQL is running.');
    } else {
      // Sync database models
      await sequelize.sync({ alter: true });
      logger.info('Database models synchronized');
    }

    // Notify service started
    await publishEvent('SERVICE_STARTED', { service: 'file-service' });

  } catch (error) {
    logger.error('Error during startup:', error);
  }
}

// Graceful shutdown
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
