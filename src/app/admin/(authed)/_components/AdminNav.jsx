'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/experiences', label: 'Experiences' },
  { href: '/admin/tech-registry', label: 'Tech registry' },
  { href: '/admin/music', label: 'Music' },
];

function isActive(pathname, href) {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
        active
          ? 'text-white bg-white/10'
          : 'text-white/75 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
}

export default function AdminNav({ logoutAction }) {
  const pathname = usePathname();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  useEffect(() => {
    setHamburgerOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="hidden sm:flex items-center gap-2">
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              active={isActive(pathname, item.href)}
            >
              {item.label}
            </NavLink>
          ))}
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

      <div className="relative sm:hidden">
        <button
          type="button"
          className="p-2 rounded-md hover:bg-white/10 text-white"
          onClick={() => setHamburgerOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={hamburgerOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                hamburgerOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>

        <AnimatePresence>
          {hamburgerOpen && (
            <motion.div
              className="absolute top-full right-0 w-44 bg-black/95 text-white shadow-2xl backdrop-blur-md z-40 p-2 mt-1 rounded-xl border border-white/10 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      active={isActive(pathname, item.href)}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                <li className="border-t border-white/10 mt-1 pt-2">
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="w-full text-left block px-3 py-1.5 rounded-md text-sm text-white/75 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Sign out
                    </button>
                  </form>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
