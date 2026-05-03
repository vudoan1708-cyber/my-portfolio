export default function Avatar({ alt, size }) {
  const isLg = size === 'lg';
  const dims = isLg ? 'w-56 h-56 md:w-64 md:h-64' : 'w-12 h-12';
  const ringPad = isLg ? 'p-[3px]' : 'p-[2px]';
  const glow = isLg ? 'shadow-[0_0_70px_rgba(244,114,182,0.55)]' : 'shadow-md';
  const fontSize = isLg ? 'text-7xl md:text-8xl' : 'text-lg';
  return (
    <div
      role="img"
      aria-label={alt}
      className={`${dims} ${ringPad} ${glow} relative rounded-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-pink-500`}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-rose-950 via-fuchsia-950 to-pink-950 flex items-center justify-center">
        <span
          aria-hidden="true"
          className={`${fontSize} font-bold tracking-tight text-white leading-none select-none`}
        >
          VD
        </span>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(252,165,165,0.35),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_85%,rgba(136,19,55,0.4),transparent_50%)]" />
      </div>
    </div>
  );
}
