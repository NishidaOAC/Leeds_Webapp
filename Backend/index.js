require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const { initScheduler } = require('./scheduler/backupTask');

const app = express();

// Allow local development and production origins with credentials
app.use(cors({ 
  origin: (origin, callback) => callback(null, true), 
  credentials: true 
}));

const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const INVOICE_URL = process.env.INVOICE_SERVICE_URL || 'http://localhost:3002';
const FILE_URL = process.env.FILE_SERVICE_URL || 'http://localhost:3003';
const CUSTOMER_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3004';
const SUPPLIER_URL = process.env.SUPPLIER_SERVICE_URL || 'http://localhost:3005';

const createServiceProxy = (target, pathPrefix) => createProxyMiddleware({
  target,
  changeOrigin: true,
  pathRewrite: {
    [`^${pathPrefix}`]: ''
  },
  timeout: 30000,
  proxyTimeout: 30000,
  on: {
    error: (err, req, res) => {
      console.error(`❌ [API Gateway] Failed to reach ${target} for ${req.method} ${req.originalUrl || req.url}: ${err.code || err.message}`);
      if (!res.headersSent) {
        res.status(502).json({
          success: false,
          error: 'Bad Gateway',
          message: `Could not connect to downstream service at ${target}. Please check if that service is running. (${err.code || err.message})`
        });
      }
    }
  }
});

app.use('/api/auth', createServiceProxy(AUTH_URL, '/api/auth'));
app.use('/api/payments', createServiceProxy(INVOICE_URL, '/api/payments'));
app.use('/api/file', createServiceProxy(FILE_URL, '/api/file'));
app.use('/api/customer', createServiceProxy(CUSTOMER_URL, '/api/customer'));
app.use('/api/supplier', createServiceProxy(SUPPLIER_URL, '/api/supplier'));

// Direct download-proxy alias routing to file-service
app.get('/api/download-proxy', (req, res) => {
  const { url, filename } = req.query;
  const targetUrl = `/api/file/proxy-download?url=${encodeURIComponent(url || '')}&filename=${encodeURIComponent(filename || '')}`;
  res.redirect(targetUrl);
});

/**
 * ✅ Body parsing ONLY for non-proxied routes
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health & test routes
 */
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is running' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API Gateway is working!' });
});

const PORT = process.env.PORT || 3000;
initScheduler();
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running at http://localhost:${PORT}`);
});
