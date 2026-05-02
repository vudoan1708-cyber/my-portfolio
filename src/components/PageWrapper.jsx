'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export default function PageWrapper({ children }) {
  const pathname = usePathname();
  const isDetailPage = /^\/portfolio\/[^/]+\/[^/]+$/.test(pathname);

  useEffect(() => {
    if (isDetailPage) {
      window.scrollTo(0, 0);
    }
  }, [isDetailPage, pathname]);

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={`${isDetailPage ? 'py-0' : 'p-0'} bg-neutral-950 min-h-screen`}
      id="Page_Content_Details"
    >
      {children}
    </motion.div>
  );
}
