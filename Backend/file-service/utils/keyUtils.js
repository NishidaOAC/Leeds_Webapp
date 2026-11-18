const fs = require('fs');
const path = require('path');

let cachedPublicKey = null;

function loadKeyFile(possiblePaths) {
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf8').trim();
        if (content.length > 0) return content;
      } catch (err) {
        console.warn(`[KeyUtils] Error reading public key at ${p}:`, err.message);
      }
    }
  }
  return null;
}

function getPublicKeySync() {
  if (cachedPublicKey) return cachedPublicKey;

  if (process.env.JWT_PUBLIC_KEY) {
    let key = process.env.JWT_PUBLIC_KEY;
    if (!key.includes('BEGIN')) {
      key = Buffer.from(key, 'base64').toString('utf8');
    }
    cachedPublicKey = key;
    return cachedPublicKey;
  }

  const searchPaths = [
    path.resolve(__dirname, '../keys/public.key'),
    path.resolve(__dirname, '../../keys/public.key'),
    path.resolve(__dirname, '../../auth-service/keys/public.key'),
    path.resolve(process.cwd(), 'keys/public.key')
  ];

  const keyContent = loadKeyFile(searchPaths);
  if (keyContent) {
    cachedPublicKey = keyContent;
    return cachedPublicKey;
  }

  return null;
}

async function getPublicKeyAsync() {
  const syncKey = getPublicKeySync();
  if (syncKey) return syncKey;

  const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
  try {
    const res = await fetch(`${authUrl}/public-key`);
    if (res.ok) {
      const pubKey = await res.text();
      if (pubKey && pubKey.includes('PUBLIC KEY')) {
        cachedPublicKey = pubKey.trim();
        return cachedPublicKey;
      }
    }
  } catch (netErr) {
    console.warn(`[KeyUtils] Could not fetch public key from ${authUrl}:`, netErr.message);
  }

  throw new Error('[KeyUtils] RSA Public key could not be loaded from disk or auth-service.');
}

module.exports = {
  getPublicKeySync,
  getPublicKeyAsync
};
