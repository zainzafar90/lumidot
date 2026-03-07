import { describe, it, expect } from 'vitest';
import { Writable } from 'node:stream';
import { Lumiterm, lumiterm, PATTERN_NAMES, resolveDirection, getPatternFrames } from '../index.js';
import { cosineBrightness } from '../src/utils/engine.js';

describe('cosineBrightness', () => {
  it('min at 0, max at 0.5, periodic', () => {
    expect(cosineBrightness(0)).toBeCloseTo(0.22);
    expect(cosineBrightness(0.5)).toBeCloseTo(1.0);
    expect(cosineBrightness(1.0)).toBeCloseTo(cosineBrightness(0));
  });
});

describe('patterns', () => {
  it('all 36 patterns produce valid frames within grid bounds', () => {
    expect(PATTERN_NAMES).toHaveLength(36);
    for (const name of PATTERN_NAMES) {
      const frames = getPatternFrames(name, 4, 4, resolveDirection(name));
      expect(frames.length).toBeGreaterThan(0);
      for (const idx of frames.flat()) {
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(16);
      }
    }
  });
});

describe('Lumiterm', () => {
  const noTTY = () => {
    const stream = new Writable({ write(_c, _e, cb) { cb(); } });
    stream.isTTY = false;
    return stream;
  };

  it('factory creates instance from string or options', () => {
    expect(lumiterm('hi')).toBeInstanceOf(Lumiterm);
    expect(lumiterm({ pattern: 'all' })).toBeInstanceOf(Lumiterm);
  });

  it('frame() returns output and lineCount', () => {
    const l = new Lumiterm({ rows: 4, cols: 4 });
    const { output, lineCount } = l.frame();
    expect(typeof output).toBe('string');
    expect(lineCount).toBeGreaterThan(0);
  });

  it('color accepts string names, hex, rgb', () => {
    const l = new Lumiterm();
    for (const c of ['red', '#FF0000', 'rgb(255,0,0)']) {
      l.color = c;
      expect(typeof l.color).toBe('function');
    }
  });

  it('start/stop lifecycle', () => {
    const l = new Lumiterm({ stream: noTTY() });
    expect(l.isSpinning).toBe(false);
    l.start('go');
    expect(l.isSpinning).toBe(true);
    expect(l.text).toBe('go');
    l.stop();
    expect(l.isSpinning).toBe(false);
  });

  it('succeed/fail/warn/info write correct symbols', () => {
    const symbols = { succeed: '\u2714', fail: '\u2716', warn: '\u26A0', info: '\u2139' };
    for (const [method, sym] of Object.entries(symbols)) {
      const chunks = [];
      const stream = new Writable({ write(c, _e, cb) { chunks.push(c.toString()); cb(); } });
      stream.isTTY = false;
      const l = new Lumiterm({ stream });
      l.start();
      l[method]('msg');
      expect(chunks.join('')).toContain(sym);
    }
  });
});
