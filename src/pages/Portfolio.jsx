import React from 'react';
import { useNavigate, Outlet, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import ProjectGrid from '../components/ProjectGrid';

import { projectCollections } from '../data/projects';

export default function Portfolio() {
  const { collection } = useParams();
  const navigate = useNavigate();

  // If a collection slug is in the URL, show its projects:
  if (collection) {
    return <ProjectGrid collection={collection} />;
  }

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {projectCollections.map((collection, idx) => (
          <motion.div
            key={collection.key}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 * (idx + 1) } }}
            viewport={{ once: true, margin: '-50px' }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => navigate(`/portfolio/${collection.key}`)}
            className="relative break-inside-avoid cursor-pointer overflow-hidden rounded-xl shadow-lg"
          >
            <img
              src={collection.img}
              alt={collection.label}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{collection.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nested route outlet will render the individual ProjectGrid */}
      <div className="mt-12">
        <Outlet />
      </div>
    </div>
  );
}
