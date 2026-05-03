import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isFullyAuthed } from '@/lib/session';
import { logoutAction } from '../login/actions';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AuthedAdminLayout({ children }) {
  if (!(await isFullyAuthed())) redirect('/admin/login');

  return (
    <div className="min-h-dvh bg-neutral-950 text-white">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <Link href="/admin" className="text-sm font-semibold tracking-tight">
            Portfolio CMS
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <NavLink href="/admin">Overview</NavLink>
            <NavLink href="/admin/projects">Projects</NavLink>
            <NavLink href="/admin/experiences">Experiences</NavLink>
            <NavLink href="/admin/music">Music</NavLink>
          </nav>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs px-3 py-1.5 rounded-md ring-1 ring-white/15 hover:bg-white/5 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10">{children}</main>
    </div>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-md text-white/75 hover:text-white hover:bg-white/5 transition-colors"
    >
      {children}
    </Link>
  );
}
