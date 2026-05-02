'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { projectCollections, projects } from '@/data/projects';

export default function ProjectGrid({ collection }) {
  const list = (projects[collection] || []).slice().sort((a, b) => {
    if (!!b.starred !== !!a.starred) return b.starred ? 1 : -1;
    if (b.startDate !== a.startDate)
      return new Date(b.startDate) - new Date(a.startDate);
    return a.title.localeCompare(b.title);
  });
  const meta = projectCollections.find((c) => c.key === collection);
  const collectionDescription = meta?.description;
  const collectionLabel = meta?.label || collection.replace('-', ' ').toUpperCase();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 text-white">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-rose-300/70">
          Collection
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight">
          {collectionLabel}
        </h1>
        {collectionDescription ? (
          <p className="mt-4 max-w-3xl text-white/70 leading-relaxed">
            {collectionDescription}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map(({ id, title, img, link, startDate, endDate }, idx) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            whileHover={{ y: -4 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              delay: Math.min(idx * 0.05, 0.4),
            }}
            className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5"
          >
            <Link href={link}>
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={img}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h2 className="text-xl font-semibold text-white">{title}</h2>
                  <time className="text-xs text-white/60">
                    {startDate && endDate
                      ? `${startDate} — ${endDate}`
                      : startDate}
                  </time>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
