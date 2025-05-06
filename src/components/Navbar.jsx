import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import NavItem from './NavItem';

import Avatar from './Avatar';
import { NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  // Match /portfolio/:collection/:projectKey exactly
  const isDetail = /^\/portfolio\/[^\\/]+\/[^\\/]+$/.test(location.pathname);

  const onMobile = useRef(window.matchMedia('(pointer: coarse)').matches);
  const [ showMiniAvatar, setShowMiniAvatar ] = useState(onMobile.current || false);
  const [ hamburgerOpen, setHamburgerOpen ] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const triggerHeight = 100; // adjust based on avatar size/position
      setShowMiniAvatar(onMobile.current || window.scrollY > window.innerHeight - triggerHeight || isDetail);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ isDetail ]);
  useEffect(() => {
    setHamburgerOpen(false);
  }, [ location.pathname ]);

  return (
    <>
      <nav className="bg-black fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4">
      <NavLink to="/portfolio" className="flex items-center space-x-3">
        <motion.div
          layoutId="avatar"
          className="overflow-hidden rounded-full"
          style={{ width: 48, height: 48 }}
          animate={{ opacity: showMiniAvatar ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Avatar src="/images/avatar.webp" alt="My avatar image on nav bar" size="sm" />
        </motion.div>
        <motion.span
          className="text-slate-50"
          animate={{ position: showMiniAvatar ? 'relative' : 'absolute', left: showMiniAvatar ? '1px' : '-2px' }}
          transition={{ duration: 0.4 }}>
          Vu Doan
        </motion.span>
      </NavLink>
      <ul className="hidden sm:block sm:flex sm:space-x-8 sm:items-center">
        <NavItem to="/portfolio" label="Portfolio" />
        <NavItem to="/blog"  label="Blog" />
        <NavItem to="/resume" label="Resume" />
      </ul>
      
      {/* Hamburger button - shown only on mobile */}
      <button
        className="block right-0 sm:hidden p-2 rounded-md hover:bg-white/10 text-white"
        onClick={() => { setHamburgerOpen((o) => !o); }}
        aria-label="Toggle menu"
      >
        {/* Simple hamburger icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d={hamburgerOpen 
              ? "M6 18L18 6M6 6l12 12"  // X icon when open
              : "M4 6h16M4 12h16M4 18h16" // Hamburger when closed
            }
          />
        </svg>

        {/* Mobile dropdown overlay, siblings to <button> */}
        <AnimatePresence>
          {hamburgerOpen && (
            <motion.div
              className={`
                absolute top-full right-4 w-32
                bg-black/90 text-white shadow-2xl backdrop-blur-sm
                z-40 p-4 mt-1 rounded-b-lg overflow-hidden
              `}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'tween', duration: 0.3 }}>
              <ul className="flex flex-col items-center space-y-4 divide-y divide-white/20">
                <NavItem to="/portfolio" label="Portfolio" />
                <NavItem to="/blog"  label="Blog" />
                <NavItem to="/resume" label="Resume" />
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </nav>
    </>
  );
}
