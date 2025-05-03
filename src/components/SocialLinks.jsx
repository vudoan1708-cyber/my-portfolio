import React from 'react';
import {
  EmailIcon,
  // LinkedInIcon,
  // GitHubIcon,
  // YouTubeIcon,
} from './icons';

export default function SocialLinks() {
  const links = [
    { href: 'mailto:your.email@example.com', icon: <EmailIcon /> },
    // { href: 'https://linkedin.com/in/yourprofile', icon: <LinkedInIcon /> },
    // { href: 'https://github.com/yourusername', icon: <GitHubIcon /> },
    // { href: 'https://youtube.com/yourchannel', icon: <YouTubeIcon /> },
  ];

  return (
    <div className="flex justify-center space-x-8 items-center text-indigo-800">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="transform hover:scale-110 transition-transform"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
