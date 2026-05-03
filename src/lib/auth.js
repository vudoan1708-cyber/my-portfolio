import 'server-only';
import bcrypt from 'bcryptjs';
import { TOTP } from 'otpauth';

const MIN_LOGIN_LATENCY_MS = 250;

function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function withMinLatency(fn, minMs = MIN_LOGIN_LATENCY_MS) {
  const start = Date.now();
  let result;
  try {
    result = await fn();
  } finally {
    const elapsed = Date.now() - start;
    if (elapsed < minMs) {
      await new Promise((resolve) => setTimeout(resolve, minMs - elapsed));
    }
  }
  return result;
}

export async function verifyPassword(username, password) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUsername || !expectedHash) {
    return false;
  }
  const usernameOk = constantTimeEqual(
    String(username || ''),
    expectedUsername,
  );
  let passwordOk = false;
  try {
    passwordOk = await bcrypt.compare(String(password || ''), expectedHash);
  } catch {
    passwordOk = false;
  }
  return usernameOk && passwordOk;
}

export function verifyTotp(token) {
  const secret = process.env.ADMIN_TOTP_SECRET;
  if (!secret) return false;
  const code = String(token || '').replace(/\s+/g, '');
  if (!/^\d{6}$/.test(code)) return false;
  const totp = new TOTP({
    issuer: 'Portfolio Admin',
    label: 'Portfolio Admin',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  });
  const delta = totp.validate({ token: code, window: 1 });
  return delta !== null;
}
