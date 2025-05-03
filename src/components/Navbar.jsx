import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import NavItem from './NavItem';

import Avatar from './Avatar';

export default function Navbar() {
  const [showMiniAvatar, setShowMiniAvatar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const triggerHeight = 100; // adjust based on avatar size/position
      setShowMiniAvatar(window.scrollY > window.innerHeight - triggerHeight);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="bg-black fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4">
      <div className="flex items-center space-x-3">
        <motion.div
          layoutId="avatar"
          className="overflow-hidden rounded-full"
          style={{ width: 48, height: 48 }}
          animate={{ opacity: showMiniAvatar ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Avatar src="/images/avatar.webp" alt="My avatar image on nav bar" size="sm" />
        </motion.div>
        <motion.span
          className="text-slate-50"
          animate={{ position: showMiniAvatar ? 'relative' : 'absolute', left: showMiniAvatar ? '1px' : '-2px' }}
          transition={{ duration: 0.3 }}>
          Vu Doan
        </motion.span>
      </div>
      <ul className="flex space-x-8 items-center">
        <NavItem to="/portfolio" label="Portfolio" />
        <NavItem to="/blog"  label="Blog" />
        <NavItem to="/resume" label="Resume" />
      </ul>
    </nav>
  );
}
