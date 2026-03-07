export type PatternName =
  | 'solo-center' | 'solo-tl' | 'solo-br'
  | 'line-h-top' | 'line-h-mid' | 'line-h-bot'
  | 'line-v-left' | 'line-v-mid' | 'line-v-right'
  | 'line-diag-1' | 'line-diag-2'
  | 'corners-only' | 'corners-sync' | 'plus-hollow'
  | 'l-tl' | 'l-tr' | 'l-bl' | 'l-br'
  | 't-top' | 't-bot' | 't-left' | 't-right'
  | 'duo-h' | 'duo-v' | 'duo-diag'
  | 'frame' | 'frame-sync'
  | 'sparse-1' | 'sparse-2' | 'sparse-3'
  | 'wave-lr' | 'wave-rl' | 'wave-tb' | 'wave-bt'
  | 'spiral' | 'all';

export type ChalkStyle = (text: string) => string;
export type Color = ChalkStyle | (string & {});

export type Direction = 'ltr' | 'rtl' | 'ttb' | 'btt' | 'lr' | 'rl' | 'tb' | 'bt';

export declare const PATTERN_NAMES: PatternName[];
export declare const SYNC_PATTERNS: Set<string>;
export declare const DURATION_MS: number;
export declare const SEQ_INTERVAL_MS: number;
export declare const RENDER_INTERVAL_MS: number;
export declare const INACTIVE_BRIGHTNESS: number;

export declare function resolveDirection(pattern: string): Direction;
export declare function cosineBrightness(phase: number): number;
export declare function getPatternFrames(pattern: string, rows: number, cols: number, direction: Direction): number[][];
export declare function waveDelay(index: number, direction: Direction, duration: number, cols: number, rows: number): number;



export interface LumitermOptions {
  pattern?: PatternName;
  color?: Color;
  text?: string;
  rows?: number;
  cols?: number;
  stream?: NodeJS.WriteStream;
}

export interface FrameResult {
  output: string;
  lineCount: number;
}

export declare class Lumiterm {
  constructor(options?: LumitermOptions);
  get text(): string;
  set text(value: string);
  get color(): ChalkStyle;
  set color(value: Color);
  get pattern(): PatternName;
  set pattern(value: PatternName);
  get isSpinning(): boolean;
  frame(): FrameResult;
  start(text?: string): this;
  stop(): this;
  succeed(text?: string): this;
  fail(text?: string): this;
  warn(text?: string): this;
  info(text?: string): this;
}

export declare function lumiterm(options?: LumitermOptions | string): Lumiterm;
