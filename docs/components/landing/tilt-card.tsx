'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. Default 8. */
  max?: number;
}

export function TiltCard({ children, className = '', max = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ry = (x / rect.width - 0.5) * (max * 2);
    const rx = (y / rect.height - 0.5) * -(max * 2);
    el.style.setProperty('--rx', `${rx}deg`);
    el.style.setProperty('--ry', `${ry}deg`);
    el.style.setProperty('--gx', `${(x / rect.width) * 100}%`);
    el.style.setProperty('--gy', `${(y / rect.height) * 100}%`);
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative transition-transform duration-300 ease-out [transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] motion-reduce:transform-none ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(400px circle at var(--gx, 50%) var(--gy, 50%), color-mix(in srgb, var(--color-fd-primary) 18%, transparent), transparent 60%)',
          borderRadius: 'inherit',
        }}
      />
      {children}
    </div>
  );
}
