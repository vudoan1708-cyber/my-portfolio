import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isFullyAuthed } from '@/lib/session';
import { logoutAction } from '../login/actions';
import AdminNav from './_components/AdminNav';
import NavigationLoader from '@/components/NavigationLoader';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AuthedAdminLayout({ children }) {
  if (!(await isFullyAuthed())) redirect('/admin/login');

  return (
    <div className="min-h-dvh bg-neutral-950 text-white">
      <Suspense fallback={null}>
        <NavigationLoader />
      </Suspense>
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <Link href="/admin" className="text-sm font-semibold tracking-tight">
            Portfolio CMS
          </Link>
          <AdminNav logoutAction={logoutAction} />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10">{children}</main>
    </div>
  );
}
