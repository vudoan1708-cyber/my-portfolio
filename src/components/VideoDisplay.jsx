export default function VideoDisplay({ video }) {
  return (
    video.source === 'youtube'
      ? (
          <iframe
            src={video.link.includes('watch?v=')
              ? video.link.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1&loop=1'
              : video.link + '?autoplay=1&mute=1&loop=1'}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title={video.title} />
        )
      : (
        <video
          src={video.link}
          autoPlay
          muted
          loop
          playsInline
          controls
          className="w-full h-auto rounded-lg shadow-xl"
          onError={(e) => { console.error('Video load error:', e) }} />
        )
  )
}
