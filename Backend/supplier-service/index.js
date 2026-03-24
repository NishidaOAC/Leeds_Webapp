require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');

const { sequelize, testConnection } = require('./config/database');
const { publishEvent } = require('./utils/eventPublisher');
const supplierRoutes = require('./routes/supplier.routes');

// IMPORT YOUR MODEL HERE
const OnboardingStatus = require('./models/OnboardingStatus'); 

// Initialize logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/supplier-service.log' })
  ]
});

const app = express();

// --- 1. BODY PARSING LIMITS (Set once here) ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- 2. SECURITY & CORS ---
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// --- 3. REQUEST LOGGING ---
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, ip: req.ip });
  next();
});

// --- 4. ROUTES ---
app.use('/', supplierRoutes);

// Health check
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    service: 'supplier-service',
    status: 'running',
    database: dbStatus ? 'connected' : 'disconnected'
  });
});

// --- 5. ERROR HANDLING ---
app.use((err, req, res, next) => {
  logger.error({ error: err.message, stack: err.stack });
  res.status(err.status || 500).json({ success: false, message: err.message });
});

// Start server logic
const PORT = process.env.PORT || 3003;

async function startServer() {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Database connection failed. Exiting...');
      process.exit(1);
    }

    const dbSyncMode = process.env.DB_SYNC;

    if (dbSyncMode === 'force') {
      logger.warn('⚠️ FORCE syncing database');
      await sequelize.sync({ force: true });
    } 
    else if (dbSyncMode === 'alter') {
      logger.info('Altering database schema');
      await sequelize.sync({ alter: true });
    } 

    // Seed the data
    logger.info('Checking for Onboarding Status data...');
    await OnboardingStatus.seed(); 

    logger.info('Supplier Service Database synchronization & seeding completed');

    await publishEvent('SERVICE_STARTED', { service: 'supplier-service' });

    app.listen(PORT, () => {
      logger.info(`Supplier service running on port ${PORT}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();