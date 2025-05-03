import React from 'react';

export default function Resume() {
  return (
    <section className="mb-12 section-card">
      <h2 className="text-4xl font-bold mb-6 text-red-600">Resume</h2>
      <div className="w-full h-screen rounded-xl overflow-hidden shadow-inner">
        <embed src="/resume.pdf" type="application/pdf" width="100%" height="100%" />
      </div>
    </section>
  );
}
