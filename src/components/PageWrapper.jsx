import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.6,
};

export default function PageWrapper({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        location={location}
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="p-8 bg-gradient-to-b from-white to-gray-100 min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
