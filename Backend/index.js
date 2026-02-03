require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const { initScheduler } = require('./scheduler/backupTask');

const app = express();
app.use(cors({ origin: '*' }));
const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const INVOICE_URL = process.env.INVOICE_SERVICE_URL || 'http://localhost:3002';
const FILE_URL = process.env.FILE_SERVICE_URL || 'http://localhost:3003';
app.use((req, res, next) => {
  next();
});
app.use('/api/auth', createProxyMiddleware({ target: AUTH_URL,  changeOrigin: true,
    pathRewrite: {
      '^/api/auth': ''   // 🔥 REQUIRED
    }, timeout: 30000, proxyTimeout: 30000
  })
);
app.use('/api/payments', createProxyMiddleware({ target: INVOICE_URL,  changeOrigin: true,
    pathRewrite: {
      '^/api/payments': ''   // 🔥 REQUIRED
    }, timeout: 30000, proxyTimeout: 30000
  })
);
app.use('/api/file', createProxyMiddleware({ target: FILE_URL,  changeOrigin: true,
    pathRewrite: {
      '^/api/file': ''   // 🔥 REQUIRED
    }, timeout: 30000, proxyTimeout: 30000
  })
);

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
