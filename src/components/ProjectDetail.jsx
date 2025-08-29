import React from 'react';
import { useParams } from 'react-router-dom';

import { motion } from 'framer-motion';

import { Tooltip } from 'react-tooltip';

import ProjectImageGallery from './ProjectImageGallery';
import VideoDisplay from './VideoDisplay';

import { projects } from '../data/projects';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { collection, projectKey } = useParams();

  const project = (projects[collection] || []).find((p) => p.key === projectKey);
  if (!project) return <p className="p-8 text-gray-300">Project not found.</p>;

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
  const createRole = () => {
    if (project.role) {
      return (
        <div>
          <h2 className="font-bold">Role</h2>
          <p className="w-fit break-words">{project.role}</p>
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
          <p className="w-fit break-words">{project.projectType}</p>
        </div>
      );
    }
    return null;
  };
  const createProjectDetailBlockWithLinks = ({ target = 'projectCode' }) => {
    if (project[target]) {
      return (
        <div>
          <h2 className="font-bold">{project[target].title}</h2>
          {
            project[target].links?.length > 0
              ? (
                  project[target].links.map((item, idx) => (
                    <>
                      <a target="_blank" href={item.link} rel="noreferrer">{item.label}</a>
                      <span>{idx === project[target].links.length - 1 ? '' : ' + '}</span>
                    </>
                  ))
                )
              : <a target="_blank" href={project[target].link} rel="noreferrer">{project[target].label}</a>
          }
        </div>
      );
    }
    return null;
  };
  const createProjectShowcaseVideo = () => {
    if (project.videos.length > 0) {
      return (
        <div className="flex flex-row flex-wrap gap-12">
          {project.videos.map((video, idx) => (
            <div key={idx}>
              <h2 className="font-bold">{video.title}</h2>
              <VideoDisplay video={video} />
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  const createProjectTechnologies = () => {
    if (project.technologies.length > 0) {
      return (
        <div className="flex flex-row flex-wrap items-center gap-12">
          {project.technologies.map((tech) => (
            <>
              <motion.a
                key={tech.id}
                className="w-12"
                target="_blank"
                href={tech.link}
                rel="noreferrer"
                data-tooltip-id={tech.id}
                data-tooltip-content={tech.name}
                whileHover={{ scale: 1.05, opacity: .9 }}
                transition={{ type: 'spring', stiffness: 300 }}>
                <img id={tech.id} src={tech.img} alt={tech.name} />
              </motion.a>
              <Tooltip id={tech.id} />
            </>
          ))}
        </div>
      );
    }
    return null;
  };
  const createProjectApiIntegrations = () => {
    if (project.apis.length > 0) {
      return (
        <div className="flex flex-row flex-wrap items-center gap-12">
          {project.apis.map((api) => (
            <>
              <motion.a
                key={api.id}
                className={`w-12 ${api.tailwindCssClass ?? ''}`}
                target="_blank"
                href={api.link}
                rel="noreferrer"
                data-tooltip-id={api.id}
                data-tooltip-content={api.name}
                whileHover={{ scale: 1.05, opacity: .9 }}
                transition={{ type: 'spring', stiffness: 300 }}>
                <img id={api.id} src={api.img} alt={api.name} />
              </motion.a>
              <Tooltip id={api.id} />
            </>
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
    <div className="relative min-h-svh bg-black text-gray-300">
      {/* Project header with blurred bottom overlay and title */}
      <div
        className="relative w-full h-[calc(100svh-4rem)] top-8 bg-center bg-cover bg-absolute rounded"
        style={{ backgroundImage: `url(${project['img-lg'] ?? project.img})` }}
      >
        {/* Half-screen blur overlay */}
        <div className="absolute bottom-0 left-0 w-full h-1/6 bg-gradient-to-t from-black/40 to-transparent backdrop-blur-xs" />
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/75 to-transparent backdrop-blur-md px-4 py-2 rounded">
          <h1 className="text-5xl font-bold text-gray-300">{project.title}</h1>
        </div>
      </div>

      <div id="project_detail_body" className="mt-12">
        <div className="flex flex-row flex-wrap gap-12 prose prose-invert max-w-screen py-12 px-6 text-gray-300">
          {createProjectDate()}
          {createRole()}
          {createProjectType()}
          {createProjectDetailBlockWithLinks({ target: 'projectCode' })}
          {createProjectDetailBlockWithLinks({ target: 'projectLog' })}
          {createProjectDetailBlockWithLinks({ target: 'projectURL' })}
          {createProjectDetailBlockWithLinks({ target: 'report' })}
          {createProjectShowcaseVideo()}
        </div>
        <div className="flex flex-row flex-wrap gap-12 prose prose-invert max-w-3xl py-12 px-6 text-gray-300">
          {createProjectTechnologies()}
          {createProjectApiIntegrations()}
        </div>
        <div className="prose prose-invert max-w-3xl py-12 px-6 text-gray-300">
          {createProjectDescription()}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 py-12 px-6">
        {createImageGallery()}
      </div>
    </div>
  );
}
