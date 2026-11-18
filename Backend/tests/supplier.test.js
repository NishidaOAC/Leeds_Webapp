const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

// Load supplier environment
require('dotenv').config({ path: require('path').resolve(__dirname, '../supplier-service/.env') });

const authorizePower = require('../supplier-service/middlewares/authorizePower');
const { authenticateToken: supplierAuth } = require('../supplier-service/middlewares/authToken');
const { getPublicKeySync } = require('../supplier-service/utils/keyUtils');
const { getPrivateKey } = require('../auth-service/utils/keyUtils');

describe('Supplier Service - authorizePower Middleware', () => {
  it('should return 401 if user is not authenticated (req.user is undefined)', () => {
    const middleware = authorizePower('QualityAdmin');
    const req = {};
    let statusCode = null;
    let resData = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: (d) => { resData = d; } };
      }
    };
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusCode, 401);
    assert.strictEqual(resData.success, false);
    assert.strictEqual(resData.message, 'Authentication required');
    assert.strictEqual(nextCalled, false);
  });

  it('should allow access when user power matches allowed power', () => {
    const middleware = authorizePower('QualityAdmin');
    const req = { user: { power: 'QualityAdmin', roleName: 'Quality Lead' } };
    let nextCalled = false;
    const res = {};

    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
  });

  it('should allow access with case-insensitive power match', () => {
    const middleware = authorizePower('QualityAdmin');
    const req = { user: { power: 'qualityadmin', roleName: 'Quality Lead' } };
    let nextCalled = false;
    const res = {};

    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
  });

  it('should allow access if user has Admin power regardless of requested power', () => {
    const middleware = authorizePower('QualityAdmin');
    const req = { user: { power: 'Admin', roleName: 'System Admin' } };
    let nextCalled = false;
    const res = {};

    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
  });

  it('should deny access (403) when user has insufficient privileges', () => {
    const middleware = authorizePower('QualityAdmin', 'SuperAdmin');
    const req = { user: { power: 'BasicUser', roleName: 'Viewer' } };
    let statusCode = null;
    let resData = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: (d) => { resData = d; } };
      }
    };
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusCode, 403);
    assert.strictEqual(resData.success, false);
    assert.ok(resData.message.includes('Access Denied'));
    assert.strictEqual(nextCalled, false);
  });
});

describe('Supplier Service - Expiry & Status Computation Logic', () => {
  function computeSupplierStatus(expiryDateStr) {
    if (!expiryDateStr) return 'NO_EXPIRY';
    const now = new Date();
    const expiry = new Date(expiryDateStr);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'EXPIRED';
    if (diffDays <= 30) return 'EXPIRING_SOON';
    return 'ACTIVE';
  }

  it('should classify past expiry dates as EXPIRED', () => {
    const pastDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    assert.strictEqual(computeSupplierStatus(pastDate), 'EXPIRED');
  });

  it('should classify dates within 30 days as EXPIRING_SOON', () => {
    const soonDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    assert.strictEqual(computeSupplierStatus(soonDate), 'EXPIRING_SOON');
  });

  it('should classify dates beyond 30 days as ACTIVE', () => {
    const activeDate = new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    assert.strictEqual(computeSupplierStatus(activeDate), 'ACTIVE');
  });
});

describe('Supplier Service - Token Authentication Middleware', () => {
  it('should hydrate req.user directly from RS256 token payload without network calls', async () => {
    const privateKey = getPrivateKey();
    const token = jwt.sign(
      {
        id: 77,
        userId: 77,
        email: 'supplier.manager@leeds.com',
        name: 'Jane Smith',
        empNo: 'EMP-077',
        roleId: 3,
        power: 'QualityAdmin',
        roleName: 'Quality Specialist'
      },
      privateKey,
      { algorithm: 'RS256', expiresIn: '1h' }
    );

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    let nextCalled = false;

    await supplierAuth(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.user.id, 77);
    assert.strictEqual(req.user.email, 'supplier.manager@leeds.com');
    assert.strictEqual(req.user.power, 'QualityAdmin');
    assert.strictEqual(req.user.roleName, 'Quality Specialist');
  });
});

