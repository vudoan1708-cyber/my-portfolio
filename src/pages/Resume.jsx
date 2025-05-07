import React from 'react';

export default function Resume() {
  const cvURL = 'https://raw.githubusercontent.com/vudoan1708-cyber/logos/main/portfolio/resume/CV.pdf';
  return (
    <>
      <header className="flex justify-end items-center mb-4 text-sm text-white/75">
        <a className="anchor_highlight" target="_blank" href={cvURL} rel="noreferrer">Download the CV</a>
      </header>
      <div className="w-full h-screen rounded-xl overflow-hidden shadow-inner">
        <iframe
          title="CV"
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(cvURL)}&embedded=true`}
          width="100%"
          height="100%"
          frameBorder="0"
          className="w-full h-full"
        />
      </div>
    </>
  );
}
