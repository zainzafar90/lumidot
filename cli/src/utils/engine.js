import { DURATION_MS, INACTIVE_BRIGHTNESS } from './utilities.js';

export function cosineBrightness(phase) {
  return 0.22 + 0.78 * (0.5 - 0.5 * Math.cos(2 * Math.PI * phase));
}

export function waveDelay(index, direction, duration, cols, rows) {
  const col = index % cols;
  const row = Math.floor(index / cols);
  const step = duration / Math.max(5, cols + rows - 2);
  const maxCol = cols - 1;
  const maxRow = rows - 1;
  switch (direction) {
    case 'ltr': return (col + row) * step;
    case 'rtl': return (maxCol - col + row) * step;
    case 'ttb': return (row + col) * step;
    case 'btt': return (maxRow - row + col) * step;
    case 'lr':  return col * step;
    case 'rl':  return (maxCol - col) * step;
    case 'tb':  return row * step;
    case 'bt':  return (maxRow - row) * step;
    default:    return (col + row) * step;
  }
}

export function computeBrightness(bright, { rows, cols, allDots, activeDots, isSequence, isSync, waveDelays, startTime, now }) {
  for (let i = 0; i < rows * cols; i++) {
    if (!allDots.has(i)) { bright[i] = 0; continue; }
    if (isSequence) {
      bright[i] = activeDots.has(i) ? 1.0 : INACTIVE_BRIGHTNESS;
    } else {
      const delayMs = isSync ? 0 : waveDelays[i];
      const elapsed = ((now - startTime - delayMs) % DURATION_MS + DURATION_MS) % DURATION_MS;
      bright[i] = cosineBrightness(elapsed / DURATION_MS);
    }
  }
}
