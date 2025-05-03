import React from 'react';
import SocialLinks from './SocialLinks';

export default function Footer() {
  return (
    <footer className="py-12 mt-16 bg-black text-gray-800">
      <div className="container mx-auto text-center">
        <h3 className="text-2xl mb-4 text-slate-50">Contact Me</h3>
        <SocialLinks />
      </div>
    </footer>
  );
}
