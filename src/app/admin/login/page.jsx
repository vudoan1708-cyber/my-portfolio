import { redirect } from 'next/navigation';
import { isAdminConfigured, isFullyAuthed } from '@/lib/session';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isFullyAuthed()) redirect('/admin');
  const configured = isAdminConfigured();
  return (
    <main className="min-h-dvh grid place-items-center bg-neutral-950 text-white px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Admin sign in
        </h1>
        <p className="text-sm text-white/60 mb-6">Step 1 of 2 — credentials</p>
        {configured ? (
          <LoginForm />
        ) : (
          <NotConfigured />
        )}
      </div>
    </main>
  );
}

function NotConfigured() {
  return (
    <div className="rounded-lg ring-1 ring-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-100 leading-relaxed">
      <p className="font-semibold mb-2">Admin is not configured.</p>
      <p className="text-amber-100/80 mb-3">
        Set the following env vars (see <code>README.md</code>):
      </p>
      <ul className="list-disc list-inside font-mono text-xs space-y-1">
        <li>SESSION_SECRET (32+ chars)</li>
        <li>ADMIN_USERNAME</li>
        <li>ADMIN_PASSWORD_HASH (run <code>node scripts/hash-password.mjs</code>)</li>
        <li>ADMIN_TOTP_SECRET (run <code>node scripts/setup-2fa.mjs</code>)</li>
      </ul>
    </div>
  );
}
