export const CLEAR_LINE = '\r\x1b[2K';
export const CURSOR_UP = n => n > 0 ? `\x1b[${n}A` : '';

export const DURATION_MS = 700;
export const SEQ_INTERVAL_MS = 1250;
export const RENDER_INTERVAL_MS = 80;
export const INACTIVE_BRIGHTNESS = 0.2;

export const BRAILLE_BITS = [[0x01, 0x02, 0x04, 0x40], [0x08, 0x10, 0x20, 0x80]];
export const BRAILLE_CHARS = Array.from({ length: 256 }, (_, i) => String.fromCodePoint(0x2800 + i));
export const ASCII_SHADES = [' ', '.', ':', '#'];
