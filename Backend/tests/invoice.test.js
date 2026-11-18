const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

// Load invoice environment
require('dotenv').config({ path: require('path').resolve(__dirname, '../invoice-service/.env') });

const { authenticateToken: invoiceAuth } = require('../invoice-service/middleware/authToken');
const { getPrivateKey } = require('../auth-service/utils/keyUtils');

describe('Invoice Service - Financial & Calculation Logic', () => {
  function calculateInvoiceTotals(items, taxRate = 0.18, discount = 0) {
    if (!Array.isArray(items) || items.length === 0) {
      return { subtotal: 0, tax: 0, discount: 0, total: 0 };
    }

    const subtotal = items.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      return sum + (qty * price);
    }, 0);

    const discountAmount = Number(discount) || 0;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = Math.round(taxableAmount * taxRate * 100) / 100;
    const total = Math.round((taxableAmount + tax) * 100) / 100;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax,
      discount: discountAmount,
      total
    };
  }

  it('should accurately calculate subtotal for multiple line items', () => {
    const items = [
      { description: 'Engine Turbine Component', quantity: 2, unitPrice: 1500.50 },
      { description: 'Hydraulic Seal Kit', quantity: 5, unitPrice: 200.00 }
    ];
    const result = calculateInvoiceTotals(items, 0, 0);
    // (2 * 1500.50) + (5 * 200.00) = 3001.00 + 1000.00 = 4001.00
    assert.strictEqual(result.subtotal, 4001.00);
    assert.strictEqual(result.total, 4001.00);
  });

  it('should apply 18% tax accurately', () => {
    const items = [
      { description: 'Avionics Calibration Service', quantity: 1, unitPrice: 10000.00 }
    ];
    const result = calculateInvoiceTotals(items, 0.18, 0);
    assert.strictEqual(result.subtotal, 10000.00);
    assert.strictEqual(result.tax, 1800.00);
    assert.strictEqual(result.total, 11800.00);
  });

  it('should apply discount before tax computation', () => {
    const items = [
      { description: 'Avionics Unit', quantity: 1, unitPrice: 1000.00 }
    ];
    const result = calculateInvoiceTotals(items, 0.10, 100.00); // 10% tax on 900
    assert.strictEqual(result.subtotal, 1000.00);
    assert.strictEqual(result.discount, 100.00);
    assert.strictEqual(result.tax, 90.00);
    assert.strictEqual(result.total, 990.00);
  });

  it('should return zero totals for empty item list', () => {
    const result = calculateInvoiceTotals([]);
    assert.strictEqual(result.subtotal, 0);
    assert.strictEqual(result.tax, 0);
    assert.strictEqual(result.total, 0);
  });
});

describe('Invoice Service - Status Workflow State Machine', () => {
  const VALID_STATUSES = ['Draft', 'Generated', 'Under Review', 'Approved', 'Rejected', 'Paid'];

  const ALLOWED_TRANSITIONS = {
    'Draft': ['Generated', 'Cancelled'],
    'Generated': ['Under Review', 'Approved', 'Rejected'],
    'Under Review': ['Approved', 'Rejected'],
    'Approved': ['Paid', 'Cancelled'],
    'Rejected': ['Draft', 'Under Review'],
    'Paid': []
  };

  function canTransition(currentStatus, nextStatus) {
    if (!VALID_STATUSES.includes(currentStatus) || !VALID_STATUSES.includes(nextStatus)) {
      return false;
    }
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    return allowed.includes(nextStatus);
  }

  it('should allow valid transition from Generated to Approved', () => {
    assert.strictEqual(canTransition('Generated', 'Approved'), true);
  });

  it('should allow valid transition from Generated to Under Review', () => {
    assert.strictEqual(canTransition('Generated', 'Under Review'), true);
  });

  it('should allow transition from Approved to Paid', () => {
    assert.strictEqual(canTransition('Approved', 'Paid'), true);
  });

  it('should prevent invalid transition from Paid back to Draft', () => {
    assert.strictEqual(canTransition('Paid', 'Draft'), false);
  });

  it('should reject transitions from unrecognized status strings', () => {
    assert.strictEqual(canTransition('NonExistentStatus', 'Approved'), false);
  });
});

describe('Invoice Service - RS256 Authentication Middleware', () => {
  it('should verify RS256 token and hydrate user context with designation details', async () => {
    const privateKey = getPrivateKey();
    const token = jwt.sign(
      {
        id: 55,
        userId: 55,
        email: 'finance.lead@leeds.com',
        name: 'Finance Controller',
        empNo: 'EMP-055',
        roleId: 4,
        roleName: 'Finance Manager',
        power: 'FinanceAdmin',
        role: {
          id: 4,
          roleName: 'Finance Manager',
          abbreviation: 'FM',
          power: 'FinanceAdmin'
        }
      },
      privateKey,
      { algorithm: 'RS256', expiresIn: '2h' }
    );

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    let nextCalled = false;

    await invoiceAuth(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.user.id, 55);
    assert.strictEqual(req.user.name, 'Finance Controller');
    assert.strictEqual(req.user.roleName, 'Finance Manager');
    assert.strictEqual(req.user.role.abbreviation, 'FM');
    assert.strictEqual(req.user.power, 'FinanceAdmin');
  });

  it('should return 401 when Authorization header is absent', async () => {
    const req = { headers: {} };
    let statusCode = null;
    let resJson = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: (d) => { resJson = d; } };
      }
    };
    let nextCalled = false;

    await invoiceAuth(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusCode, 401);
    assert.strictEqual(resJson.success, false);
    assert.strictEqual(resJson.message, 'Access token required');
    assert.strictEqual(nextCalled, false);
  });
});

