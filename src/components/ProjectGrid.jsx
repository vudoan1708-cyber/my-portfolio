import React from 'react';

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

import { projectCollections, projects } from '../data/projects';

export default function ProjectGrid({ collection }) {
  const list = (projects[collection] || [])
    .sort((a, b) => {
      // newest first
      if (b.startDate !== a.startDate) return new Date(b.startDate) - new Date(a.startDate);
      // tie-break: alphabetical
      return a.title.localeCompare(b.title);
    });
  const collectionDescription = projectCollections.find((coll) => coll.key === collection)?.description;

  return (
    <div className="w-full px-4 sm:px-8 py-12 text-white">
      <h3 className="text-3xl font-semibold mb-6 text-white">{collection.replace('-', ' ').toUpperCase()}</h3>
      {collectionDescription ? <p className="mb-6">{collectionDescription}</p> : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {list.map(({ id, title, img, link, startDate, endDate }, idx) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 * (idx + 1) } }}
            viewport={{ once: true, margin: '-50px' }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.05, opacity: .9 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="block overflow-hidden rounded-lg shadow-xl ring-1 ring-white/20"
          >
            <NavLink
              key={id}
              to={link}
            >
              <div className="h-96 overflow-hidden">
                <img
                  src={img}
                  alt={title}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="mt-4 px-2">
                <h4 className="text-xl font-semibold">{title}</h4>
                <time className="text-sm text-gray-400">
                  {
                    startDate && endDate
                    ? `${startDate} - ${endDate}`
                    : startDate
                  }
                </time>
              </div>
            </NavLink>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
