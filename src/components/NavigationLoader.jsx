'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function isInternalNavigation(event) {
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;

  const target = event.target;
  if (!(target instanceof Element)) return false;
  const anchor = target.closest('a');
  if (!anchor) return false;
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;

  const href = anchor.getAttribute('href');
  if (!href) return false;
  if (href.startsWith('#')) return false;
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;

  const url = new URL(anchor.href, window.location.origin);
  if (url.origin !== window.location.origin) return false;

  const samePath =
    url.pathname === window.location.pathname &&
    url.search === window.location.search;
  if (samePath) return false;

  return true;
}

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const safetyTimerRef = useRef(null);

  useEffect(() => {
    const startLoading = () => {
      setLoading(true);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => setLoading(false), 8000);
    };

    const handleClick = (event) => {
      if (isInternalNavigation(event)) startLoading();
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', startLoading);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', startLoading);
    };
  }, []);

  useEffect(() => {
    setLoading(false);
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="navigation-loader"
          className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left bg-gradient-to-r from-rose-400 via-pink-300 to-rose-500 shadow-[0_0_10px_rgba(244,114,182,0.6)]"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{
            scaleX: [0, 0.4, 0.7, 0.9],
            transition: {
              duration: 2,
              ease: 'easeOut',
              times: [0, 0.3, 0.7, 1],
            },
          }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}
