'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { tracks } from '@/data/music';

export default function MusicList() {
  const [expanded, setExpanded] = useState({});

  return (
    <div id="music_detail_body" className="max-w-6xl mx-auto py-20 px-4 sm:px-8">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-rose-300/70">
          Original work
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mt-2">
          Music production
        </h1>
        <p className="text-white/60 mt-4 max-w-xl mx-auto">
          A collection of original, cinematic compositions written alongside my
          engineering work — each piece intended to capture a particular feeling
          or moment.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {tracks.map((track, idx) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: Math.min(idx * 0.1, 0.4) }}
            className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden ring-1 ring-white/10"
          >
            <div className="relative w-full h-56">
              <Image
                src={track.img}
                alt={track.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-5 flex flex-col items-center">
              <h2 className="text-lg font-semibold text-white mb-3">
                {track.title}
              </h2>
              <audio controls src={track.src} className="w-full" />
            </div>
            <div className="border-t border-white/10">
              <button
                className="w-full flex justify-center items-center py-2 text-white/70 hover:text-white transition cursor-pointer"
                onClick={() =>
                  setExpanded((object) => ({
                    ...object,
                    [track.id]: !object[track.id],
                  }))
                }
                aria-expanded={!!expanded[track.id]}
                aria-label={`Toggle description for ${track.title}`}
              >
                <ChevronDown
                  className={`transform transition-transform ${
                    expanded[track.id] ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {expanded[track.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-gray-300 leading-6 space-y-2">
                      {track.description.map((desc, i) => (
                        <p
                          key={i}
                          dangerouslySetInnerHTML={{ __html: desc }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
