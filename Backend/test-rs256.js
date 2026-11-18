const path = require('path');
const jwt = require('jsonwebtoken');

console.log('====================================================');
console.log('   RS256 JWT MIGRATION VERIFICATION & TEST SUITE   ');
console.log('====================================================\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  try {
    // -----------------------------------------------------------------
    // TEST 1: Key Management Utility in Auth Service
    // -----------------------------------------------------------------
    console.log('[1] Testing Auth Service Key Utilities...');
    const authKeyUtils = require('./auth-service/utils/keyUtils');
    const privateKey = authKeyUtils.getPrivateKey();
    const publicKey = authKeyUtils.getPublicKey();
    const jwks = authKeyUtils.getJwks();

    assert(privateKey.includes('BEGIN PRIVATE KEY'), 'Private key loaded successfully');
    assert(publicKey.includes('BEGIN PUBLIC KEY'), 'Public key loaded successfully');
    assert(jwks.keys && jwks.keys[0].alg === 'RS256', 'JWKS generated with RS256 alg');

    // -----------------------------------------------------------------
    // TEST 2: Downstream Key Utilities (Invoice, Supplier, File, Customer)
    // -----------------------------------------------------------------
    console.log('\n[2] Testing Downstream Microservice Public Key Loaders...');
    const invoiceKeyUtils = require('./invoice-service/utils/keyUtils');
    const supplierKeyUtils = require('./supplier-service/utils/keyUtils');
    const fileKeyUtils = require('./file-service/utils/keyUtils');
    const customerKeyUtils = require('./customer-service/utils/keyUtils');

    assert(invoiceKeyUtils.getPublicKeySync().includes('BEGIN PUBLIC KEY'), 'Invoice Service loaded public key');
    assert(supplierKeyUtils.getPublicKeySync().includes('BEGIN PUBLIC KEY'), 'Supplier Service loaded public key');
    assert(fileKeyUtils.getPublicKeySync().includes('BEGIN PUBLIC KEY'), 'File Service loaded public key');
    assert(customerKeyUtils.getPublicKeySync().includes('BEGIN PUBLIC KEY'), 'Customer Service loaded public key');

    // -----------------------------------------------------------------
    // TEST 3: Token Generation via User Model Instance
    // -----------------------------------------------------------------
    console.log('\n[3] Testing RS256 Token Generation via User Model...');
    const User = require('./auth-service/models/user');
    
    // Create mock user instance with Role
    const mockUser = User.build({
      id: 42,
      email: 'pilot@onboardaero.com',
      name: 'Captain Leeds',
      empNo: 'OA-1042',
      roleId: 2,
      isActive: true,
      status: 'approved'
    });
    mockUser.Role = {
      id: 2,
      roleName: 'Operations Lead',
      abbreviation: 'OPS',
      power: 'OpsAdmin'
    };

    const accessToken = mockUser.generateToken();
    const refreshToken = mockUser.generateRefreshToken();

    assert(typeof accessToken === 'string' && accessToken.length > 100, 'Access token generated');
    assert(typeof refreshToken === 'string' && refreshToken.length > 100, 'Refresh token generated');

    // -----------------------------------------------------------------
    // TEST 4: JWT Header and Payload Claims
    // -----------------------------------------------------------------
    console.log('\n[4] Inspecting JWT Header & Embedded RS256 Claims...');
    const decodedComplete = jwt.decode(accessToken, { complete: true });
    assert(decodedComplete.header.alg === 'RS256', 'Header algorithm is RS256');
    assert(decodedComplete.header.typ === 'JWT', 'Header type is JWT');

    const p = decodedComplete.payload;
    assert(p.id === 42, `Payload id is correct (${p.id})`);
    assert(p.email === 'pilot@onboardaero.com', `Payload email is correct (${p.email})`);
    assert(p.name === 'Captain Leeds', `Payload name is correct (${p.name})`);
    assert(p.empNo === 'OA-1042', `Payload empNo is correct (${p.empNo})`);
    assert(p.roleName === 'Operations Lead', `Payload roleName is correct (${p.roleName})`);
    assert(p.power === 'OpsAdmin', `Payload power is correct (${p.power})`);
    assert(p.role && p.role.abbreviation === 'OPS', `Payload full role object present`);

    // -----------------------------------------------------------------
    // TEST 5: Downstream In-Memory Verification (Invoice Service Middleware)
    // -----------------------------------------------------------------
    console.log('\n[5] Testing Invoice Service Auth Middleware with RS256...');
    const { authenticateToken: invoiceAuth } = require('./invoice-service/middleware/authToken');
    
    let invoiceUser = null;
    let invoiceNextCalled = false;
    const mockReqInvoice = {
      headers: { authorization: `Bearer ${accessToken}` }
    };
    const mockResInvoice = {
      status: (code) => ({ json: (d) => console.error('Invoice error res:', code, d) })
    };

    await invoiceAuth(mockReqInvoice, mockResInvoice, () => {
      invoiceNextCalled = true;
      invoiceUser = mockReqInvoice.user;
    });

    assert(invoiceNextCalled, 'Invoice middleware called next() without throwing');
    assert(invoiceUser && invoiceUser.id === 42, 'Invoice middleware extracted user ID (42)');
    assert(invoiceUser && invoiceUser.name === 'Captain Leeds', 'Invoice middleware extracted user name');
    assert(invoiceUser && invoiceUser.role && invoiceUser.role.power === 'OpsAdmin', 'Invoice middleware extracted role object');

    // -----------------------------------------------------------------
    // TEST 6: Downstream In-Memory Verification (Supplier Service Middleware)
    // -----------------------------------------------------------------
    console.log('\n[6] Testing Supplier Service Auth Middleware with RS256...');
    const { authenticateToken: supplierAuth } = require('./supplier-service/middlewares/authToken');
    
    let supplierUser = null;
    let supplierNextCalled = false;
    const mockReqSupplier = {
      headers: { authorization: `Bearer ${accessToken}` }
    };
    const mockResSupplier = {
      status: (code) => ({ json: (d) => console.error('Supplier error res:', code, d) })
    };

    await supplierAuth(mockReqSupplier, mockResSupplier, () => {
      supplierNextCalled = true;
      supplierUser = mockReqSupplier.user;
    });

    assert(supplierNextCalled, 'Supplier middleware called next()');
    assert(supplierUser && supplierUser.power === 'OpsAdmin', 'Supplier middleware extracted power ("OpsAdmin")');
    assert(supplierUser && supplierUser.roleName === 'Operations Lead', 'Supplier middleware extracted roleName');

    // -----------------------------------------------------------------
    // TEST 7: Customer Service Auth Middleware
    // -----------------------------------------------------------------
    console.log('\n[7] Testing Customer Service Auth Middleware with RS256...');
    const { authenticateToken: customerAuth } = require('./customer-service/middlewares/authToken');
    
    let customerUser = null;
    let customerNextCalled = false;
    const mockReqCustomer = {
      headers: { authorization: `Bearer ${accessToken}` }
    };
    const mockResCustomer = {
      status: (code) => ({ json: (d) => console.error('Customer error res:', code, d) })
    };

    await customerAuth(mockReqCustomer, mockResCustomer, () => {
      customerNextCalled = true;
      customerUser = mockReqCustomer.user;
    });

    assert(customerNextCalled, 'Customer middleware called next()');
    assert(customerUser && customerUser.id === 42, 'Customer middleware extracted user id');
    assert(customerUser && customerUser.email === 'pilot@onboardaero.com', 'Customer middleware extracted email');

    // -----------------------------------------------------------------
    // TEST 8: File Service Auth Middleware
    // -----------------------------------------------------------------
    console.log('\n[8] Testing File Service Auth Middleware with RS256...');
    const { authenticateToken: fileAuth } = require('./file-service/middleware/auth');
    
    let fileUser = null;
    let fileNextCalled = false;
    const mockReqFile = {
      headers: { authorization: `Bearer ${accessToken}` }
    };
    const mockResFile = {
      status: (code) => ({ json: (d) => console.error('File error res:', code, d) })
    };

    await fileAuth(mockReqFile, mockResFile, () => {
      fileNextCalled = true;
      fileUser = mockReqFile.user;
    });

    assert(fileNextCalled, 'File middleware called next()');
    assert(fileUser && fileUser.id === 42, 'File middleware extracted user id (42)');
    assert(fileUser && fileUser.name === 'Captain Leeds', 'File middleware extracted user name');

    // -----------------------------------------------------------------
    // TEST 9: Angular Frontend Decoder Simulation
    // -----------------------------------------------------------------
    console.log('\n[9] Testing Angular Frontend Token Decoding Compatibility...');
    function frontendDecodeJwt(token) {
      try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          Buffer.from(base64, 'base64')
            .toString('utf8')
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch {
        return null;
      }
    }

    const feDecoded = frontendDecodeJwt(accessToken);
    assert(feDecoded !== null, 'Frontend decodeJwt successfully parsed token');
    assert(feDecoded.name === 'Captain Leeds', `Frontend extracted user name: ${feDecoded.name}`);
    assert(feDecoded.roleName === 'Operations Lead', `Frontend extracted roleName: ${feDecoded.roleName}`);
    assert(feDecoded.power === 'OpsAdmin', `Frontend extracted power: ${feDecoded.power}`);

    // -----------------------------------------------------------------
    // TEST 10: Security Tests (Tampering, Bad Signatures, Expired Tokens)
    // -----------------------------------------------------------------
    console.log('\n[10] Running Cryptographic Security Tests...');

    // 10a. Tampered Token
    const tokenParts = accessToken.split('.');
    const tamperedPayload = Buffer.from(JSON.stringify({ ...p, id: 9999 })).toString('base64url');
    const tamperedToken = `${tokenParts[0]}.${tamperedPayload}.${tokenParts[2]}`;
    
    let tamperDetected = false;
    try {
      jwt.verify(tamperedToken, publicKey, { algorithms: ['RS256'] });
    } catch (e) {
      tamperDetected = true;
    }
    assert(tamperDetected, 'Tampered token payload was strictly rejected by RSA verification');

    // 10b. Expired Token
    const expiredToken = jwt.sign(
      { id: 1, email: 'exp@test.com' },
      privateKey,
      { algorithm: 'RS256', expiresIn: '-1s' }
    );
    let expiredCaught = false;
    try {
      jwt.verify(expiredToken, publicKey, { algorithms: ['RS256'] });
    } catch (e) {
      if (e.name === 'TokenExpiredError') expiredCaught = true;
    }
    assert(expiredCaught, 'Expired token correctly triggered TokenExpiredError');

    // 10c. Algorithm Confusion / Prevention Test
    // Attacker generates HS256 token signed with public key as secret
    const confusionToken = jwt.sign(
      { id: 1, role: 'attacker' },
      publicKey,
      { algorithm: 'HS256' }
    );
    let confusionBlocked = false;
    try {
      jwt.verify(confusionToken, publicKey, { algorithms: ['RS256'] });
    } catch (e) {
      confusionBlocked = true;
    }
    assert(confusionBlocked, 'Algorithm confusion attack (HS256 against RS256 public key) was strictly blocked');

    // -----------------------------------------------------------------
    // SUMMARY
    // -----------------------------------------------------------------
    console.log('\n====================================================');
    console.log(`RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
    console.log('====================================================\n');

    if (testsFailed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }

  } catch (err) {
    console.error('Fatal Test Exception:', err);
    process.exit(1);
  }
}

runTests();
