'use client';

export default function VideoDisplay({ video }) {
  if (video.source === 'youtube') {
    const src = video.link.includes('watch?v=')
      ? video.link.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1&loop=1'
      : video.link + '?autoplay=1&mute=1&loop=1';
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl ring-1 ring-white/10">
        <iframe
          src={src}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          title={video.title}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }
  return (
    <video
      src={video.link}
      autoPlay
      muted
      loop
      playsInline
      controls
      className="w-full h-auto rounded-lg shadow-xl ring-1 ring-white/10"
    />
  );
}
