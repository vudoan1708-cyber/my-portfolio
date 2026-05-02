'use client';

import { motion } from 'framer-motion';

const blocks = [
  'A competitive but receptive, innovative and curious individual with a productive and positive mindset.',
  'I believe curiosity decides our knowledge — and I’m eager to be part of teams that value curious, enthusiastic minds.',
  'In small groups I motivate teammates, lift the mood, and influence the room with positivity.',
  'Outside work I play guitar, sing, and produce music. I train every day — it keeps me focused and helps me solve problems away from the screen.',
];

export default function Bio() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-rose-300/80 mb-2">
          Software Engineer · Leeds, UK
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Hi, I’m Vu.
        </h1>
      </div>
      {blocks.map((block, idx) => (
        <motion.p
          key={idx}
          className="leading-relaxed text-white/85"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: idx * 0.15 }}
        >
          {block}
        </motion.p>
      ))}
    </div>
  );
}
