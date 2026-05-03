'use client';

import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

import ProjectImageGallery from './ProjectImageGallery';
import VideoDisplay from './VideoDisplay';

export default function ProjectDetail({ project }) {
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        <p>Project not found.</p>
      </div>
    );
  }

  const renderDate = () => {
    if (project.startDate && project.endDate) {
      return (
        <Field label="Date">
          <p>
            {project.startDate} — {project.endDate}
          </p>
        </Field>
      );
    }
    if (project.startDate) {
      return (
        <Field label="Start date">
          <p>{project.startDate}</p>
        </Field>
      );
    }
    return null;
  };

  const renderRole = () =>
    project.role ? (
      <Field label="Role">
        <p className="break-words">{project.role}</p>
      </Field>
    ) : null;

  const renderType = () =>
    project.projectType ? (
      <Field label="Project type">
        <p className="break-words">{project.projectType}</p>
      </Field>
    ) : null;

  const renderLinks = (target) => {
    if (!project[target]) return null;
    const block = project[target];
    return (
      <Field label={block.title}>
        {block.links?.length > 0 ? (
          <p>
            {block.links.map((item, idx) => (
              <span key={item.link}>
                <a target="_blank" href={item.link} rel="noreferrer">
                  {item.label}
                </a>
                {idx === block.links.length - 1 ? '' : ' + '}
              </span>
            ))}
          </p>
        ) : (
          <a target="_blank" href={block.link} rel="noreferrer">
            {block.label}
          </a>
        )}
      </Field>
    );
  };

  const renderVideos = () =>
    project.videos?.length > 0 ? (
      <div
        className={`grid gap-8 ${
          project.videos.length > 1
            ? 'lg:grid-cols-2'
            : 'grid-cols-1 max-w-3xl mx-auto'
        }`}
      >
        {project.videos.map((video, idx) => (
          <div key={idx} className="w-full">
            <h2 className="font-semibold text-rose-200/90 text-sm uppercase tracking-wider mb-2">
              {video.title}
            </h2>
            <VideoDisplay video={video} />
          </div>
        ))}
      </div>
    ) : null;

  const renderTechs = () =>
    project.technologies?.length > 0 ? (
      <div>
        <h2 className="text-sm uppercase tracking-[0.2em] text-rose-300/70 mb-4">
          Built with
        </h2>
        <div className="flex flex-row flex-wrap items-center gap-8">
          {project.technologies.map((tech) => (
            <div key={tech.id}>
              <motion.a
                className="block w-12"
                target="_blank"
                href={tech.link}
                rel="noreferrer"
                data-tooltip-id={tech.id}
                data-tooltip-content={tech.name}
                whileHover={{ scale: 1.1, opacity: 0.9 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img id={tech.id} src={tech.img} alt={tech.name} />
              </motion.a>
              <Tooltip id={tech.id} />
            </div>
          ))}
        </div>
      </div>
    ) : null;

  const renderApis = () =>
    project.apis?.length > 0 ? (
      <div>
        <h2 className="text-sm uppercase tracking-[0.2em] text-rose-300/70 mb-4">
          APIs
        </h2>
        <div className="flex flex-row flex-wrap items-center gap-8">
          {project.apis.map((api) => (
            <div key={api.id}>
              <motion.a
                className={`block w-12 ${api.tailwindCssClass ?? ''}`}
                target="_blank"
                href={api.link}
                rel="noreferrer"
                data-tooltip-id={api.id}
                data-tooltip-content={api.name}
                whileHover={{ scale: 1.1, opacity: 0.9 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img id={api.id} src={api.img} alt={api.name} />
              </motion.a>
              <Tooltip id={api.id} />
            </div>
          ))}
        </div>
      </div>
    ) : null;

  const renderDescription = () => {
    if (!(project.description?.length > 0)) return null;

    const groups = [];
    for (const desc of project.description) {
      const trimmed = desc.trim();
      const isListItem =
        trimmed.startsWith('<li>') && trimmed.endsWith('</li>');
      const last = groups[groups.length - 1];
      if (isListItem && last?.type === 'ul') {
        last.items.push(desc);
      } else if (isListItem) {
        groups.push({ type: 'ul', items: [desc] });
      } else {
        groups.push({ type: 'p', html: desc });
      }
    }

    return (
      <div className="space-y-3 leading-relaxed">
        {groups.map((g, idx) =>
          g.type === 'ul' ? (
            <ul
              key={idx}
              className="list-disc pl-6 space-y-2"
              dangerouslySetInnerHTML={{ __html: g.items.join('') }}
            />
          ) : (
            <p key={idx} dangerouslySetInnerHTML={{ __html: g.html }} />
          )
        )}
      </div>
    );
  };

  const renderGallery = () =>
    project.gallery?.length > 0 ? (
      <ProjectImageGallery gallery={project.gallery} />
    ) : null;

  return (
    <article className="relative min-h-svh text-gray-200">
      {/* Hero */}
      <div
        className="relative w-full h-svh bg-center bg-cover"
        style={{ backgroundImage: `url(${project['img-lg'] ?? project.img})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-12 pb-10">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-300/80 mb-3">
              {project.projectType ?? 'Project'}
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold text-white drop-shadow-2xl tracking-tight">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="project_detail_body max-w-6xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 py-12 border-b border-white/5">
          {renderDate()}
          {renderRole()}
          {renderType()}
          {renderLinks('projectCode')}
          {renderLinks('projectLog')}
          {renderLinks('projectURL')}
          {renderLinks('report')}
        </div>
      </div>

      {project.videos?.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="py-12 border-b border-white/5">{renderVideos()}</div>
        </div>
      )}

      <div className="project_detail_body max-w-6xl mx-auto px-6 sm:px-12">
        {(project.technologies?.length > 0 || project.apis?.length > 0) && (
          <div className="py-12 space-y-8 border-b border-white/5">
            {renderTechs()}
            {renderApis()}
          </div>
        )}

        {project.description?.length > 0 && (
          <div className="py-12 max-w-3xl prose prose-invert">
            {renderDescription()}
          </div>
        )}
      </div>

      {project.gallery?.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 sm:px-12 pb-20">
          <h2 className="text-sm uppercase tracking-[0.2em] text-rose-300/70 mb-6">
            Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {renderGallery()}
          </div>
        </div>
      )}
    </article>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <h2 className="text-xs uppercase tracking-[0.2em] text-rose-300/70 mb-2">
        {label}
      </h2>
      <div className="text-white/85 text-sm">{children}</div>
    </div>
  );
}
