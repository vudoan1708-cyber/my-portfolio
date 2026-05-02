'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ScrollDownButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const onMobile = useRef(false);

  useEffect(() => {
    onMobile.current = window.matchMedia('(pointer: coarse)').matches;
    setVisible(true);
    const timeout = setTimeout(
      () => setVisible(false),
      onMobile.current ? 3500 : 5500
    );
    return () => clearTimeout(timeout);
  }, [pathname]);

  const scrollToContent = () => {
    const target = document.getElementById('Page_Content_Details');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.button
      onClick={scrollToContent}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? [1, 1.1, 1] : 1,
      }}
      transition={{
        duration: 1.2,
        repeat: visible ? Infinity : 0,
      }}
      className="absolute bottom-6 right-4 z-10 bg-slate-900/70 hover:bg-slate-800 text-white p-3 rounded-full border border-white/20 shadow-lg backdrop-blur-sm"
      aria-label="Scroll to content"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </motion.button>
  );
}
