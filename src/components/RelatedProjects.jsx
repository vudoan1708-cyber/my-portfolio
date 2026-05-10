'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import TechBadge from './TechBadge';

export default function RelatedProjects({ related }) {
  if (!related?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-12 pb-20">
      <h2 className="text-sm uppercase tracking-[0.2em] text-rose-300/70 mb-6">
        Related projects
      </h2>
      <ul
        className="
          flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          gap-4
          overflow-x-auto md:overflow-visible
          snap-x snap-mandatory md:snap-none
          pb-4 md:pb-0
          -mx-6 sm:-mx-12 md:mx-0
          px-6 sm:px-12 md:px-0
          [scrollbar-width:thin]
        "
      >
        {related.map((p, idx) => (
          <motion.li
            key={p.uid}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            whileHover={{ y: -4 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              delay: Math.min(idx * 0.05, 0.3),
            }}
            className="
              flex-shrink-0 md:flex-shrink
              w-[78vw] sm:w-72 md:w-auto
              snap-start
              group relative overflow-hidden rounded-2xl
              ring-1 ring-white/10 bg-white/5
              list-none
            "
          >
            <Link href={p.link} aria-label={`View ${p.title}`}>
              <div className="relative aspect-[4/3] md:h-64 md:aspect-auto overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 78vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                  <h3 className="text-base font-semibold text-white leading-tight">
                    {p.title}
                  </h3>
                  {p.sharedTechs?.length > 0 ? (
                    <div className="flex flex-row flex-wrap items-center gap-1.5">
                      {p.sharedTechs.slice(0, 4).map((tech) => (
                        <TechBadge
                          key={tech.id}
                          tech={tech}
                          size="sm"
                          className="backdrop-blur-sm"
                        />
                      ))}
                      {p.sharedTechs.length > 4 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium text-white/60">
                          +{p.sharedTechs.length - 4}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
