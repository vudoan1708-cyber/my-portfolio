'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

function formatDateRange(startDate, endDate, current) {
  const end = current ? 'Present' : endDate || 'Present';
  if (!startDate) return end;
  return `${startDate} — ${end}`;
}

export default function ExperienceStrip({
  experiences,
  selected,
  heading = 'Experience',
}) {
  if (!experiences || experiences.length === 0) return null;

  const filtering = selected && selected.size > 0;
  const visible = filtering
    ? experiences.filter((exp) =>
        (exp.technologies || []).some((t) => selected.has(t.id))
      )
    : experiences;

  if (visible.length === 0) return null;

  return (
    <section className="mb-12">
      <p className="text-xs uppercase tracking-[0.3em] text-rose-300/70 mb-3">
        {heading}
      </p>
      <div className="space-y-4">
        {visible.map((exp, idx) => (
          <motion.article
            key={exp.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] p-5 sm:p-6"
          >
            <div className="grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-5">
              {exp.logo ? (
                <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 sm:row-span-2 rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5">
                  <Image
                    src={exp.logo}
                    alt={`${exp.company} logo`}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </div>
              ) : null}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                    {exp.role}
                    <span className="text-white/50 font-normal"> · </span>
                    {exp.companyURL ? (
                      <a
                        href={exp.companyURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-300 hover:text-rose-200 transition-colors"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      <span className="text-rose-300">{exp.company}</span>
                    )}
                  </h3>
                  {exp.current && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Current role
                    </span>
                  )}
                </div>

                <p className="text-xs text-white/50 mt-1">
                  {[
                    formatDateRange(exp.startDate, exp.endDate, exp.current),
                    exp.location,
                    exp.employmentType,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 sm:col-start-2 min-w-0">
                {exp.summary && (
                  <p className="text-sm text-white/80 leading-relaxed mt-3">
                    {exp.summary}
                  </p>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {exp.technologies.map((tech) => {
                      const active = selected && selected.has(tech.id);
                      return (
                        <span
                          key={tech.id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ring-1 ${
                            active
                              ? 'bg-rose-500/20 text-rose-100 ring-rose-400/50'
                              : 'bg-white/5 text-white/75 ring-white/10'
                          }`}
                        >
                          {tech.img ? (
                            <span className="relative w-3.5 h-3.5 rounded-sm overflow-hidden bg-white/10">
                              <Image
                                src={tech.img}
                                alt=""
                                fill
                                sizes="14px"
                                className="object-contain"
                              />
                            </span>
                          ) : null}
                          <span>{tech.name}</span>
                        </span>
                      );
                    })}
                  </div>
                )}

                {exp.relatedProjects && exp.relatedProjects.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 text-xs">
                    <span className="uppercase tracking-[0.2em] text-white/45">
                      Related work
                    </span>
                    {exp.relatedProjects.map((project, i) => (
                      <span key={project.key} className="inline-flex items-center gap-3">
                        <Link
                          href={project.link}
                          className="text-white/75 hover:text-rose-200 underline-offset-4 hover:underline transition-colors"
                        >
                          {project.title}
                        </Link>
                        {i < exp.relatedProjects.length - 1 && (
                          <span aria-hidden="true" className="text-white/20">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
