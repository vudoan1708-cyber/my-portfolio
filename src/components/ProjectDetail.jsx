import React from 'react';
import { useParams } from 'react-router-dom';

// lookup function: find the project in your data
import { projects } from '../data/projects';

export default function ProjectDetail() {
  const { collection, projectKey } = useParams();

  const project = (projects[collection] || []).find((p) => p.key === projectKey);
  if (!project) return <p className="p-8 text-white">Project not found.</p>;

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Project header with blurred bottom overlay and title */}
      <div
        className="relative w-full h-screen bg-center bg-cover bg-absolute"
        style={{ backgroundImage: `url(${project.img})` }}
      >
        {/* Title overlay */}
        <div className="absolute bottom-1/4 left-0 w-full bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md px-4 py-2 rounded">
          <h1 className="text-5xl font-bold text-white">{project.title}</h1>
        </div>
      </div>
      <div className="prose prose-invert max-w-3xl mx-auto py-12 px-6 text-white">
        <p>Project description goes here...</p>
      </div>
    </div>
  );
}
