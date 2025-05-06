import React from 'react';
import { motion } from 'framer-motion';

export default function Bio() {
  const blocks = [
    'A competitive but also receptive, an innovative and curious individual with a productive and positive mindset.',
    'I always think curiosity will decide our knowledge and I’m eager to be a part of a team that values the curious and enthusiastic minds.',
    'When working in small groups, I am able to motivate my teammates, lift their mood and influence them with my positivity.',
    'Aside from the busyness, I also play guitar, sing songs and “produce” music in my spare time. I go to the gym everyday to get fit, release stress and to also help myself come up with solutions when I’m away from problems.',
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">Explore My Portfolio</h1>
      {
        blocks.map((block, idx) => (
          <motion.p
            key={idx}
            className="leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}>
            {block}
          </motion.p>
        ))
      }
    </div>
  );
}
