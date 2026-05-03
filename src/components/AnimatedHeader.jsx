'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';
import Bio from './Bio';
import ScrollDownButton from './ScrollDownButton';

export default function AnimatedHeader() {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPast(window.scrollY > window.innerHeight - 200);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="relative z-10 w-full min-h-svh overflow-hidden flex items-center justify-center bg-noise">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_85%)]" />

      <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12 z-10 mt-16 w-full max-w-5xl px-6 md:px-10 justify-center">
        <AnimatePresence mode="popLayout">
          {!scrolledPast && (
            <motion.div
              key="header-avatar"
              layoutId="avatar"
              className="hidden md:block rounded-full"
              initial={{ opacity: 0, scale: 0.6, y: -60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.55, y: -60 }}
              transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 0.9 }}
            >
              <Avatar src="/images/avatar.webp" alt="Vu Doan portrait" size="lg" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-white/10 max-w-xl text-sm sm:text-base text-white"
        >
          <Bio />
        </motion.div>
      </div>

      <ScrollDownButton />
    </header>
  );
}
