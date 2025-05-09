import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { motion } from 'framer-motion';

export default function ScrollDownButton() {
  const location = useLocation();
  const [ visible, setVisible ] = useState(true);
  const onMobile = useRef(window.matchMedia('(pointer: coarse)').matches);

  useEffect(() => {
    setVisible(true);

    const timeout = setTimeout(() => {
      setVisible(false);
      clearTimeout(timeout);
    }, onMobile.current ? 3500 : 5500);

    return () => clearTimeout(timeout);
  }, [ location ]);

  const scrollToContent = () => {
    const target = document.getElementById('Page_Content_Details');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
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
      viewport={{ once: true }}
      className="absolute bottom-6 right-1 transform -translate-x-1/2 z-10 bg-slate-900/70 text-white p-2 sm:p-3 rounded-full border-2 border-slate-400 shadow-lg"
      aria-label="Scroll to projects"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
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
