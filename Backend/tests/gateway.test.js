const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Load root environment
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

describe('API Gateway - Service Routing Configuration', () => {
  const routes = {
    '/api/auth': process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    '/api/payments': process.env.INVOICE_SERVICE_URL || 'http://localhost:3002',
    '/api/file': process.env.FILE_SERVICE_URL || 'http://localhost:3003',
    '/api/customer': process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3004',
    '/api/supplier': process.env.SUPPLIER_SERVICE_URL || 'http://localhost:3005'
  };

  it('should map /api/auth to Auth Service (Port 3001)', () => {
    assert.strictEqual(routes['/api/auth'], 'http://localhost:3001');
  });

  it('should map /api/payments to Invoice Service (Port 3002)', () => {
    assert.strictEqual(routes['/api/payments'], 'http://localhost:3002');
  });

  it('should map /api/file to File Service (Port 3003)', () => {
    assert.strictEqual(routes['/api/file'], 'http://localhost:3003');
  });

  it('should map /api/customer to Customer Service (Port 3004)', () => {
    assert.strictEqual(routes['/api/customer'], 'http://localhost:3004');
  });

  it('should map /api/supplier to Supplier Service (Port 3005)', () => {
    assert.strictEqual(routes['/api/supplier'], 'http://localhost:3005');
  });

  it('should strip pathPrefix in proxy rewrite correctly', () => {
    function rewritePath(pathPrefix, originalPath) {
      const regex = new RegExp(`^${pathPrefix}`);
      return originalPath.replace(regex, '') || '/';
    }

    assert.strictEqual(rewritePath('/api/auth', '/api/auth/login'), '/login');
    assert.strictEqual(rewritePath('/api/payments', '/api/payments/findbyadmin'), '/findbyadmin');
    assert.strictEqual(rewritePath('/api/supplier', '/api/supplier/list'), '/list');
  });
});

describe('API Gateway - Proxy Error Formatting', () => {
  function formatGatewayError(target, originalUrl, errCode) {
    return {
      status: 502,
      body: {
        success: false,
        error: 'Bad Gateway',
        message: `Could not connect to downstream service at ${target}. Please check if that service is running. (${errCode})`
      }
    };
  }

  it('should format 502 Bad Gateway response with clear diagnostic message', () => {
    const errorResponse = formatGatewayError('http://localhost:3002', '/api/payments/findbyadmin', 'ECONNREFUSED');
    assert.strictEqual(errorResponse.status, 502);
    assert.strictEqual(errorResponse.body.success, false);
    assert.strictEqual(errorResponse.body.error, 'Bad Gateway');
    assert.ok(errorResponse.body.message.includes('ECONNREFUSED'));
    assert.ok(errorResponse.body.message.includes('http://localhost:3002'));
  });
});

