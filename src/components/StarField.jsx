'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';

const StarFieldCanvas = dynamic(() => import('./StarFieldCanvas'), { ssr: false });

export default function StarField() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion === true) return null;
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <StarFieldCanvas />
    </div>
  );
}
