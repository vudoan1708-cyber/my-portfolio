import React from 'react';

import { projects } from '../data/projects';
import { NavLink } from 'react-router-dom';

export default function ProjectGrid({ collection }) {
  const list = (projects[collection] || [])
    .sort((a, b) => {
      // newest first
      if (b.startDate !== a.startDate) return new Date(b.startDate) - new Date(a.startDate);
      // tie-break: alphabetical
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="w-full px-4 sm:px-8 py-12 text-white">
      <h3 className="text-3xl font-semibold mb-6 text-white">{collection.replace('-', ' ').toUpperCase()}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {list.map(({ id, title, img, link, startDate, endDate }) => (
          <NavLink
            key={id}
            to={link}
            className="block overflow-hidden rounded-lg shadow-xl ring-1 ring-white/20 hover:opacity-90 transition-opacity"
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
                   ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                   : new Date(startDate).toLocaleDateString()
                }
              </time>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
