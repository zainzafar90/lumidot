import type { CSSProperties } from 'react';

type DotIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type DotFrame = readonly DotIndex[];
type PatternFrames = readonly DotFrame[];

const FULL_GRID: DotFrame = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const CORNERS: DotFrame = [0, 2, 6, 8];
const FRAME_RING: DotFrame = [0, 1, 2, 5, 8, 7, 6, 3];

export const PATTERNS = {
  // Solo
  'solo-center': [[4]],
  'solo-tl': [[0]],
  'solo-br': [[8]],

  // Lines
  'line-h-top': [[0, 1, 2]],
  'line-h-mid': [[3, 4, 5]],
  'line-h-bot': [[6, 7, 8]],
  'line-v-left': [[0, 3, 6]],
  'line-v-mid': [[1, 4, 7]],
  'line-v-right': [[2, 5, 8]],
  'line-diag-1': [[0, 4, 8]],
  'line-diag-2': [[2, 4, 6]],

  // Corner and cross
  'corners-only': [[0], [2], [8], [6]],
  'corners-sync': [CORNERS],
  'plus-hollow': [[1], [3], [5], [7]],

  // Shapes
  'l-tl': [[0, 3, 6, 7, 8]],
  'l-tr': [[2, 5, 6, 7, 8]],
  'l-bl': [[0, 1, 2, 3, 6]],
  'l-br': [[0, 1, 2, 5, 8]],
  't-top': [[0, 1, 2, 4, 7]],
  't-bot': [[1, 4, 6, 7, 8]],
  't-left': [[0, 1, 3, 6, 7]],
  't-right': [[1, 2, 5, 7, 8]],

  // Duo
  'duo-h': [[3, 5]],
  'duo-v': [[1, 7]],
  'duo-diag': [[0, 8]],

  // Frame
  frame: [FRAME_RING],
  'frame-sync': [[0, 1, 2, 3, 5, 6, 7, 8]],

  // Sparse
  'sparse-1': [[0, 4, 8]],
  'sparse-2': [[2, 3, 7]],
  'sparse-3': [[1, 5, 6]],

  // Wave
  'wave-lr': [FULL_GRID],
  'wave-rl': [FULL_GRID],
  'wave-tb': [FULL_GRID],
  'wave-bt': [FULL_GRID],

  // Sequence
  spiral: [[0, 1, 2], [2, 5, 8], [8, 7, 6], [6, 3, 0]],

  // Fallback/default
  all: [FULL_GRID],
} as const satisfies Record<string, PatternFrames>;

export const SYNC_PATTERNS = new Set<string>(['corners-sync', 'frame-sync']);

export const WAVE_DIRECTIONS = {
  'wave-lr': 'lr',
  'wave-rl': 'rl',
  'wave-tb': 'tb',
  'wave-bt': 'bt',
} as const;

export const COLORS = {
  amber: '#fcd34d',
  blue: '#93c5fd',
  cyan: '#67e8f9',
  emerald: '#6ee7b7',
  fuchsia: '#f0abfc',
  green: '#86efac',
  indigo: '#a5b4fc',
  lime: '#bef264',
  orange: '#fdba74',
  pink: '#f9a8d4',
  purple: '#d8b4fe',
  red: '#fca5a5',
  rose: '#fda4af',
  sky: '#7dd3fc',
  slate: '#cbd5e1',
  teal: '#5eead4',
  violet: '#c4b5fd',
  white: '#ffffff',
  black: '#000000',
  yellow: '#fde047',
} as const;

export type LumidotVariant = keyof typeof COLORS;
export type LumidotPattern = keyof typeof PATTERNS;
export type LumidotDirection = 'ltr' | 'rtl' | 'ttb' | 'btt';
export type LumidotWaveDirection = (typeof WAVE_DIRECTIONS)[keyof typeof WAVE_DIRECTIONS];

export interface LumidotProps {
  variant?: LumidotVariant;
  pattern?: LumidotPattern;
  glow?: number;
  scale?: number;
  duration?: number;
  direction?: LumidotDirection;
  className?: string;
  style?: CSSProperties;
  testId?: string;
}
