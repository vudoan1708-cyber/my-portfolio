'use client';

import { usePathname } from 'next/navigation';

import NavLink from './NavLink';

export default function NavItem({ to, label, compact = false }) {
  const pathname = usePathname();
  const isActive = pathname === to || pathname.startsWith(`${to}/`);

  return (
    <li>
      <NavLink href={to} active={isActive} compact={compact}>
        {label}
      </NavLink>
    </li>
  );
}
