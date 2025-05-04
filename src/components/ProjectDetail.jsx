import React from 'react';
import { useParams } from 'react-router-dom';

// lookup function: find the project in your data
import { projects } from '../data/projects';
import ProjectImageGallery from './ProjectImageGallery';

export default function ProjectDetail() {
  const { collection, projectKey } = useParams();

  const project = (projects[collection] || []).find((p) => p.key === projectKey);
  if (!project) return <p className="p-8 text-white">Project not found.</p>;

  const createProjectDate = () => {
    if (project.startDate && project.endDate) {
      return (
        <div>
          <h2 className="font-bold">Date</h2>
          <p>{project.startDate} - {project.endDate}</p>
        </div>
      );
    }

    if (project.startDate) {
      return (
        <div>
          <h2 className="font-bold">Start date</h2>
          <p>{project.startDate}</p>
        </div>
      );
    }
    return null;
  };
  const createProjectType = () => {
    if (project.projectType) {
      return (
        <div>
          <h2 className="font-bold">Project type</h2>
          <p>{project.projectType}</p>
        </div>
      );
    }
    return null;
  };
  const createProjectCode = () => {
    if (project.projectCode) {
      return (
        <div>
          <h2 className="font-bold">Project code</h2>
          <a target="_blank" href={project.projectCode.link} rel="noreferrer">{project.projectCode.title}</a>
        </div>
      );
    }
    return null;
  };
  const createProjectTechnologies = () => {
    if (project.technologies.length > 0) {
      return (
        <div className="flex flex-row flex-wrap gap-12">
          {project.technologies.map((tech) => (
            <a key={tech.id} className="w-12" target="_blank" href={tech.link} rel="noreferrer">
              <img id={tech.id} src={tech.img} alt={tech.name} />
            </a>
          ))}
        </div>
      );
    }
    return null;
  };
  const createProjectDescription = () => {
    if (project.description.length > 0) {
      return (
        <div>
          {project.description.map((desc, idx) => (
            <p key={idx} dangerouslySetInnerHTML={{__html: desc}}></p>
          ))}
        </div>
      );
    }
    return null;
  };
  const createImageGallery = () => {
    if (project.gallery.length > 0) {
      return <ProjectImageGallery gallery={project.gallery} />;
    }
    return null;
  };

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

      <div>
        <div className="flex flex-row flex-wrap gap-24 prose prose-invert max-w-3xl py-12 px-6 text-white">
          {createProjectDate()}
          {createProjectType()}
          {createProjectCode()}
        </div>
        <div className="flex flex-row flex-wrap gap-12 prose prose-invert max-w-3xl py-12 px-6 text-white">
          {createProjectTechnologies()}
        </div>
        <div className="prose prose-invert max-w-3xl py-12 px-6 text-white">
          {createProjectDescription()}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 py-12 px-6">
        {createImageGallery()}
      </div>
    </div>
  );
}
