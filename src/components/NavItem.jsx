'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavItem({ to, label }) {
  const pathname = usePathname();
  const isActive = pathname === to || pathname.startsWith(`${to}/`);

  return (
    <li>
      <Link
        href={to}
        className={`${
          isActive ? 'text-rose-300' : 'text-white/90'
        } hover:text-rose-200 transition-colors font-medium tracking-wide`}
      >
        {label}
      </Link>
    </li>
  );
}
