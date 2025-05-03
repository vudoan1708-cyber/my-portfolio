import React from 'react';
import ProjectCard from '../components/ProjectCard';

export function Portfolio({ title }) {
  return (
    <section className="mb-12 section-card">
      <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map(i => <ProjectCard key={i} index={i} />)}
      </div>
    </section>
  );
}

export const WebApps     = () => <Portfolio title="Web Apps" />;
export const Games       = () => <Portfolio title="Games" />;
export const Utilities   = () => <Portfolio title="Utilities" />;
export const AIProjects  = () => <Portfolio title="AI Projects" />;
