'use client';

import Link from 'next/link';

function getClassName(active, compact) {
  if (compact) {
    if (active) {
      return 'block px-3 py-1.5 rounded-md text-sm transition-colors text-rose-300 bg-rose-300/10';
    }
    return 'block px-3 py-1.5 rounded-md text-sm transition-colors text-white/75 hover:text-rose-200 hover:bg-white/5';
  }

  if (active) {
    return 'text-rose-300 hover:text-rose-200 transition-colors font-medium tracking-wide';
  }
  return 'text-white/90 hover:text-rose-200 transition-colors font-medium tracking-wide';
}

export default function NavLink({ href, active, compact = false, children }) {
  return (
    <Link href={href} className={getClassName(active, compact)}>
      {children}
    </Link>
  );
}
