import 'server-only';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

const SESSION_COOKIE = 'portfolio-admin-session';

export function isAdminConfigured() {
  return Boolean(
    process.env.SESSION_SECRET &&
      process.env.SESSION_SECRET.length >= 32 &&
      process.env.ADMIN_USERNAME &&
      process.env.ADMIN_PASSWORD_HASH &&
      process.env.ADMIN_TOTP_SECRET,
  );
}

function sessionOptions() {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      'SESSION_SECRET must be set and at least 32 characters long.',
    );
  }
  return {
    password,
    cookieName: SESSION_COOKIE,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}

export async function getSession() {
  return getIronSession(await cookies(), sessionOptions());
}

async function safeSession() {
  if (!process.env.SESSION_SECRET) return null;
  try {
    return await getSession();
  } catch {
    return null;
  }
}

export async function isFullyAuthed() {
  const s = await safeSession();
  return Boolean(s?.fullyAuthed);
}

export async function isPasswordVerified() {
  const s = await safeSession();
  return Boolean(s?.passwordOk);
}

export async function markPasswordVerified() {
  const s = await getSession();
  s.passwordOk = true;
  s.passwordOkAt = Date.now();
  delete s.fullyAuthed;
  await s.save();
}

export async function markFullyAuthed() {
  const s = await getSession();
  if (!s.passwordOk) {
    throw new Error('Cannot mark fully authed without password verification.');
  }
  s.fullyAuthed = true;
  s.fullyAuthedAt = Date.now();
  await s.save();
}

export async function clearSession() {
  const s = await safeSession();
  if (s) s.destroy();
}
