'use client';

import Image from 'next/image';

const SIZE_STYLES = {
  sm: {
    container: 'gap-1.5 px-2.5 py-1 text-[11px]',
    iconWrap: 'w-3.5 h-3.5',
    iconSizes: '14px',
  },
  md: {
    container: 'gap-2 px-3 py-1.5 text-xs',
    iconWrap: 'w-4 h-4',
    iconSizes: '16px',
  },
};

const VARIANT_STYLES = {
  default: 'bg-white/5 text-white/80 ring-white/10',
  // Soft rose tint for read-only "this matches" indicators (e.g. ExperienceStrip).
  activeSoft: 'bg-rose-500/20 text-rose-100 ring-rose-400/50',
  // Solid rose for interactive toggles in the on-state (e.g. filter pills).
  activeSolid: 'bg-rose-500 text-white ring-rose-400',
};

const COUNT_TONE = {
  default: 'text-white/40',
  activeSoft: 'text-rose-200/80',
  activeSolid: 'text-white/80',
};

export default function TechBadge({
  tech,
  size = 'sm',
  variant = 'default',
  count,
  interactive = false,
  as,
  className = '',
  ...rest
}) {
  const Component = as ?? (interactive ? 'button' : 'span');
  const sizing = SIZE_STYLES[size] ?? SIZE_STYLES.sm;
  const variantClass = VARIANT_STYLES[variant] ?? VARIANT_STYLES.default;
  const hoverClass =
    interactive && variant === 'default'
      ? 'hover:bg-white/10 hover:text-white'
      : '';

  return (
    <Component
      className={[
        'inline-flex items-center font-medium rounded-full ring-1 transition-colors',
        sizing.container,
        variantClass,
        hoverClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {tech.img ? (
        <span
          className={`relative ${sizing.iconWrap} rounded-sm overflow-hidden ${tech.tailwindCssClass ?? ''}`}
        >
          <Image
            src={tech.img}
            alt=""
            fill
            sizes={sizing.iconSizes}
            className="object-contain"
          />
        </span>
      ) : null}
      <span>{tech.name}</span>
      {typeof count === 'number' ? (
        <span className={COUNT_TONE[variant] ?? COUNT_TONE.default}>
          {count}
        </span>
      ) : null}
    </Component>
  );
}
