'use client';

import { motion } from 'framer-motion';

const blocks = [
  'A driven and inquisitive software engineer with a collaborative, solutions-oriented mindset.',
  'I believe curiosity is the foundation of growth, and I gravitate towards teams that value rigorous thinking, continuous learning, and shared ownership.',
  'I take pride in supporting my colleagues, fostering a positive team culture, and helping move the work forward with clarity and momentum.',
  'Outside of work, I play guitar, sing, and produce music. I train daily — it keeps me focused and often surfaces ideas I would not have reached at the keyboard.',
];

export default function Bio() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-rose-300/80 mb-2">
          Software Engineer · Leeds, UK
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Hello, I’m Vu.
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
