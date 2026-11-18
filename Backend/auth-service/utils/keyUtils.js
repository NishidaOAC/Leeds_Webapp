const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let cachedPrivateKey = null;
let cachedPublicKey = null;

function loadKeyFile(possiblePaths) {
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf8').trim();
        if (content.length > 0) return content;
      } catch (err) {
        console.warn(`[KeyUtils] Error reading key at ${p}:`, err.message);
      }
    }
  }
  return null;
}

function getPrivateKey() {
  if (cachedPrivateKey) return cachedPrivateKey;

  // 1. From environment variable (either raw PEM or base64 encoded)
  if (process.env.JWT_PRIVATE_KEY) {
    let key = process.env.JWT_PRIVATE_KEY;
    if (!key.includes('BEGIN')) {
      key = Buffer.from(key, 'base64').toString('utf8');
    }
    cachedPrivateKey = key;
    return cachedPrivateKey;
  }

  // 2. From file system
  const searchPaths = [
    path.resolve(__dirname, '../keys/private.key'),
    path.resolve(__dirname, '../../keys/private.key'),
    path.resolve(process.cwd(), 'keys/private.key')
  ];

  const keyContent = loadKeyFile(searchPaths);
  if (keyContent) {
    cachedPrivateKey = keyContent;
    return cachedPrivateKey;
  }

  // 3. Auto-generate if missing in development
  console.warn('[KeyUtils] RSA private key not found. Generating ephemeral key pair...');
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  cachedPrivateKey = privateKey;
  cachedPublicKey = publicKey;

  // Try to persist so restarts are consistent
  try {
    const keysDir = path.resolve(__dirname, '../keys');
    if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true });
    fs.writeFileSync(path.join(keysDir, 'private.key'), privateKey);
    fs.writeFileSync(path.join(keysDir, 'public.key'), publicKey);
  } catch (saveErr) {
    console.warn('[KeyUtils] Could not persist generated keys:', saveErr.message);
  }

  return cachedPrivateKey;
}

function getPublicKey() {
  if (cachedPublicKey) return cachedPublicKey;

  // 1. From environment variable
  if (process.env.JWT_PUBLIC_KEY) {
    let key = process.env.JWT_PUBLIC_KEY;
    if (!key.includes('BEGIN')) {
      key = Buffer.from(key, 'base64').toString('utf8');
    }
    cachedPublicKey = key;
    return cachedPublicKey;
  }

  // 2. From file system
  const searchPaths = [
    path.resolve(__dirname, '../keys/public.key'),
    path.resolve(__dirname, '../../keys/public.key'),
    path.resolve(process.cwd(), 'keys/public.key')
  ];

  const keyContent = loadKeyFile(searchPaths);
  if (keyContent) {
    cachedPublicKey = keyContent;
    return cachedPublicKey;
  }

  // 3. Derive from private key if private key is available
  try {
    const privKey = getPrivateKey();
    const pubKeyObj = crypto.createPublicKey(privKey);
    cachedPublicKey = pubKeyObj.export({ type: 'spki', format: 'pem' });
    return cachedPublicKey;
  } catch (err) {
    throw new Error(`[KeyUtils] Public key could not be loaded or derived: ${err.message}`);
  }
}

/**
 * Standard JWKS (JSON Web Key Set) representation
 */
function getJwks() {
  const pubPem = getPublicKey();
  const keyObj = crypto.createPublicKey(pubPem);
  const jwk = keyObj.export({ format: 'jwk' });

  return {
    keys: [
      {
        kty: jwk.kty,
        n: jwk.n,
        e: jwk.e,
        alg: 'RS256',
        use: 'sig',
        kid: 'leeds-auth-key-1'
      }
    ]
  };
}

module.exports = {
  getPrivateKey,
  getPublicKey,
  getJwks
};

