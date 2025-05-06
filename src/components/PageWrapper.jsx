import React, { useEffect } from 'react';
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
  // Match /portfolio/:collection/:projectKey exactly
  const isDetail = /^\/portfolio\/[^\\/]+\/[^\\/]+$/.test(location.pathname);

  // Scroll behavior: on ProjectDetail routes, scroll to top; otherwise retain
  useEffect(() => {
    if (isDetail) {
      window.scrollTo(0, 0);
    }
  }, [ isDetail ]);

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        location={location}
        key={location.pathname}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        variants={pageVariants}
        transition={pageTransition}
        className={isDetail ? "py-8 bg-neutral-950 min-h-screen" : "p-8 bg-neutral-950 min-h-screen"}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
