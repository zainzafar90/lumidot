'use client';

import React from 'react';
import { COLORS, PATTERNS, SYNC_PATTERNS, WAVE_DIRECTIONS } from './types';
import type { LumidotDirection, LumidotPattern, LumidotProps, LumidotWaveDirection } from './types';
import './styles.css';

export type { LumidotProps, LumidotVariant, LumidotPattern, LumidotDirection } from './types';
export { PATTERNS, COLORS, SYNC_PATTERNS, WAVE_DIRECTIONS } from './types';

const GRID = 3;
const DOT_INDICES = Array.from({ length: 9 }, (_, i) => i);

function brighten(hex: string, amount = 0.5): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lift = (c: number) => Math.round(c + (255 - c) * amount).toString(16).padStart(2, '0');
  return `#${lift(r)}${lift(g)}${lift(b)}`;
}

function glowShadow(glow: number, color: string): string {
  if (glow <= 0) return 'none';
  const bright = brighten(color);
  return `0 0 ${glow * 0.4}px ${color}, 0 0 ${glow}px ${bright}60`;
}

function waveDelay(index: number, direction: LumidotDirection | LumidotWaveDirection, duration: number): number {
  const col = index % GRID;
  const row = Math.floor(index / GRID);
  const step = duration / 5;
  const max = GRID - 1;

  switch (direction) {
    case 'ltr':
      return (col + row) * step;
    case 'rtl':
      return (max - col + row) * step;
    case 'ttb':
      return (row + col) * step;
    case 'btt':
      return (max - row + col) * step;
    case 'lr':
      return col * step;
    case 'rl':
      return (max - col) * step;
    case 'tb':
      return row * step;
    case 'bt':
      return (max - row) * step;
    default:
      return (col + row) * step;
  }
}

function orientFrames(
  frames: readonly (readonly number[])[],
  direction: LumidotDirection,
): readonly (readonly number[])[] {
  if (frames.length <= 1) return frames;
  if (direction === 'rtl' || direction === 'btt') return [...frames].reverse();
  return frames;
}

function useReducedMotion(enabled: boolean): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [enabled]);

  return reduced;
}

const Lumidot = React.forwardRef<HTMLSpanElement, LumidotProps>(
  (
    {
      variant = 'blue',
      pattern = 'all',
      glow = 8,
      scale = 1,
      duration = 0.7,
      direction = 'ltr',
      className,
      style,
      testId,
    },
    ref,
  ) => {
    const color = COLORS[variant] ?? COLORS.blue;
    const size = 20 * scale;
    const dotSize = size / GRID;
    const shadow = glowShadow(glow, color);

    const rawFrames = PATTERNS[pattern] ?? PATTERNS.all;
    const isSequence = rawFrames.length > 1;

    const frames = React.useMemo(
      () => orientFrames(rawFrames, direction),
      [rawFrames, direction],
    );

    const allDots = React.useMemo(
      () => new Set<number>(frames.flat()),
      [frames],
    );

    const isSync = SYNC_PATTERNS.has(pattern);
    const waveDir = (WAVE_DIRECTIONS as Partial<Record<LumidotPattern, LumidotWaveDirection>>)[pattern] ?? direction;
    const fadeIn = 37;

    const [frame, setFrame] = React.useState(0);
    const reduced = useReducedMotion(isSequence);

    React.useEffect(() => {
      if (!isSequence) return;
      setFrame(0);
      if (frames.length <= 1 || reduced) return;
      const id = window.setInterval(
        () => setFrame((prev) => (prev + 1) % frames.length),
        1250,
      );
      return () => window.clearInterval(id);
    }, [frames, reduced, isSequence]);

    const active = React.useMemo(() => {
      if (!isSequence) return new Set<number>(rawFrames[0]);
      if (reduced || frames.length <= 1) return allDots;
      return new Set<number>(frames[frame % frames.length]);
    }, [isSequence, rawFrames, reduced, frames, frame, allDots]);

    const dotStyles = React.useMemo(
      () =>
        DOT_INDICES.map((i) => {
          const on = active.has(i);

          if (isSequence) {
            return {
              width: dotSize,
              height: dotSize,
              backgroundColor: allDots.has(i) ? color : 'transparent',
              boxShadow: allDots.has(i) ? shadow : 'none',
              opacity: on ? 1 : 0,
              transform: on ? 'scale(1)' : 'scale(0.7)',
              transition:
                frames.length > 1 && !reduced
                  ? `opacity ${on ? fadeIn : 250}ms ${on ? 'ease-out' : 'ease-in'}, transform 250ms ease`
                  : undefined,
            };
          }

          return {
            width: dotSize,
            height: dotSize,
            backgroundColor: on ? color : 'transparent',
            boxShadow: on ? shadow : 'none',
            '--lumidot-delay': `${on ? (isSync ? 0 : waveDelay(i, waveDir, duration)) : 0}s`,
            '--lumidot-duration': `${duration}s`,
          } as React.CSSProperties;
        }),
      [active, color, dotSize, duration, waveDir, fadeIn, frames.length, shadow, isSequence, isSync, allDots, reduced],
    );

    return (
      <span
        ref={ref}
        role="status"
        aria-label="Loading"
        data-lumidot=""
        data-lumidot-pattern={pattern}
        data-lumidot-variant={variant}
        data-lumidot-direction={direction}
        data-lumidot-mode={isSequence ? 'sequence' : 'wave'}
        data-testid={testId}
        className={className}
        style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${GRID}, 1fr)`,
          placeItems: 'center',
          width: size,
          height: size,
          ...style,
        }}
      >
        {DOT_INDICES.map((i) => (
          <span
            key={i}
            data-lumidot-dot=""
            data-lumidot-dot-active={active.has(i)}
            style={dotStyles[i]}
          />
        ))}
      </span>
    );
  },
);

Lumidot.displayName = 'Lumidot';

export { Lumidot };
