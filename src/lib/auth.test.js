const bcrypt = require('bcryptjs');
const { TOTP, Secret } = require('otpauth');

const { verifyPassword, verifyTotp, withMinLatency } = require('./auth');

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  delete process.env.ADMIN_USERNAME;
  delete process.env.ADMIN_PASSWORD_HASH;
  delete process.env.ADMIN_TOTP_SECRET;
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe('verifyPassword', () => {
  test('returns false when env vars are missing', async () => {
    expect(await verifyPassword('admin', 'pw')).toBe(false);
  });

  test('returns true for valid username + password', async () => {
    process.env.ADMIN_USERNAME = 'vu';
    process.env.ADMIN_PASSWORD_HASH = await bcrypt.hash('correct-pw', 4);
    expect(await verifyPassword('vu', 'correct-pw')).toBe(true);
  });

  test('returns false for wrong password', async () => {
    process.env.ADMIN_USERNAME = 'vu';
    process.env.ADMIN_PASSWORD_HASH = await bcrypt.hash('correct-pw', 4);
    expect(await verifyPassword('vu', 'wrong-pw')).toBe(false);
  });

  test('returns false for wrong username (does not leak which field was wrong)', async () => {
    process.env.ADMIN_USERNAME = 'vu';
    process.env.ADMIN_PASSWORD_HASH = await bcrypt.hash('correct-pw', 4);
    expect(await verifyPassword('attacker', 'correct-pw')).toBe(false);
  });

  test('returns false on null/undefined inputs', async () => {
    process.env.ADMIN_USERNAME = 'vu';
    process.env.ADMIN_PASSWORD_HASH = await bcrypt.hash('correct-pw', 4);
    expect(await verifyPassword(null, null)).toBe(false);
    expect(await verifyPassword(undefined, undefined)).toBe(false);
    expect(await verifyPassword('', '')).toBe(false);
  });

  test('returns false on malformed hash without throwing', async () => {
    process.env.ADMIN_USERNAME = 'vu';
    process.env.ADMIN_PASSWORD_HASH = 'not-a-valid-hash';
    await expect(verifyPassword('vu', 'pw')).resolves.toBe(false);
  });
});

describe('verifyTotp', () => {
  test('returns false when secret is not set', () => {
    expect(verifyTotp('123456')).toBe(false);
  });

  test('returns true for the current TOTP code', () => {
    const secret = new Secret({ size: 20 });
    process.env.ADMIN_TOTP_SECRET = secret.base32;
    const totp = new TOTP({ secret, period: 30, digits: 6 });
    expect(verifyTotp(totp.generate())).toBe(true);
  });

  test('returns false for an obviously wrong code', () => {
    const secret = new Secret({ size: 20 });
    process.env.ADMIN_TOTP_SECRET = secret.base32;
    expect(verifyTotp('000000')).toBe(false);
  });

  test('rejects non-6-digit input', () => {
    const secret = new Secret({ size: 20 });
    process.env.ADMIN_TOTP_SECRET = secret.base32;
    expect(verifyTotp('12345')).toBe(false);
    expect(verifyTotp('1234567')).toBe(false);
    expect(verifyTotp('abcdef')).toBe(false);
    expect(verifyTotp('')).toBe(false);
    expect(verifyTotp(null)).toBe(false);
  });

  test('strips whitespace from input', () => {
    const secret = new Secret({ size: 20 });
    process.env.ADMIN_TOTP_SECRET = secret.base32;
    const totp = new TOTP({ secret, period: 30, digits: 6 });
    const code = totp.generate();
    expect(verifyTotp(`${code.slice(0, 3)} ${code.slice(3)}`)).toBe(true);
  });
});

describe('withMinLatency', () => {
  test('takes at least the minimum time even when fn is fast', async () => {
    const start = Date.now();
    const result = await withMinLatency(async () => 'ok', 100);
    const elapsed = Date.now() - start;
    expect(result).toBe('ok');
    expect(elapsed).toBeGreaterThanOrEqual(95);
  });

  test('does not artificially extend slow operations', async () => {
    const start = Date.now();
    await withMinLatency(
      async () => new Promise((r) => setTimeout(r, 60)),
      30,
    );
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(55);
    expect(elapsed).toBeLessThan(150);
  });

  test('still pads on rejection (does not leak failure timing)', async () => {
    const start = Date.now();
    await expect(
      withMinLatency(async () => {
        throw new Error('boom');
      }, 80),
    ).rejects.toThrow('boom');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(75);
  });
});
