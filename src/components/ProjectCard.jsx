import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectCard({ index }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center text-gray-400 font-semibold"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      Placeholder {index}
    </motion.div>
  );
}
