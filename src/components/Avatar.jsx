import React from 'react';

export default function Avatar({ src, alt, size }) {
  // 'lg' is for intro, 'sm' is for navbar
  const dims = size === 'lg' ? 'w-64 h-64' : 'w-12 h-12';
  return (
    <div className={`${dims} rounded-full overflow-hidden border-4 border-white shadow-2xl`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
