const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { detectFileType, fileFilter, validateMagicBytes } = require('../file-service/upload.middleware');
const { authorizeRole } = require('../file-service/middleware/auth');

describe('File Service - Magic Byte Signature Detection', () => {
  it('should detect a valid PDF file signature (%PDF)', () => {
    // 0x25, 0x50, 0x44, 0x46 is "%PDF"
    const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35]);
    const result = detectFileType(pdfBuffer);
    assert.ok(result);
    assert.strictEqual(result.mime, 'application/pdf');
  });

  it('should detect a valid PNG file signature', () => {
    // 89 50 4E 47 0D 0A 1A 0A
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const result = detectFileType(pngBuffer);
    assert.ok(result);
    assert.strictEqual(result.mime, 'image/png');
  });

  it('should detect a valid JPEG file signature', () => {
    // FF D8 FF E0
    const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
    const result = detectFileType(jpegBuffer);
    assert.ok(result);
    assert.strictEqual(result.mime, 'image/jpeg');
  });

  it('should return null for non-supported or malicious binary executable formats', () => {
    // Windows MZ header (0x4D, 0x5A) or ELF (0x7F, 0x45, 0x4C, 0x46)
    const exeBuffer = Buffer.from([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00]);
    const result = detectFileType(exeBuffer);
    assert.strictEqual(result, null);
  });

  it('should return null for empty or truncated buffer (< 4 bytes)', () => {
    const tinyBuffer = Buffer.from([0x25, 0x50]);
    assert.strictEqual(detectFileType(tinyBuffer), null);
    assert.strictEqual(detectFileType(null), null);
  });
});

describe('File Service - File Extension & MIME Filter', () => {
  it('should accept valid PDF upload', () => {
    const file = { originalname: 'contract.pdf', mimetype: 'application/pdf' };
    let accepted = false;
    let filterError = null;

    fileFilter({}, file, (err, pass) => {
      filterError = err;
      accepted = pass;
    });

    assert.strictEqual(filterError, null);
    assert.strictEqual(accepted, true);
  });

  it('should accept valid JPEG upload', () => {
    const file = { originalname: 'inspection.jpg', mimetype: 'image/jpeg' };
    let accepted = false;
    let filterError = null;

    fileFilter({}, file, (err, pass) => {
      filterError = err;
      accepted = pass;
    });

    assert.strictEqual(filterError, null);
    assert.strictEqual(accepted, true);
  });

  it('should reject disallowed executable extension', () => {
    const file = { originalname: 'malware.exe', mimetype: 'application/octet-stream' };
    let accepted = false;
    let filterError = null;

    fileFilter({}, file, (err, pass) => {
      filterError = err;
      accepted = pass;
    });

    assert.ok(filterError instanceof Error);
    assert.ok(filterError.message.includes('Invalid file type or extension'));
  });
});

describe('File Service - Magic Byte Spoofing Defense', () => {
  it('should reject a file named .pdf containing executable content', async () => {
    const maliciousReq = {
      file: {
        originalname: 'fake_invoice.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from([0x4D, 0x5A, 0x90, 0x00, 0x00]) // Executable binary content disguised as PDF
      }
    };

    let statusCode = null;
    let resJson = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: (d) => { resJson = d; } };
      }
    };
    let nextCalled = false;

    await validateMagicBytes(maliciousReq, res, () => { nextCalled = true; });

    assert.strictEqual(statusCode, 400);
    assert.strictEqual(resJson.success, false);
    assert.ok(resJson.error.includes('could not be verified'));
    assert.strictEqual(nextCalled, false);
  });

  it('should allow authentic PDF file with valid magic bytes', async () => {
    const validReq = {
      file: {
        originalname: 'real_invoice.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x37])
      }
    };

    let nextCalled = false;
    const res = {};

    await validateMagicBytes(validReq, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
  });
});

describe('File Service - Role Authorization Middleware', () => {
  it('should return 401 when user is not present on req', () => {
    const middleware = authorizeRole(1, 2);
    const req = {};
    let statusCode = null;
    let resJson = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: (d) => { resJson = d; } };
      }
    };
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusCode, 401);
    assert.strictEqual(resJson.message, 'Authentication required');
    assert.strictEqual(nextCalled, false);
  });

  it('should allow user whose roleId is in the allowed list', () => {
    const middleware = authorizeRole(1, 2, 3);
    const req = { user: { id: 10, roleId: 2 } };
    let nextCalled = false;
    const res = {};

    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
  });

  it('should return 403 when user roleId is not in the allowed list', () => {
    const middleware = authorizeRole(1, 2);
    const req = { user: { id: 10, roleId: 99 } };
    let statusCode = null;
    let resJson = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: (d) => { resJson = d; } };
      }
    };
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusCode, 403);
    assert.strictEqual(resJson.message, 'Insufficient permissions');
    assert.strictEqual(nextCalled, false);
  });
});

