import type { CSSProperties } from 'react';

export const PATTERN_NAMES = [
  'solo-center',
  'solo-tl',
  'solo-br',
  'line-h-top',
  'line-h-mid',
  'line-h-bot',
  'line-v-left',
  'line-v-mid',
  'line-v-right',
  'line-diag-1',
  'line-diag-2',
  'corners-only',
  'corners-sync',
  'plus-hollow',
  'l-tl',
  'l-tr',
  'l-bl',
  'l-br',
  't-top',
  't-bot',
  't-left',
  't-right',
  'duo-h',
  'duo-v',
  'duo-diag',
  'frame',
  'frame-sync',
  'sparse-1',
  'sparse-2',
  'sparse-3',
  'wave-lr',
  'wave-rl',
  'wave-tb',
  'wave-bt',
  'spiral',
  'all',
] as const;

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
export type LumidotPattern = (typeof PATTERN_NAMES)[number];
export type LumidotDirection = 'ltr' | 'rtl' | 'ttb' | 'btt';
export type LumidotWaveDirection = (typeof WAVE_DIRECTIONS)[keyof typeof WAVE_DIRECTIONS];

export interface LumidotProps {
  variant?: LumidotVariant;
  pattern?: LumidotPattern;
  rows?: number;
  cols?: number;
  glow?: number;
  scale?: number;
  duration?: number;
  direction?: LumidotDirection;
  className?: string;
  style?: CSSProperties;
  testId?: string;
}
