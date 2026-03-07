import chalk from 'chalk';
import cliCursor from 'cli-cursor';
import { CLEAR_LINE, CURSOR_UP, DURATION_MS, SEQ_INTERVAL_MS, RENDER_INTERVAL_MS } from './utils/utilities.js';
import { SYNC_PATTERNS, resolveDirection, getPatternFrames } from './utils/patterns.js';
import { waveDelay, computeBrightness } from './utils/engine.js';
import { buildFrame } from './utils/renderer.js';

function resolveColor(v) {
  if (typeof v === 'function') return v;
  if (typeof v === 'string') {
    if (v.startsWith('#')) return chalk.hex(v);
    const rgbMatch = v.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (rgbMatch) return chalk.rgb(+rgbMatch[1], +rgbMatch[2], +rgbMatch[3]);
    if (chalk[v]) return chalk[v];
  }
  return chalk.blue;
}

export class Lumiterm {
  #pattern;
  #color;
  #text;
  #rows;
  #cols;
  #stream;

  #spinning = false;
  #renderTimer = null;
  #seqTimer = null;
  #seqFrame = 0;
  #startTime = 0;
  #linesRendered = 0;
  #cleanupBound = null;
  #backpressure = false;

  #direction;
  #frames;
  #allDots;
  #activeDots;
  #isSync;
  #chalkFn;
  #bright;
  #waveDelays;

  #originalWrite = null;
  #writeBuffer = '';

  constructor(options = {}) {
    this.#pattern = options.pattern ?? 'wave-lr';
    this.#color   = resolveColor(options.color ?? 'blue');
    this.#text    = options.text    ?? '';
    this.#rows    = options.rows    ?? 4;
    this.#cols    = options.cols    ?? 8;
    this.#stream  = options.stream  ?? process.stderr;

    this.#rebuildCache();
  }

  get text()      { return this.#text; }
  set text(v)     { this.#text = v; }

  get color()     { return this.#color; }
  set color(v)    { this.#color = resolveColor(v); this.#chalkFn = this.#color; }

  get pattern()   { return this.#pattern; }
  set pattern(v)  { this.#pattern = v; this.#seqFrame = 0; this.#startTime = Date.now(); this.#rebuildCache(); }

  get isSpinning(){ return this.#spinning; }

  frame() {
    const now = Date.now();
    computeBrightness(this.#bright, {
      rows: this.#rows,
      cols: this.#cols,
      allDots: this.#allDots,
      activeDots: this.#activeDots,
      isSequence: this.#frames.length > 1,
      isSync: this.#isSync,
      waveDelays: this.#waveDelays,
      startTime: this.#startTime,
      now,
    });

    return buildFrame(this.#bright, this.#rows, this.#cols, {
      chalkFn: this.#chalkFn,
      text: this.#text,
      linesRendered: this.#linesRendered,
    });
  }

  start(text) {
    if (this.#spinning) return this;
    if (text !== undefined) this.#text = text;
    this.#spinning  = true;
    this.#startTime = Date.now();
    this.#seqFrame  = 0;
    if (this.#stream.isTTY) {
      cliCursor.hide(this.#stream);
      this.#installCleanup();
      this.#hookStream();
      this.#renderTimer = setInterval(() => this.#render(), RENDER_INTERVAL_MS);
      this.#seqTimer    = setInterval(() => this.#tickSeq(), SEQ_INTERVAL_MS);
      this.#render();
    }
    return this;
  }

  stop() {
    if (!this.#spinning) return this;
    this.#spinning = false;
    this.#clearTimers();
    if (this.#stream.isTTY) {
      this.#stream.write(this.#clearRendered());
      this.#unhookStream();
      cliCursor.show(this.#stream);
      this.#removeCleanup();
    }
    return this;
  }

  succeed(text) { return this.#stopWith('\u2714', '\x1b[32m', text); }
  fail(text)    { return this.#stopWith('\u2716', '\x1b[31m', text); }
  warn(text)    { return this.#stopWith('\u26A0', '\x1b[33m', text); }
  info(text)    { return this.#stopWith('\u2139', '\x1b[34m', text); }

  #stopWith(symbol, colorCode, text) {
    if (text !== undefined) this.#text = text;
    this.#spinning = false;
    this.#clearTimers();
    const msg = this.#text ? `${colorCode}${symbol}\x1b[0m ${this.#text}` : `${colorCode}${symbol}\x1b[0m`;
    if (this.#stream.isTTY) {
      this.#stream.write(this.#clearRendered() + msg + '\n');
      this.#unhookStream();
      cliCursor.show(this.#stream);
      this.#removeCleanup();
    } else {
      this.#stream.write(msg + '\n');
    }
    return this;
  }

  #clearTimers() {
    if (this.#renderTimer) { clearInterval(this.#renderTimer); this.#renderTimer = null; }
    if (this.#seqTimer)    { clearInterval(this.#seqTimer);    this.#seqTimer    = null; }
  }

  #clearRendered() {
    const n = this.#linesRendered;
    this.#linesRendered = 0;
    if (n <= 1) return CLEAR_LINE;
    return CURSOR_UP(n - 1) + '\r\x1b[J';
  }

  #installCleanup() {
    this.#cleanupBound = () => {
      this.#clearTimers();
      this.#stream.write(this.#clearRendered());
      this.#unhookStream();
      cliCursor.show(this.#stream);
    };
    process.on('exit',    this.#cleanupBound);
    process.on('SIGINT',  this.#cleanupBound);
    process.on('SIGTERM', this.#cleanupBound);
  }

  #removeCleanup() {
    if (!this.#cleanupBound) return;
    process.removeListener('exit',    this.#cleanupBound);
    process.removeListener('SIGINT',  this.#cleanupBound);
    process.removeListener('SIGTERM', this.#cleanupBound);
    this.#cleanupBound = null;
  }

  #hookStream() {
    this.#originalWrite = this.#stream.write;
    this.#writeBuffer = '';
    this.#stream.write = (chunk, encoding, cb) => {
      if (typeof encoding === 'function') { cb = encoding; encoding = undefined; }
      this.#writeBuffer += typeof chunk === 'string' ? chunk : chunk.toString(encoding);
      if (cb) cb();
      return true;
    };
  }

  #unhookStream() {
    if (!this.#originalWrite) return;
    this.#stream.write = this.#originalWrite;
    if (this.#writeBuffer) {
      this.#stream.write(this.#writeBuffer);
      this.#writeBuffer = '';
    }
    this.#originalWrite = null;
  }

  #rebuildCache() {
    const { rows, cols } = { rows: this.#rows, cols: this.#cols };
    this.#direction   = resolveDirection(this.#pattern);
    this.#frames      = getPatternFrames(this.#pattern, rows, cols, this.#direction);
    this.#allDots     = new Set(this.#frames.flat());
    this.#activeDots  = new Set(this.#frames[0]);
    this.#isSync      = SYNC_PATTERNS.has(this.#pattern);
    this.#chalkFn     = this.#color;
    this.#bright      = new Float64Array(rows * cols);
    this.#waveDelays  = new Float64Array(rows * cols);
    for (let i = 0; i < rows * cols; i++) {
      this.#waveDelays[i] = waveDelay(i, this.#direction, DURATION_MS / 1000, cols, rows) * 1000;
    }
  }

  #tickSeq() {
    if (this.#frames.length > 1) {
      this.#seqFrame   = (this.#seqFrame + 1) % this.#frames.length;
      this.#activeDots = new Set(this.#frames[this.#seqFrame]);
    }
  }

  #render() {
    if (this.#backpressure) return;

    const { output, lineCount } = this.frame();
    this.#linesRendered = lineCount;

    const ok = this.#originalWrite.call(this.#stream, output);
    if (!ok) {
      this.#backpressure = true;
      this.#stream.once('drain', () => { this.#backpressure = false; });
    }
  }
}

export function lumiterm(options) {
  if (typeof options === 'string') return new Lumiterm({ text: options });
  return new Lumiterm(options);
}
