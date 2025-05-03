import React from 'react';

import { projects } from '../data/projects';

export default function ProjectGrid({ collection }) {
  const list = projects[collection] || [];

  return (
    <div>
      <h3 className="text-3xl font-semibold mb-6 text-white">{collection.replace('-', ' ').toUpperCase()}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((item) => (
          <div
            key={item.id}
            className="bg-white bg-opacity-10 rounded-lg overflow-hidden shadow-lg"
          >
            <img src={item.img} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-4 text-white font-medium">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
