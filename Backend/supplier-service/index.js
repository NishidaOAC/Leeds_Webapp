require('dotenv').config({ path: require('path').join(__dirname, '.env'), override: true });
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');

const { sequelize, testConnection } = require('./config/database');
const { publishEvent } = require('./utils/eventPublisher');
const supplierRoutes = require('./routes/supplier.routes');

const { initExpiryJob } = require('./controllers/expiryNotifier.job');
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

// --- 1. BODY PARSING LIMITS ---
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
const PORT = process.env.PORT || 3005;

async function startServer() {
  try {
    app.listen(PORT, () => {
      logger.info(`Supplier service running on port ${PORT}`);
    });

    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.warn('Database connection failed. Server is running, but database operations will fail until PostgreSQL is running.');
    } else {
      const dbSyncMode = process.env.DB_SYNC || 'alter';

      if (dbSyncMode === 'force') {
        logger.warn('⚠️ FORCE syncing database');
        await sequelize.sync({ force: true });
      } else {
        logger.info('Altering database schema');
        await sequelize.sync({ alter: true });
      } 

      try {
        logger.info('Checking for Onboarding Status data...');
        await OnboardingStatus.seed(); 
        logger.info('Supplier Service Database synchronization & seeding completed');
      } catch (seedErr) {
        logger.warn('Seeding warning:', seedErr.message);
      }
    }

    await publishEvent('SERVICE_STARTED', { service: 'supplier-service' });

    try {
      initExpiryJob();
    } catch (jobErr) {
      logger.warn('Expiry job warning:', jobErr.message);
    }

  } catch (error) {
    logger.error('Error starting server:', error);
  }
}

startServer();
