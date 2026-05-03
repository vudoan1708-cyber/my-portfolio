import { redirect } from 'next/navigation';
import {
  isFullyAuthed,
  isPasswordVerified,
} from '@/lib/session';
import TwoFactorForm from './TwoFactorForm';

export const metadata = {
  title: 'Admin sign in · 2FA',
  robots: { index: false, follow: false },
};

export default async function TwoFactorPage() {
  if (await isFullyAuthed()) redirect('/admin');
  if (!(await isPasswordVerified())) redirect('/admin/login');
  return (
    <main className="min-h-dvh grid place-items-center bg-neutral-950 text-white px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Two-factor authentication
        </h1>
        <p className="text-sm text-white/60 mb-6">
          Step 2 of 2 — enter the 6-digit code from your authenticator app.
        </p>
        <TwoFactorForm />
      </div>
    </main>
  );
}
