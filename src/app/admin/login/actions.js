'use server';

import { redirect } from 'next/navigation';
import { loginSchema, totpSchema } from '@/lib/validators';
import { verifyPassword, verifyTotp, withMinLatency } from '@/lib/auth';
import {
  clearSession,
  isPasswordVerified,
  markFullyAuthed,
  markPasswordVerified,
} from '@/lib/session';

export async function loginAction(_prevState, formData) {
  const parsed = loginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    await withMinLatency(() => Promise.resolve(), 250);
    return { error: 'Invalid credentials.' };
  }
  const ok = await withMinLatency(() =>
    verifyPassword(parsed.data.username, parsed.data.password),
  );
  if (!ok) {
    return { error: 'Invalid credentials.' };
  }
  await markPasswordVerified();
  redirect('/admin/login/two-factor');
}

export async function verifyTotpAction(_prevState, formData) {
  if (!(await isPasswordVerified())) {
    redirect('/admin/login');
  }
  const parsed = totpSchema.safeParse({ token: formData.get('token') });
  if (!parsed.success) {
    await withMinLatency(() => Promise.resolve(), 200);
    return { error: 'Invalid code.' };
  }
  const ok = await withMinLatency(
    () => Promise.resolve(verifyTotp(parsed.data.token)),
    200,
  );
  if (!ok) {
    return { error: 'Invalid code.' };
  }
  await markFullyAuthed();
  redirect('/admin');
}

export async function logoutAction() {
  await clearSession();
  redirect('/admin/login');
}
