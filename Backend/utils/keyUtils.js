const fs = require('fs');
const path = require('path');

let cachedPublicKey = null;

function getPublicKey() {
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
    path.resolve(__dirname, '../auth-service/keys/public.key')
  ];

  for (const p of searchPaths) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf8').trim();
        if (content.length > 0) {
          cachedPublicKey = content;
          return cachedPublicKey;
        }
      } catch (err) {
        console.warn(`[KeyUtils] Error reading public key at ${p}:`, err.message);
      }
    }
  }

  return null;
}

module.exports = { getPublicKey };

