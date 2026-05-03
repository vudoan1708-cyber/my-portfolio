'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { projectCollections, projects } from '@/data/projects';

function buildAllProjects() {
  return Object.entries(projects).flatMap(([collectionKey, list]) =>
    list.map((p) => ({ ...p, collectionKey }))
  );
}

function buildTechIndex(allProjects) {
  const byId = new Map();
  for (const project of allProjects) {
    for (const tech of project.technologies || []) {
      const existing = byId.get(tech.id);
      if (existing) {
        existing.count += 1;
        existing.collections.add(project.collectionKey);
      } else {
        byId.set(tech.id, {
          id: tech.id,
          name: tech.name,
          img: tech.img,
          count: 1,
          collections: new Set([project.collectionKey]),
        });
      }
    }
  }
  const items = Array.from(byId.values()).map((t) => ({
    ...t,
    category:
      t.collections.size === 1 && t.collections.has('designs')
        ? 'design'
        : 'tech',
  }));
  return items.sort((a, b) => {
    if (a.category !== b.category) return a.category === 'tech' ? -1 : 1;
    if (b.count !== a.count) return b.count - a.count;
    return a.name.localeCompare(b.name);
  });
}

function parsePathSlugs(pathname) {
  const match = pathname.match(/^\/portfolio\/skills\/([^/?#]+)/);
  if (!match) return [];
  return decodeURIComponent(match[1])
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function buildSkillsUrl(ids) {
  if (ids.length === 0) return '/portfolio';
  return `/portfolio/skills/${ids.join(',')}`;
}

export default function PortfolioCollections() {
  const pathname = usePathname();
  const sectionRef = useRef(null);
  const allProjects = useMemo(buildAllProjects, []);
  const techList = useMemo(() => buildTechIndex(allProjects), [allProjects]);
  const validIds = useMemo(
    () => new Set(techList.map((t) => t.id)),
    [techList]
  );

  const selected = useMemo(() => {
    const ids = parsePathSlugs(pathname).filter((id) => validIds.has(id));
    return new Set(ids);
  }, [pathname, validIds]);

  const navigateForSelection = (nextSet) => {
    if (typeof window === 'undefined') return;
    const ids = techList.map((t) => t.id).filter((id) => nextSet.has(id));
    const url = buildSkillsUrl(ids);
    if (window.location.pathname === url) return;
    window.history.pushState({}, '', url);
  };

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    navigateForSelection(next);
  };
  const clear = () => {
    navigateForSelection(new Set());
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const ids = parsePathSlugs(window.location.pathname);
    if (ids.length === 0) return undefined;
    const timer = window.setTimeout(() => {
      if (window.scrollY > 50) return;
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 750);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredProjects = useMemo(() => {
    if (selected.size === 0) return [];
    return allProjects
      .filter((p) =>
        (p.technologies || []).some((t) => selected.has(t.id))
      )
      .sort((a, b) => {
        if (!!b.starred !== !!a.starred) return b.starred ? 1 : -1;
        if (b.startDate !== a.startDate)
          return new Date(b.startDate) - new Date(a.startDate);
        return a.title.localeCompare(b.title);
      });
  }, [allProjects, selected]);

  const filtering = selected.size > 0;

  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-8 py-20">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-rose-300/70">
          Selected work
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">
          {filtering ? 'Filtered results' : 'Browse by collection'}
        </h2>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between gap-4 mb-3">
          <p className="text-xs uppercase tracking-[0.25em] text-white/50">
            Filter by technology
          </p>
          {filtering && (
            <button
              type="button"
              onClick={clear}
              className="text-xs text-rose-300 hover:text-rose-200 transition-colors"
            >
              Clear ({selected.size})
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {techList.map((tech) => {
            const active = selected.has(tech.id);
            return (
              <button
                key={tech.id}
                type="button"
                onClick={() => toggle(tech.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ring-1 transition-colors ${
                  active
                    ? 'bg-rose-500 text-white ring-rose-400'
                    : 'bg-white/5 text-white/80 ring-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tech.img ? (
                  <span className="relative w-4 h-4 rounded-sm overflow-hidden bg-white/10">
                    <Image
                      src={tech.img}
                      alt=""
                      fill
                      sizes="16px"
                      className="object-contain"
                    />
                  </span>
                ) : null}
                <span>{tech.name}</span>
                <span className={active ? 'text-white/80' : 'text-white/40'}>
                  {tech.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filtering ? (
          <motion.div
            key="filtered"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            {filteredProjects.length === 0 ? (
              <p className="text-white/60">
                No projects match the selected criteria.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, idx) => (
                  <motion.div
                    key={`${project.collectionKey}-${project.id}`}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      delay: Math.min(idx * 0.04, 0.3),
                    }}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5"
                  >
                    <Link href={project.link} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={project.img}
                          alt={project.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <p className="text-[10px] uppercase tracking-[0.25em] text-rose-300/80">
                            {projectCollections.find(
                              (c) => c.key === project.collectionKey
                            )?.label || project.collectionKey}
                          </p>
                          <h3 className="text-xl font-semibold text-white tracking-tight mt-1">
                            {project.title}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {(project.technologies || [])
                              .filter((t) => selected.has(t.id))
                              .map((t) => (
                                <span
                                  key={t.id}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/30"
                                >
                                  {t.name}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="collections"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projectCollections.map((collection, idx) => (
              <motion.div
                key={collection.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{ y: -4 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  delay: Math.min(idx * 0.08, 0.4),
                }}
                className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5"
              >
                <Link href={`/portfolio/${collection.key}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={collection.img}
                      alt={collection.label}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {collection.label}
                      </h3>
                      <p className="text-sm text-white/60 mt-1 line-clamp-2">
                        {collection.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
