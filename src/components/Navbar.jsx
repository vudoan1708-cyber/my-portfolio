'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import NavItem from './NavItem';
import Avatar from './Avatar';

export default function Navbar() {
  const pathname = usePathname();
  const isDetail = /^\/portfolio\/[^/]+\/[^/]+$/.test(pathname);
  const isHome = pathname === '/' || pathname === '/portfolio';

  const onMobile = useRef(false);
  const [showMiniAvatar, setShowMiniAvatar] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  useEffect(() => {
    onMobile.current = window.matchMedia('(pointer: coarse)').matches;
    setShowMiniAvatar(onMobile.current || isDetail || !isHome);

    const handleScroll = () => {
      const triggerHeight = 100;
      setShowMiniAvatar(
        onMobile.current ||
          window.scrollY > window.innerHeight - triggerHeight ||
          isDetail ||
          !isHome
      );
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDetail, isHome]);

  useEffect(() => {
    setHamburgerOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-black/85 backdrop-blur-md border-b border-white/5 fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 py-3">
      <Link href="/portfolio" className="flex items-center min-w-0">
        <AnimatePresence mode="popLayout">
          {showMiniAvatar && (
            <motion.div
              key="navbar-avatar"
              layoutId="avatar"
              className="overflow-hidden rounded-full mr-3"
              style={{ width: 40, height: 40 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 0.8 }}
            >
              <Avatar src="/images/avatar.webp" alt="Vu Doan avatar" size="sm" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.span
          className="text-white font-semibold tracking-tight"
          animate={{ marginLeft: showMiniAvatar ? 0 : 8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          Vu Doan
        </motion.span>
      </Link>

      <ul className="hidden sm:flex sm:space-x-8 sm:items-center">
        <NavItem to="/portfolio" label="Portfolio" />
        <NavItem to="/music" label="Music" />
        <NavItem to="/resume" label="Resume" />
      </ul>

      <button
        className="block sm:hidden p-2 rounded-md hover:bg-white/10 text-white"
        onClick={() => setHamburgerOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={hamburgerOpen}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <AnimatePresence>
          {hamburgerOpen && (
            <motion.div
              className="absolute top-full right-4 w-36 bg-black/95 text-white shadow-2xl backdrop-blur-md z-40 p-3 mt-1 rounded-xl border border-white/10 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <ul className="flex flex-col items-start gap-3 divide-y divide-white/10">
                <NavItem to="/portfolio" label="Portfolio" />
                <NavItem to="/music" label="Music" />
                <NavItem to="/resume" label="Resume" />
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </nav>
  );
}
