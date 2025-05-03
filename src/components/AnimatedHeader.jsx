import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Avatar from './Avatar';
import Bio from './Bio';
import { useLocation } from 'react-router-dom';

export default function AnimatedHeader() {
  const [ scrolledPast, setScrolledPast ] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPast(window.scrollY > window.innerHeight - 200);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const location = useLocation();
  // Match /portfolio/:collection/:projectKey exactly
  const isDetail = /^\/portfolio\/[^\\/]+\/[^\\/]+$/.test(location.pathname);
  if (isDetail) return null;
  
  return (
    <header className="w-full h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {[...Array(12)].map((_, i) => (
        <React.Fragment key={i}>
          {/* Animated gradient blobs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 opacity-70 filter blur-3xl"
            animate={scrolledPast ? { x: 0, y: 0, scale: 1 } : { x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
            transition={scrolledPast ? { duration: 0 } : { repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-red-500 to-rose-300 opacity-60 filter blur-2xl"
            animate={scrolledPast ? { x: 0, y: 0, scale: 1 } : { x: [-20, 50, -20], y: [0, 80, 0], scale: [1, 1.1, 1] }}
            transition={scrolledPast ? { duration: 0 } : { repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-gradient-to-bl from-pink-500 to-red-400 opacity-50 filter blur-2xl"
            animate={scrolledPast ? { x: 0, y: 0, scale: 1 } : { x: [0, -80, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
            transition={scrolledPast ? { duration: 0 } : { repeat: Infinity, duration: 9, ease: 'easeInOut' }}
          />
        </React.Fragment>
      ))}

      <div className="flex flex-col sm:flex-row items-center gap-4 z-10 mt-8 w-full sm:w-auto justify-center">
        {/* Shared-layout Avatar */}
        <motion.div
          layoutId="avatar"
          className="rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
          animate={{ opacity: scrolledPast ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Avatar src="/images/avatar.webp" alt="My avatar image" size="lg" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-2xl max-w-full sm:max-w-lg mx-auto text-sm sm:text-base text-white"
        >
          <div className="border-t border-white/20 my-2 sm:hidden"></div>
          <Bio />
        </motion.div>
      </div>
    </header>
  );
}
