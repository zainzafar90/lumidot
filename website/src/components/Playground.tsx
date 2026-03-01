import { useState, useEffect } from 'react';
import { Lumidot, PATTERN_NAMES, COLORS } from 'lumidot';
import type { LumidotPattern, LumidotVariant, LumidotDirection } from 'lumidot';
import copy from 'copy-to-clipboard';
import clsx from 'clsx';

const patternNames = [...PATTERN_NAMES];
const variantNames = Object.keys(COLORS) as LumidotVariant[];

const DIRECTIONS: { label: string; value: LumidotDirection }[] = [
  { label: 'LTR', value: 'ltr' },
  { label: 'RTL', value: 'rtl' },
  { label: 'TTB', value: 'ttb' },
  { label: 'BTT', value: 'btt' },
];

export default function Playground() {
  const [dark, setDark] = useState(true);
  const [pattern, setPattern] = useState<LumidotPattern>('all');
  const [variant, setVariant] = useState<LumidotVariant>('blue');
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [scale, setScale] = useState(3);
  const [glow, setGlow] = useState(8);
  const [duration, setDuration] = useState(0.7);
  const [direction, setDirection] = useState<LumidotDirection>('ltr');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleCopy = (text: string, id: string) => {
    copy(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const codeParts: string[] = [];
  if (pattern !== 'all') codeParts.push(`pattern="${pattern}"`);
  if (variant !== 'blue') codeParts.push(`variant="${variant}"`);
  if (rows !== 3) codeParts.push(`rows={${rows}}`);
  if (cols !== 3) codeParts.push(`cols={${cols}}`);
  if (scale !== 1) codeParts.push(`scale={${scale}}`);
  if (glow !== 8) codeParts.push(`glow={${glow}}`);
  if (duration !== 0.7) codeParts.push(`duration={${duration}}`);
  if (direction !== 'ltr') codeParts.push(`direction="${direction}"`);

  const codeOutput = `<Lumidot${codeParts.length ? ' ' + codeParts.join(' ') : ''} />`;

  const pill =
    'inline-flex items-center gap-1.5 font-mono text-[11px] px-3 py-1.5 border cursor-pointer transition-all whitespace-nowrap';
  const pillDefault =
    'border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-950 dark:hover:text-zinc-50';
  const pillActive = 'border-zinc-950 dark:border-zinc-50 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950';

  const label = 'font-mono text-[10px] font-medium tracking-widest uppercase text-zinc-500';

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors">
      {/* Hero */}
      <section className="pt-36 pb-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-[clamp(48px,8vw,80px)] font-bold tracking-tighter leading-none text-zinc-950 dark:text-zinc-50 mb-4 inline-flex items-end justify-center">
          lumidot
          <span className="mb-[0.06em] ml-0.5 pl-0.5">
            <Lumidot pattern="all" variant="blue" glow={8} scale={0.4} />
          </span>
        </h1>
        <p className="text-base text-zinc-500 leading-relaxed mx-4">
          A 3x3 dot-grid loader for React. 36 patterns, 20 colors, under 5KB.
        </p>
        <button
          className="mt-6 inline-flex items-center gap-2 font-mono text-[13px] text-white dark:text-black dark:bg-zinc-100 bg-zinc-900 border dark:border-zinc-200 border-zinc-800 cursor-pointer px-5 py-2.5 transition-colors dark:hover:border-zinc-950 hover:border-zinc-50"
          onClick={() => handleCopy('npm install lumidot', 'install')}
        >
          <span>npm install lumidot</span>
          <span className="text-sm text-white dark:text-black">{copied === 'install' ? '✓' : '⎘'}</span>
        </button>
      </section>

      {/* Patterns */}
      <section className="py-10 max-w-4xl mx-auto px-6" id="patterns">
        <h2 className="text-xl font-medium font-mono text-zinc-500 tracking-widest uppercase mb-4">Patterns</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] border border-zinc-200 dark:border-zinc-800">
          {patternNames.map((name) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center gap-2.5 py-5 px-2 border-r border-b border-zinc-200 dark:border-zinc-800 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <Lumidot pattern={name} variant={dark ? 'white' : 'black'} />
              <span className="font-mono text-[10px] text-zinc-500 tracking-wide truncate max-w-full">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section className="py-10 max-w-4xl mx-auto px-6" id="colors">
        <h2 className="text-xl font-medium font-mono text-zinc-500 tracking-widest uppercase mb-4">Colors</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] border border-zinc-200 dark:border-zinc-800">
          {variantNames.slice(0, -1).map((name) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center gap-2.5 py-5 px-2 border-r border-b border-zinc-200 dark:border-zinc-800 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <Lumidot pattern="all" variant={name} glow={8} />
              <span className="font-mono text-[10px] text-zinc-500 tracking-wide">{name}</span>
              <span className="font-mono text-[9px] text-zinc-500 opacity-50">{COLORS[name]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Playground */}
      <section className="py-10 max-w-4xl mx-auto px-6" id="playground">
        <h2 className="text-xl font-medium font-mono text-zinc-500 tracking-widest uppercase mb-4">Playground</h2>
        <div className="border border-zinc-200 dark:border-zinc-800">
          {/* Preview */}
          <div className="flex items-center justify-center min-h-60 p-10">
            <Lumidot
              pattern={pattern}
              variant={variant}
              rows={rows}
              cols={cols}
              scale={scale}
              glow={glow}
              duration={duration}
              direction={direction}
            />
          </div>

          {/* Controls */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-5">
            {/* Pattern */}
            <div className="flex flex-col gap-2">
              <span className={label}>Pattern</span>
              <div className="flex flex-wrap gap-1.5">
                {patternNames.map((name) => (
                  <button
                    key={name}
                    className={clsx(pill, pattern === name ? pillActive : pillDefault)}
                    onClick={() => setPattern(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant */}
            <div className="flex flex-col gap-2">
              <span className={label}>Variant</span>
              <div className="flex flex-wrap gap-1.5">
                {variantNames.map((name) => (
                  <button
                    key={name}
                    className={clsx(pill, variant === name ? pillActive : pillDefault)}
                    onClick={() => setVariant(name)}
                  >
                    <span
                      className="inline-block w-2 h-2 shrink-0 border border-white/15 dark:border-white/15"
                      style={{ background: COLORS[name] }}
                    />
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Direction */}
            <div className="flex flex-col gap-2">
              <span className={label}>Direction</span>
              <div className="flex flex-wrap gap-1.5">
                {DIRECTIONS.map((d) => (
                  <button
                    key={d.value}
                    className={clsx(pill, direction === d.value ? pillActive : pillDefault)}
                    onClick={() => setDirection(d.value)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rows, Cols, Scale, Glow, Duration Sliders */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className={label}>Rows</span>
                  <span className="font-mono text-xs text-zinc-950 dark:text-zinc-50 font-semibold">{rows}</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={rows}
                  onChange={(e) => setRows(Number(e.target.value))}
                  className="w-full h-px bg-zinc-200 dark:bg-zinc-800 appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-zinc-950 [&::-webkit-slider-thumb]:dark:bg-zinc-50 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-zinc-950 [&::-moz-range-thumb]:dark:bg-zinc-50 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className={label}>Cols</span>
                  <span className="font-mono text-xs text-zinc-950 dark:text-zinc-50 font-semibold">{cols}</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={cols}
                  onChange={(e) => setCols(Number(e.target.value))}
                  className="w-full h-px bg-zinc-200 dark:bg-zinc-800 appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-zinc-950 [&::-webkit-slider-thumb]:dark:bg-zinc-50 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-zinc-950 [&::-moz-range-thumb]:dark:bg-zinc-50 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className={label}>Scale</span>
                  <span className="font-mono text-xs text-zinc-950 dark:text-zinc-50 font-semibold">{scale}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full h-px bg-zinc-200 dark:bg-zinc-800 appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-zinc-950 [&::-webkit-slider-thumb]:dark:bg-zinc-50 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-zinc-950 [&::-moz-range-thumb]:dark:bg-zinc-50 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className={label}>Glow</span>
                  <span className="font-mono text-xs text-zinc-950 dark:text-zinc-50 font-semibold">{glow}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={glow}
                  onChange={(e) => setGlow(Number(e.target.value))}
                  className="w-full h-px bg-zinc-200 dark:bg-zinc-800 appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-zinc-950 [&::-webkit-slider-thumb]:dark:bg-zinc-50 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-zinc-950 [&::-moz-range-thumb]:dark:bg-zinc-50 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className={label}>Duration</span>
                  <span className="font-mono text-xs text-zinc-950 dark:text-zinc-50 font-semibold">{duration}s</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={3}
                  step={0.1}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-px bg-zinc-200 dark:bg-zinc-800 appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-zinc-950 [&::-webkit-slider-thumb]:dark:bg-zinc-50 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-zinc-950 [&::-moz-range-thumb]:dark:bg-zinc-50 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Code output */}
          <div className="relative border-t border-zinc-200 dark:border-zinc-800 px-6 pr-20 py-4 font-mono text-[13px] leading-relaxed text-zinc-950 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-900 overflow-x-auto whitespace-pre">
            <code className="font-mono text-[13px] text-zinc-950 dark:text-zinc-50">{codeOutput}</code>
            <button
              className="absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[10px] px-2.5 py-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500 cursor-pointer transition-all hover:border-zinc-950 hover:text-zinc-950 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
              onClick={() => handleCopy(codeOutput, 'code')}
            >
              {copied === 'code' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
