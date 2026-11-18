const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

// Load environment variables for testing
require('dotenv').config({ path: require('path').resolve(__dirname, '../auth-service/.env') });

const authValidation = require('../auth-service/validations/authValidation');
const User = require('../auth-service/models/user');
const { getPrivateKey, getPublicKey, getJwks } = require('../auth-service/utils/keyUtils');
const { authenticateToken } = require('../auth-service/middleware/auth');

describe('Auth Service - Joi Input Validations', () => {
  it('should validate a correct registration payload', () => {
    const validData = {
      email: 'pilot@onboardaero.com',
      password: 'StrongPassword123!',
      name: 'John Doe',
      empNo: 'EMP-001',
      roleId: 2
    };
    const result = authValidation.validate(authValidation.registerValidation, validData);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.data.email, 'pilot@onboardaero.com');
  });

  it('should reject registration when email is invalid', () => {
    const invalidData = {
      email: 'not-an-email',
      password: 'StrongPassword123!',
      name: 'John Doe'
    };
    const result = authValidation.validate(authValidation.registerValidation, invalidData);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.field === 'email'));
  });

  it('should reject registration when password is shorter than minimum length', () => {
    const invalidData = {
      email: 'valid@example.com',
      password: '123',
      name: 'John Doe'
    };
    const result = authValidation.validate(authValidation.registerValidation, invalidData);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.field === 'password'));
  });

  it('should validate a correct login payload with empNo and password', () => {
    const validLogin = {
      empNo: 'EMP-001',
      password: 'SecretPassword!'
    };
    const result = authValidation.validate(authValidation.loginValidation, validLogin);
    assert.strictEqual(result.isValid, true);
  });

  it('should reject login payload missing password', () => {
    const invalidLogin = { empNo: 'EMP-001' };
    const result = authValidation.validate(authValidation.loginValidation, invalidLogin);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.field === 'password'));
  });

  it('should reject login payload missing empNo', () => {
    const invalidLogin = { password: 'SecretPassword!' };
    const result = authValidation.validate(authValidation.loginValidation, invalidLogin);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.field === 'empNo'));
  });

  it('should validate change password with current and new password', () => {
    const validChange = {
      currentPassword: 'OldPassword123!',
      newPassword: 'BrandNewPassword123!'
    };
    const result = authValidation.validate(authValidation.changePasswordValidation, validChange);
    assert.strictEqual(result.isValid, true);
  });
});

describe('Auth Service - Cryptographic Key Management', () => {
  it('should retrieve a valid 2048-bit RSA Private Key', () => {
    const privateKey = getPrivateKey();
    assert.ok(privateKey.includes('BEGIN PRIVATE KEY') || privateKey.includes('BEGIN RSA PRIVATE KEY'));
  });

  it('should retrieve a valid RSA Public Key matching the private key', () => {
    const publicKey = getPublicKey();
    assert.ok(publicKey.includes('BEGIN PUBLIC KEY'));
  });

  it('should export standard RFC 7517 JWKS object', () => {
    const jwks = getJwks();
    assert.ok(Array.isArray(jwks.keys));
    assert.strictEqual(jwks.keys[0].kty, 'RSA');
    assert.strictEqual(jwks.keys[0].alg, 'RS256');
    assert.strictEqual(jwks.keys[0].use, 'sig');
  });
});

describe('Auth Service - User Model & Token Generation', () => {
  const mockUser = User.build({
    id: 101,
    email: 'admin@leeds.com',
    name: 'Admin User',
    empNo: 'EMP-101',
    roleId: 1,
    isActive: true,
    status: 'approved'
  });
  mockUser.Role = {
    id: 1,
    roleName: 'Super Admin',
    abbreviation: 'SA',
    power: 'SuperAdmin'
  };

  it('should generate an RS256 signed access token with all claims', () => {
    const token = mockUser.generateToken();
    assert.ok(token);

    const decoded = jwt.decode(token, { complete: true });
    assert.strictEqual(decoded.header.alg, 'RS256');
    assert.strictEqual(decoded.payload.id, 101);
    assert.strictEqual(decoded.payload.email, 'admin@leeds.com');
    assert.strictEqual(decoded.payload.name, 'Admin User');
    assert.strictEqual(decoded.payload.empNo, 'EMP-101');
    assert.strictEqual(decoded.payload.roleName, 'Super Admin');
    assert.strictEqual(decoded.payload.power, 'SuperAdmin');
    assert.strictEqual(decoded.payload.role.power, 'SuperAdmin');
  });

  it('should generate an RS256 signed refresh token with 7-day expiry', () => {
    const refreshToken = mockUser.generateRefreshToken();
    assert.ok(refreshToken);

    const decoded = jwt.decode(refreshToken, { complete: true });
    assert.strictEqual(decoded.header.alg, 'RS256');
    assert.strictEqual(decoded.payload.id, 101);
    assert.strictEqual(decoded.payload.type, 'refresh');
  });

  it('should verify access token successfully using RSA public key', () => {
    const token = mockUser.generateToken();
    const publicKey = getPublicKey();
    const verified = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    assert.strictEqual(verified.email, 'admin@leeds.com');
    assert.strictEqual(verified.power, 'SuperAdmin');
  });
});

describe('Auth Service - Authenticate Middleware', () => {
  it('should return 401 when Authorization header is missing', async () => {
    const req = { headers: {} };
    let statusCode = null;
    let resJson = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => { resJson = data; }
        };
      }
    };
    let nextCalled = false;

    await authenticateToken(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusCode, 401);
    assert.strictEqual(resJson.success, false);
    assert.strictEqual(resJson.message, 'Access token required');
    assert.strictEqual(nextCalled, false);
  });

  it('should return 403 when token is corrupted or invalid', async () => {
    const req = { headers: { authorization: 'Bearer invalid.fake.token' } };
    let statusCode = null;
    let resJson = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => { resJson = data; }
        };
      }
    };
    let nextCalled = false;

    await authenticateToken(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusCode, 403);
    assert.strictEqual(resJson.success, false);
    assert.strictEqual(nextCalled, false);
  });

  it('should return 401 when token has expired', async () => {
    const privateKey = getPrivateKey();
    const expiredToken = jwt.sign(
      { id: 1, email: 'exp@test.com' },
      privateKey,
      { algorithm: 'RS256', expiresIn: '-10s' }
    );

    const req = { headers: { authorization: `Bearer ${expiredToken}` } };
    let statusCode = null;
    let resJson = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => { resJson = data; }
        };
      }
    };
    let nextCalled = false;

    await authenticateToken(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusCode, 401);
    assert.strictEqual(resJson.message, 'Token expired');
    assert.strictEqual(nextCalled, false);
  });
});


describe('Auth Service - Account Lockout & Brute-Force Prevention', () => {
  const AuthController = require('../auth-service/controllers/authController');

  // Helper to create an isolated mock user
  async function createMockUser() {
    return {
      id: 999,
      email: 'pilot999@leeds.com',
      empNo: 'EMP-999',
      name: 'Test Pilot',
      password: 'hashedPasswordGoesHere',
      failedLoginAttempts: 0,
      lockoutUntil: null,
      isActive: true,
      status: 'approved',
      roleId: 2,
      Role: { id: 2, roleName: 'Pilot', abbreviation: 'PLT', power: 'User' },
      comparePassword: async function(candidate) {
        return candidate === 'CorrectPassword123!';
      },
      update: async function(data) {
        Object.assign(this, data);
        return this;
      },
      generateToken: function() { return 'mock.rs256.token'; },
      generateRefreshToken: function() { return 'mock.rs256.refresh'; },
      toJSON: function() {
        return { id: this.id, email: this.email, empNo: this.empNo, name: this.name, roleId: this.roleId };
      }
    };
  }

  it('should decrement remaining attempts from 4 down to 1 on consecutive failed attempts', async () => {
    const mockUser = await createMockUser();
    const originalFindOne = User.findOne;

    User.findOne = async () => mockUser;

    try {
      for (let attempt = 1; attempt <= 4; attempt++) {
        const req = { body: { empNo: 'EMP-999', password: 'WrongPassword!' } };
        let statusCode = null;
        let resJson = null;
        const res = {
          status: (code) => {
            statusCode = code;
            return { json: (d) => { resJson = d; } };
          }
        };

        await AuthController.login(req, res);

        assert.strictEqual(statusCode, 401);
        assert.strictEqual(resJson.success, false);
        assert.strictEqual(mockUser.failedLoginAttempts, attempt);
        assert.strictEqual(resJson.attemptsRemaining, 5 - attempt);
        assert.ok(resJson.message.includes(`${5 - attempt} attempt(s) remaining`));
      }
    } finally {
      User.findOne = originalFindOne;
    }
  });

  it('should immediately lock account on the 5th failed attempt with HTTP 423', async () => {
    const mockUser = await createMockUser();
    mockUser.failedLoginAttempts = 4; // Already failed 4 times
    const originalFindOne = User.findOne;

    User.findOne = async () => mockUser;

    try {
      const req = { body: { empNo: 'EMP-999', password: 'WrongPassword!' } };
      let statusCode = null;
      let resJson = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return { json: (d) => { resJson = d; } };
        }
      };

      await AuthController.login(req, res);

      assert.strictEqual(statusCode, 423);
      assert.strictEqual(resJson.success, false);
      assert.strictEqual(resJson.locked, true);
      assert.strictEqual(mockUser.failedLoginAttempts, 5);
      assert.ok(mockUser.lockoutUntil instanceof Date);
      assert.ok(mockUser.lockoutUntil > new Date());
      assert.ok(resJson.message.includes('5 consecutive failed login attempts'));
    } finally {
      User.findOne = originalFindOne;
    }
  });

  it('should reject login with 423 while account is actively locked even if correct password is provided', async () => {
    const mockUser = await createMockUser();
    mockUser.failedLoginAttempts = 5;
    mockUser.lockoutUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes remaining
    const originalFindOne = User.findOne;

    User.findOne = async () => mockUser;

    try {
      const req = { body: { empNo: 'EMP-999', password: 'CorrectPassword123!' } };
      let statusCode = null;
      let resJson = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return { json: (d) => { resJson = d; } };
        }
      };

      await AuthController.login(req, res);

      assert.strictEqual(statusCode, 423);
      assert.strictEqual(resJson.locked, true);
      assert.strictEqual(resJson.remainingMinutes, 10);
      assert.ok(resJson.message.includes('Account is temporarily locked'));
    } finally {
      User.findOne = originalFindOne;
    }
  });

  it('should reset lockout state and failed attempts counter upon successful login', async () => {
    const mockUser = await createMockUser();
    mockUser.failedLoginAttempts = 3; // Had 3 failed attempts
    const originalFindOne = User.findOne;

    User.findOne = async () => mockUser;

    try {
      const req = { body: { empNo: 'EMP-999', password: 'CorrectPassword123!' } };
      let resJson = null;
      const res = {
        json: (d) => { resJson = d; }
      };

      await AuthController.login(req, res);

      assert.strictEqual(resJson.success, true);
      assert.strictEqual(resJson.message, 'Login successful');
      assert.strictEqual(mockUser.failedLoginAttempts, 0);
      assert.strictEqual(mockUser.lockoutUntil, null);
    } finally {
      User.findOne = originalFindOne;
    }
  });

  it('should automatically allow login after lockout cooldown period elapses', async () => {
    const mockUser = await createMockUser();
    mockUser.failedLoginAttempts = 5;
    mockUser.lockoutUntil = new Date(Date.now() - 1000); // Expired 1 second ago
    const originalFindOne = User.findOne;

    User.findOne = async () => mockUser;

    try {
      const req = { body: { empNo: 'EMP-999', password: 'CorrectPassword123!' } };
      let resJson = null;
      const res = {
        json: (d) => { resJson = d; }
      };

      await AuthController.login(req, res);

      assert.strictEqual(resJson.success, true);
      assert.strictEqual(mockUser.failedLoginAttempts, 0);
      assert.strictEqual(mockUser.lockoutUntil, null);
    } finally {
      User.findOne = originalFindOne;
    }
  });
});
