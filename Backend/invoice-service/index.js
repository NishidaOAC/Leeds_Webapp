// payment-service/index.js
require('dotenv').config();
require('express-async-errors');

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
    new winston.transports.File({ filename: 'logs/payment-service.log' })
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
const paymentRoutes = require('./routes/invoice.routes');
const invoiceStatusRoutes = require('./routes/invoice-status.routes');
const companyRoutes = require('./routes/company.routes');
app.use('/company', companyRoutes);
app.use('/invoice-status', invoiceStatusRoutes);
app.use('/', paymentRoutes);

// Health check
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  // Optionally check RabbitMQ connection
  res.json({
    service: 'payment-service',
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
const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    // Test DB connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.warn('Database connection failed. Starting server anyway...');
    }

    // Sync database models
    await sequelize.sync();
    logger.info('Database models synchronized');

    // Notify service started
    await publishEvent('SERVICE_STARTED', { service: 'payment-service' });

    app.listen(PORT, () => {
      logger.info(`Payment Service running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
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
