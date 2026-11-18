const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generateKeys() {
  console.log('Generating 2048-bit RSA key pair for RS256 JWTs...');
  
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  const baseDir = path.resolve(__dirname, '..');
  
  // 1. Save in master keys directory: Backend/keys
  const masterKeysDir = path.join(baseDir, 'keys');
  ensureDir(masterKeysDir);
  fs.writeFileSync(path.join(masterKeysDir, 'private.key'), privateKey, { mode: 0o600 });
  fs.writeFileSync(path.join(masterKeysDir, 'public.key'), publicKey, { mode: 0o644 });
  console.log(`Saved master keys in: ${masterKeysDir}`);

  // 2. Auth service gets BOTH private and public keys
  const authKeysDir = path.join(baseDir, 'auth-service', 'keys');
  ensureDir(authKeysDir);
  fs.writeFileSync(path.join(authKeysDir, 'private.key'), privateKey, { mode: 0o600 });
  fs.writeFileSync(path.join(authKeysDir, 'public.key'), publicKey, { mode: 0o644 });
  console.log(`Saved auth-service private and public keys in: ${authKeysDir}`);

  // 3. Downstream services ONLY get the public key
  const downstreamServices = [
    'invoice-service',
    'file-service',
    'customer-service',
    'supplier-service'
  ];

  downstreamServices.forEach(service => {
    const serviceKeysDir = path.join(baseDir, service, 'keys');
    ensureDir(serviceKeysDir);
    fs.writeFileSync(path.join(serviceKeysDir, 'public.key'), publicKey, { mode: 0o644 });
    console.log(`Saved public key in: ${serviceKeysDir}`);
  });

  console.log('\n✅ RSA 2048-bit Key Pair generated and distributed successfully!');
}

generateKeys();

