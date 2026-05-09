'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

function extractYouTubeId(link) {
  if (typeof link !== 'string') return null;
  const watchMatch = link.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];
  const embedMatch = link.match(/\/embed\/([^?&/]+)/);
  if (embedMatch) return embedMatch[1];
  return null;
}

export default function VideoDisplay({ video }) {
  const placeholderRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [renderedInIframe, setRenderedInIframe] = useState(false);

  useEffect(() => {
    setMounted(true);
    const node = placeholderRef.current;
    if (node && node.ownerDocument !== document) {
      setRenderedInIframe(true);
    }
  }, []);

  if (!mounted) {
    return (
      <div
        ref={placeholderRef}
        className="relative w-full aspect-video rounded-lg bg-white/5 ring-1 ring-white/10"
      />
    );
  }

  if (video.source === 'youtube') {
    const videoId = extractYouTubeId(video.link);

    if (renderedInIframe && videoId) {
      const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const fallbackThumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
      return (
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block w-full aspect-video rounded-lg overflow-hidden shadow-xl ring-1 ring-white/10 group"
          aria-label={
            video.title ? `Open ${video.title} on YouTube` : 'Open on YouTube'
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbUrl}
            alt={video.title || 'YouTube video'}
            className="w-full h-full object-cover"
            onError={(e) => {
              if (e.currentTarget.src !== fallbackThumbUrl) {
                e.currentTarget.src = fallbackThumbUrl;
              }
            }}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/90 flex items-center justify-center shadow-2xl">
              <Play className="w-7 h-7 text-white fill-white ml-0.5" />
            </div>
          </div>
        </a>
      );
    }

    const base = video.link.includes('watch?v=')
      ? video.link.replace('watch?v=', 'embed/')
      : video.link;
    const noCookie = base.replace(
      /https?:\/\/(www\.)?youtube\.com/,
      'https://www.youtube-nocookie.com',
    );
    const src = `${noCookie}?rel=0`;
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl ring-1 ring-white/10">
        <iframe
          src={src}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          title={video.title}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <video
      src={video.link}
      playsInline
      controls
      className="w-full h-auto rounded-lg shadow-xl ring-1 ring-white/10"
    />
  );
}
