import chalk from 'chalk';
import isUnicodeSupported from 'is-unicode-supported';
import { CLEAR_LINE, CURSOR_UP, BRAILLE_BITS, BRAILLE_CHARS, ASCII_SHADES } from './utilities.js';

const unicode = isUnicodeSupported();

export function buildFrame(bright, rows, cols, { chalkFn, text, linesRendered }) {
  if (unicode) {
    return buildBrailleFrame(bright, rows, cols, { chalkFn, text, linesRendered });
  }
  return buildAsciiFrame(bright, rows, cols, { chalkFn, text, linesRendered });
}

function buildBrailleFrame(bright, rows, cols, { chalkFn, text, linesRendered }) {
  const brailleRows = Math.ceil(rows / 4);
  const brailleCols = Math.ceil(cols / 2);
  const textRow = Math.floor(brailleRows / 2);

  let out = linesRendered > 0 ? CURSOR_UP(linesRendered - 1) + '\r' : '';

  for (let br = 0; br < brailleRows; br++) {
    let line = '';
    for (let bc = 0; bc < brailleCols; bc++) {
      let bits = 0, sum = 0, count = 0;
      for (let dc = 0; dc < 2; dc++) {
        for (let dr = 0; dr < 4; dr++) {
          const gr = br * 4 + dr, gc = bc * 2 + dc;
          if (gr >= rows || gc >= cols) continue;
          const b = bright[gr * cols + gc];
          if (b > 0.4) bits |= BRAILLE_BITS[dc][dr];
          sum += b; count++;
        }
      }
      const avg = count > 0 ? sum / count : 0;
      const char = BRAILLE_CHARS[bits];
      line += avg > 0.6 ? chalkFn(char) : chalk.dim(chalkFn(char));
    }
    if (br === textRow && text) line += ` ${text}`;
    out += CLEAR_LINE + line;
    if (br < brailleRows - 1) out += '\n';
  }

  return { output: out, lineCount: brailleRows };
}

function buildAsciiFrame(bright, rows, cols, { chalkFn, text, linesRendered }) {
  const textRow = Math.floor(rows / 2);
  let out = linesRendered > 0 ? CURSOR_UP(linesRendered - 1) + '\r' : '';

  for (let r = 0; r < rows; r++) {
    let line = '';
    for (let c = 0; c < cols; c++) {
      const b = bright[r * cols + c];
      const idx = b < 0.2 ? 0 : b < 0.4 ? 1 : b < 0.7 ? 2 : 3;
      const char = ASCII_SHADES[idx];
      line += idx >= 2 ? chalkFn(char) : chalk.dim(chalkFn(char));
    }
    if (r === textRow && text) line += ` ${text}`;
    out += CLEAR_LINE + line;
    if (r < rows - 1) out += '\n';
  }

  return { output: out, lineCount: rows };
}
