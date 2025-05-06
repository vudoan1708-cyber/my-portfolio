import React, { useState } from 'react';

import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { tracks } from '../data/music';

export default function Music() {
  const [ expanded, setExpanded ] = useState({});
  return (
    <div id="music_detail_body" className="max-w-5xl mx-auto py-12 px-4">
      <h2 className="text-4xl font-semibold mb-8 text-white text-center">
        My Music Production
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={track.img}
              alt={track.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col items-center">
              <h3 className="text-xl font-medium text-white mb-2">{track.title}</h3>
              <audio
                controls
                src={track.src}
                className="w-full"
              />
            </div>

            <div className="bg-white/25">
              <div
                className="flex justify-center items-center cursor-pointer"
                onClick={() => setExpanded((object) => ({ ...object, [track.id]: !object[track.id] }))}
              >
                <ChevronDown className={`transform transition-transform ${expanded[track.id] ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {expanded[track.id] && (
                  track.description.map((desc, idx) => (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-gray-300 mx-2 leading-6 overflow-hidden"
                        key={idx}
                        dangerouslySetInnerHTML={{__html: desc}}
                      >
                      </motion.p>
                    ))
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
