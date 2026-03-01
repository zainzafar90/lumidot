'use client';

import React from 'react';
import { COLORS, SYNC_PATTERNS, WAVE_DIRECTIONS } from './types';
import type { LumidotDirection, LumidotPattern, LumidotProps, LumidotWaveDirection } from './types';
import './styles.css';

export type { LumidotProps, LumidotVariant, LumidotPattern, LumidotDirection } from './types';
export { PATTERN_NAMES, COLORS, SYNC_PATTERNS, WAVE_DIRECTIONS } from './types';

const DEFAULT_GRID = 3;

function topRow(rows: number, cols: number): number[] {
  return Array.from({ length: cols }, (_, c) => c);
}
function bottomRow(rows: number, cols: number): number[] {
  return Array.from({ length: cols }, (_, c) => (rows - 1) * cols + c);
}
function leftCol(rows: number, cols: number): number[] {
  return Array.from({ length: rows }, (_, r) => r * cols);
}
function rightCol(rows: number, cols: number): number[] {
  return Array.from({ length: rows }, (_, r) => r * cols + (cols - 1));
}
function midRow(rows: number, cols: number): number[] {
  const r = Math.floor(rows / 2);
  return Array.from({ length: cols }, (_, c) => r * cols + c);
}
function midCol(rows: number, cols: number): number[] {
  const c = Math.floor(cols / 2);
  return Array.from({ length: rows }, (_, r) => r * cols + c);
}
function center(rows: number, cols: number): number {
  return Math.floor(rows / 2) * cols + Math.floor(cols / 2);
}
function diag1(rows: number, cols: number): number[] {
  const n = Math.min(rows, cols);
  return Array.from({ length: n }, (_, i) => i * cols + i);
}
function diag2(rows: number, cols: number): number[] {
  const n = Math.min(rows, cols);
  return Array.from({ length: n }, (_, i) => i * cols + (cols - 1 - i));
}
function perimeter(rows: number, cols: number): number[] {
  if (rows <= 1 && cols <= 1) return [0];
  const set = new Set<number>();
  topRow(rows, cols).forEach((i) => set.add(i));
  rightCol(rows, cols).forEach((i) => set.add(i));
  bottomRow(rows, cols).forEach((i) => set.add(i));
  leftCol(rows, cols).forEach((i) => set.add(i));
  return Array.from(set);
}
function perimeterOrdered(rows: number, cols: number): number[] {
  if (rows < 2 || cols < 2) return rows * cols === 1 ? [0] : topRow(rows, cols).concat(bottomRow(rows, cols));
  const top = topRow(rows, cols);
  const right = rightCol(rows, cols).slice(1);
  const bottom = bottomRow(rows, cols).slice(0, -1).reverse();
  const left = leftCol(rows, cols).slice(1, -1).reverse();
  return [...top, ...right, ...bottom, ...left];
}
function spiralFrames(rows: number, cols: number): number[][] {
  if (rows < 2 || cols < 2) return [[0]];
  return [topRow(rows, cols), rightCol(rows, cols), bottomRow(rows, cols).reverse(), leftCol(rows, cols).reverse()];
}
function allIndices(rows: number, cols: number): number[] {
  return Array.from({ length: rows * cols }, (_, i) => i);
}

function getPatternFrames(pattern: string, rows: number, cols: number, direction: LumidotDirection): number[][] {
  const total = rows * cols;
  const rev = direction === 'rtl' || direction === 'btt';

  switch (pattern) {
    case 'solo-center':
      return [[center(rows, cols)]];
    case 'solo-tl':
      return [[0]];
    case 'solo-br':
      return [[total - 1]];

    case 'line-h-top':
      return [topRow(rows, cols)];
    case 'line-h-mid':
      return [midRow(rows, cols)];
    case 'line-h-bot':
      return [bottomRow(rows, cols)];
    case 'line-v-left':
      return [leftCol(rows, cols)];
    case 'line-v-mid':
      return [midCol(rows, cols)];
    case 'line-v-right':
      return [rightCol(rows, cols)];
    case 'line-diag-1':
      return [diag1(rows, cols)];
    case 'line-diag-2':
      return [diag2(rows, cols)];

    case 'corners-only': {
      const tl = 0;
      const tr = cols - 1;
      const br = total - 1;
      const bl = (rows - 1) * cols;
      return [[tl], [tr], [br], [bl]];
    }
    case 'corners-sync': {
      const tl = 0;
      const tr = cols - 1;
      const br = total - 1;
      const bl = (rows - 1) * cols;
      return [[tl, tr, br, bl]];
    }
    case 'plus-hollow': {
      const t = Math.floor(cols / 2);
      const r = Math.floor(rows / 2) * cols + (cols - 1);
      const b = (rows - 1) * cols + Math.floor(cols / 2);
      const l = Math.floor(rows / 2) * cols;
      return [[t], [r], [b], [l]];
    }

    case 'l-tl':
      return [[...new Set([...topRow(rows, cols), ...leftCol(rows, cols)])]];
    case 'l-tr':
      return [[...new Set([...topRow(rows, cols), ...rightCol(rows, cols)])]];
    case 'l-bl':
      return [[...new Set([...bottomRow(rows, cols), ...leftCol(rows, cols)])]];
    case 'l-br':
      return [[...new Set([...bottomRow(rows, cols), ...rightCol(rows, cols)])]];

    case 't-top':
      return [[...new Set([...topRow(rows, cols), ...midCol(rows, cols)])]];
    case 't-bot':
      return [[...new Set([...bottomRow(rows, cols), ...midCol(rows, cols)])]];
    case 't-left':
      return [[...new Set([...leftCol(rows, cols), ...midRow(rows, cols)])]];
    case 't-right':
      return [[...new Set([...rightCol(rows, cols), ...midRow(rows, cols)])]];

    case 'duo-h':
      return [[Math.floor(rows / 2) * cols, Math.floor(rows / 2) * cols + (cols - 1)]];
    case 'duo-v':
      return [[Math.floor(cols / 2), (rows - 1) * cols + Math.floor(cols / 2)]];
    case 'duo-diag':
      return [[0, total - 1]];

    case 'frame':
      return [perimeterOrdered(rows, cols)];
    case 'frame-sync':
      return [perimeter(rows, cols)];

    case 'sparse-1':
      return [diag1(rows, cols)];
    case 'sparse-2':
      return [[cols - 1, Math.floor(rows / 2) * cols, (rows - 1) * cols + Math.floor(cols / 2)]];
    case 'sparse-3':
      return [[Math.floor(cols / 2), Math.floor(rows / 2) * cols + (cols - 1), (rows - 1) * cols]];

    case 'all':
    case 'wave-lr':
    case 'wave-rl':
    case 'wave-tb':
    case 'wave-bt':
      return [allIndices(rows, cols)];

    case 'spiral': {
      const frames = spiralFrames(rows, cols);
      return rev ? [...frames].reverse() : frames;
    }

    default:
      return [allIndices(rows, cols)];
  }
}

function brighten(hex: string, amount = 0.5): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lift = (c: number) =>
    Math.round(c + (255 - c) * amount)
      .toString(16)
      .padStart(2, '0');
  return `#${lift(r)}${lift(g)}${lift(b)}`;
}

function glowShadow(glow: number, color: string): string {
  if (glow <= 0) return 'none';
  const bright = brighten(color);
  return `0 0 ${glow * 0.4}px ${color}, 0 0 ${glow}px ${bright}60`;
}

function waveDelay(
  index: number,
  direction: LumidotDirection | LumidotWaveDirection,
  duration: number,
  cols: number,
  rows: number,
): number {
  const col = index % cols;
  const row = Math.floor(index / cols);
  const step = duration / Math.max(5, cols + rows - 2);
  const maxCol = cols - 1;
  const maxRow = rows - 1;

  switch (direction) {
    case 'ltr':
      return (col + row) * step;
    case 'rtl':
      return (maxCol - col + row) * step;
    case 'ttb':
      return (row + col) * step;
    case 'btt':
      return (maxRow - row + col) * step;
    case 'lr':
      return col * step;
    case 'rl':
      return (maxCol - col) * step;
    case 'tb':
      return row * step;
    case 'bt':
      return (maxRow - row) * step;
    default:
      return (col + row) * step;
  }
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
      rows = DEFAULT_GRID,
      cols = DEFAULT_GRID,
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
    const totalDots = rows * cols;
    const dotIndices = React.useMemo(() => Array.from({ length: totalDots }, (_, i) => i), [totalDots]);
    const gridMax = Math.max(rows, cols);
    const dotSize = size / gridMax;
    const shadow = glowShadow(glow, color);

    const frames = React.useMemo(
      () => getPatternFrames(pattern, rows, cols, direction),
      [pattern, rows, cols, direction],
    );
    const isSequence = frames.length > 1;

    const allDots = React.useMemo(() => new Set<number>(frames.flat()), [frames]);

    const isSync = SYNC_PATTERNS.has(pattern);
    const waveDir = (WAVE_DIRECTIONS as Partial<Record<LumidotPattern, LumidotWaveDirection>>)[pattern] ?? direction;
    const fadeIn = 37;

    const [frame, setFrame] = React.useState(0);
    const reduced = useReducedMotion(isSequence);

    React.useEffect(() => {
      if (!isSequence) return;
      setFrame(0);
      if (frames.length <= 1 || reduced) return;
      const id = window.setInterval(() => setFrame((prev) => (prev + 1) % frames.length), 1250);
      return () => window.clearInterval(id);
    }, [frames, reduced, isSequence]);

    const active = React.useMemo(() => {
      if (!isSequence) return new Set<number>(frames[0]);
      if (reduced || frames.length <= 1) return allDots;
      return new Set<number>(frames[frame % frames.length]);
    }, [isSequence, frames, reduced, frame, allDots]);

    const dotStyles = React.useMemo(
      () =>
        dotIndices.map((i) => {
          const on = active.has(i);

          const base: React.CSSProperties = {
            display: 'block',
            width: dotSize,
            height: dotSize,
            minWidth: dotSize,
            minHeight: dotSize,
            boxSizing: 'border-box',
          };

          if (isSequence) {
            return {
              ...base,
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
            ...base,
            backgroundColor: on ? color : 'transparent',
            boxShadow: on ? shadow : 'none',
            '--lumidot-delay': `${on ? (isSync ? 0 : waveDelay(i, waveDir, duration, cols, rows)) : 0}s`,
            '--lumidot-duration': `${duration}s`,
          } as React.CSSProperties;
        }),
      [
        active,
        color,
        dotSize,
        duration,
        waveDir,
        fadeIn,
        frames.length,
        shadow,
        isSequence,
        isSync,
        allDots,
        reduced,
        dotIndices,
        cols,
        rows,
      ],
    );

    return (
      <span
        ref={ref}
        role="status"
        aria-label="Loading"
        data-lumidot=""
        data-lumidot-pattern={pattern}
        data-lumidot-variant={variant}
        data-lumidot-rows={rows}
        data-lumidot-cols={cols}
        data-lumidot-direction={direction}
        data-lumidot-mode={isSequence ? 'sequence' : 'wave'}
        data-testid={testId}
        className={className}
        style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${dotSize}px)`,
          gap: 0,
          width: cols * dotSize,
          height: rows * dotSize,
          lineHeight: 0,
          ...style,
        }}
      >
        {dotIndices.map((i) => (
          <span key={i} data-lumidot-dot="" data-lumidot-dot-active={active.has(i)} style={dotStyles[i]} />
        ))}
      </span>
    );
  },
);

Lumidot.displayName = 'Lumidot';

export { Lumidot };
