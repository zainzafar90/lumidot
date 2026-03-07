export const PATTERN_NAMES = [
  'solo-center', 'solo-tl', 'solo-br',
  'line-h-top', 'line-h-mid', 'line-h-bot',
  'line-v-left', 'line-v-mid', 'line-v-right',
  'line-diag-1', 'line-diag-2',
  'corners-only', 'corners-sync', 'plus-hollow',
  'l-tl', 'l-tr', 'l-bl', 'l-br',
  't-top', 't-bot', 't-left', 't-right',
  'duo-h', 'duo-v', 'duo-diag',
  'frame', 'frame-sync',
  'sparse-1', 'sparse-2', 'sparse-3',
  'wave-lr', 'wave-rl', 'wave-tb', 'wave-bt',
  'spiral', 'all',
];

export const SYNC_PATTERNS = new Set(['corners-sync', 'frame-sync']);

const WAVE_DIRECTIONS = { 'wave-lr': 'lr', 'wave-rl': 'rl', 'wave-tb': 'tb', 'wave-bt': 'bt' };

function topRow(_rows, cols)    { return Array.from({ length: cols }, (_, c) => c); }
function bottomRow(rows, cols)  { return Array.from({ length: cols }, (_, c) => (rows - 1) * cols + c); }
function leftCol(rows, _cols)   { return Array.from({ length: rows }, (_, r) => r * _cols); }
function rightCol(rows, cols)   { return Array.from({ length: rows }, (_, r) => r * cols + (cols - 1)); }
function midRow(rows, cols)     { return Array.from({ length: cols }, (_, c) => Math.floor(rows / 2) * cols + c); }
function midCol(rows, cols)     { return Array.from({ length: rows }, (_, r) => r * cols + Math.floor(cols / 2)); }
function center(rows, cols)     { return Math.floor(rows / 2) * cols + Math.floor(cols / 2); }
function diag1(rows, cols)      { return Array.from({ length: Math.min(rows, cols) }, (_, i) => i * cols + i); }
function diag2(rows, cols)      { return Array.from({ length: Math.min(rows, cols) }, (_, i) => i * cols + (cols - 1 - i)); }
function allIndices(rows, cols) { return Array.from({ length: rows * cols }, (_, i) => i); }

function perimeter(rows, cols) {
  if (rows <= 1 && cols <= 1) return [0];
  const set = new Set();
  topRow(rows, cols).forEach(i => set.add(i));
  rightCol(rows, cols).forEach(i => set.add(i));
  bottomRow(rows, cols).forEach(i => set.add(i));
  leftCol(rows, cols).forEach(i => set.add(i));
  return Array.from(set);
}

function perimeterOrdered(rows, cols) {
  if (rows < 2 || cols < 2) return rows * cols === 1 ? [0] : topRow(rows, cols).concat(bottomRow(rows, cols));
  return [
    ...topRow(rows, cols),
    ...rightCol(rows, cols).slice(1),
    ...bottomRow(rows, cols).slice(0, -1).reverse(),
    ...leftCol(rows, cols).slice(1, -1).reverse(),
  ];
}

function spiralFrames(rows, cols) {
  if (rows < 2 || cols < 2) return [[0]];
  return [topRow(rows, cols), rightCol(rows, cols), bottomRow(rows, cols).reverse(), leftCol(rows, cols).reverse()];
}

export function resolveDirection(pattern) {
  return WAVE_DIRECTIONS[pattern] ?? 'ltr';
}

export function getPatternFrames(pattern, rows, cols, direction) {
  const total = rows * cols;
  switch (pattern) {
    case 'solo-center': return [[center(rows, cols)]];
    case 'solo-tl':     return [[0]];
    case 'solo-br':     return [[total - 1]];
    case 'line-h-top':  return [topRow(rows, cols)];
    case 'line-h-mid':  return [midRow(rows, cols)];
    case 'line-h-bot':  return [bottomRow(rows, cols)];
    case 'line-v-left': return [leftCol(rows, cols)];
    case 'line-v-mid':  return [midCol(rows, cols)];
    case 'line-v-right':return [rightCol(rows, cols)];
    case 'line-diag-1': return [diag1(rows, cols)];
    case 'line-diag-2': return [diag2(rows, cols)];
    case 'corners-only': {
      const [tl, tr, br, bl] = [0, cols - 1, total - 1, (rows - 1) * cols];
      return [[tl], [tr], [br], [bl]];
    }
    case 'corners-sync': {
      const [tl, tr, br, bl] = [0, cols - 1, total - 1, (rows - 1) * cols];
      return [[tl, tr, br, bl]];
    }
    case 'plus-hollow': {
      const t = Math.floor(cols / 2);
      const r = Math.floor(rows / 2) * cols + (cols - 1);
      const b = (rows - 1) * cols + Math.floor(cols / 2);
      const l = Math.floor(rows / 2) * cols;
      return [[t], [r], [b], [l]];
    }
    case 'l-tl': return [[...new Set([...topRow(rows, cols), ...leftCol(rows, cols)])]];
    case 'l-tr': return [[...new Set([...topRow(rows, cols), ...rightCol(rows, cols)])]];
    case 'l-bl': return [[...new Set([...bottomRow(rows, cols), ...leftCol(rows, cols)])]];
    case 'l-br': return [[...new Set([...bottomRow(rows, cols), ...rightCol(rows, cols)])]];
    case 't-top':  return [[...new Set([...topRow(rows, cols), ...midCol(rows, cols)])]];
    case 't-bot':  return [[...new Set([...bottomRow(rows, cols), ...midCol(rows, cols)])]];
    case 't-left': return [[...new Set([...leftCol(rows, cols), ...midRow(rows, cols)])]];
    case 't-right':return [[...new Set([...rightCol(rows, cols), ...midRow(rows, cols)])]];
    case 'duo-h':  return [[Math.floor(rows / 2) * cols, Math.floor(rows / 2) * cols + (cols - 1)]];
    case 'duo-v':  return [[Math.floor(cols / 2), (rows - 1) * cols + Math.floor(cols / 2)]];
    case 'duo-diag':    return [[0, total - 1]];
    case 'frame':       return [perimeterOrdered(rows, cols)];
    case 'frame-sync':  return [perimeter(rows, cols)];
    case 'sparse-1':    return [diag1(rows, cols)];
    case 'sparse-2':    return [[cols - 1, Math.floor(rows / 2) * cols, (rows - 1) * cols + Math.floor(cols / 2)]];
    case 'sparse-3':    return [[Math.floor(cols / 2), Math.floor(rows / 2) * cols + (cols - 1), (rows - 1) * cols]];
    case 'all':
    case 'wave-lr':
    case 'wave-rl':
    case 'wave-tb':
    case 'wave-bt':
      return [allIndices(rows, cols)];
    case 'spiral': {
      const rev = direction === 'rtl' || direction === 'btt';
      const frames = spiralFrames(rows, cols);
      return rev ? [...frames].reverse() : frames;
    }
    default: return [allIndices(rows, cols)];
  }
}
