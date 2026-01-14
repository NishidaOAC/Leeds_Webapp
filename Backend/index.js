require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());
app.use((req, res, next) => {
  console.log('GATEWAY HIT:', req.method, req.url);
  next();
});
app.use('/api/auth', createProxyMiddleware({ target: 'http://localhost:3001',  changeOrigin: true,
    pathRewrite: {
      '^/api/auth': ''   // 🔥 REQUIRED
    }, timeout: 30000, proxyTimeout: 30000
  })
);
app.use('/api/payments', createProxyMiddleware({ target: 'http://localhost:3005',  changeOrigin: true,
    pathRewrite: {
      '^/api/payments': ''   // 🔥 REQUIRED
    }, timeout: 30000, proxyTimeout: 30000
  })
);
app.use('/api/file', createProxyMiddleware({ target: 'http://localhost:3003',  changeOrigin: true,
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
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running at http://localhost:${PORT}`);
});
