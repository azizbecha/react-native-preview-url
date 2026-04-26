import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  direction?: 'left' | 'right';
  /** Seconds per loop. */
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  direction = 'left',
  speed = 40,
  className = '',
  pauseOnHover = true,
}: Props) {
  return (
    <div
      className={`group relative flex w-full overflow-hidden [--gap:1.5rem] ${className}`}
      style={{ ['--duration' as string]: `${speed}s` }}
    >
      <div
        className={`flex shrink-0 items-stretch gap-(--gap) pr-(--gap) ${
          direction === 'left'
            ? 'motion-safe:animate-marquee-left'
            : 'motion-safe:animate-marquee-right'
        } ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={`flex shrink-0 items-stretch gap-(--gap) pr-(--gap) ${
          direction === 'left'
            ? 'motion-safe:animate-marquee-left'
            : 'motion-safe:animate-marquee-right'
        } ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
      >
        {children}
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-fd-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-fd-background to-transparent" />
    </div>
  );
}
