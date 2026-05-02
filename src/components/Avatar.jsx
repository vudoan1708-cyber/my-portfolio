import Image from 'next/image';

export default function Avatar({ src, alt, size }) {
  const isLg = size === 'lg';
  const dims = isLg ? 'w-56 h-56 md:w-64 md:h-64' : 'w-12 h-12';
  const px = isLg ? 256 : 48;
  return (
    <div
      className={`${dims} rounded-full overflow-hidden border-4 border-white/80 shadow-2xl ring-1 ring-black/40`}
    >
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        priority={isLg}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
