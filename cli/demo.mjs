#!/usr/bin/env node

import { lumiterm } from './index.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const s = lumiterm({ stream: process.stdout });

s.pattern = 'wave-lr'; s.color = 'blue';
s.start('Reading codebase...');
await sleep(2000);
s.text = 'Analyzing 47 files...';
await sleep(1500);
s.succeed('Codebase indexed (47 files)');

s.pattern = 'all'; s.color = 'magenta';
s.start('Thinking...');
await sleep(2000);
s.text = 'Planning implementation...';
await sleep(1500);
s.succeed('Plan ready');

s.pattern = 'wave-tb'; s.color = 'green';
s.start('Writing src/auth.ts...');
await sleep(1800);
s.text = 'Writing src/auth.test.ts...';
await sleep(1200);
s.succeed('2 files written');

s.pattern = 'spiral'; s.color = 'yellow';
s.start('Running tests...');
await sleep(2000);
s.fail('3 tests failed');

s.pattern = 'wave-rl'; s.color = 'red';
s.start('Fixing tests...');
await sleep(2500);
s.succeed('All tests passing');

s.pattern = 'frame'; s.color = 'cyan';
s.start('Linting...');
await sleep(1200);
s.warn('2 warnings (non-blocking)');

s.pattern = 'corners-only'; s.color = '#FF8800';
s.start('Committing changes...');
await sleep(1000);
s.info('feat: add auth module');
