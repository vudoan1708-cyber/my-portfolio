import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 20 },
  out: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.6,
};

export default function PageWrapper({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  // Match /portfolio/:collection/:projectKey exactly
  const isDetailPage = /^\/portfolio\/[^\\/]+\/[^\\/]+$/.test(location.pathname);

  const shouldScroll = location.state?.scrollToDetails;

  useEffect(() => {
    if (!shouldScroll) return;

    const target = document.getElementById('Page_Content_Details');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      // Reset state so this only runs once
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [ shouldScroll, navigate, location.pathname ]);

  // Scroll behavior: on ProjectDetail routes, scroll to top; otherwise retain
  useEffect(() => {
    if (isDetailPage) {
      window.scrollTo(0, 0);
    }
  }, [ isDetailPage ]);

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      variants={pageVariants}
      transition={pageTransition}
      className={`${isDetailPage ? "py-8" : "p-8"} bg-neutral-950 min-h-screen`}
      id="Page_Content_Details"
    >
      {children}
    </motion.div>
  );
}
