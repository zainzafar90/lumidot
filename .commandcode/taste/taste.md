# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# tailwind
- When fixing dark/light mode issues, carefully audit all affected components and test both modes — avoid quick fixes that break other components. Confidence: 0.85
- For Tailwind Typography (`prose`) dark mode overrides, prefer `dark:prose-pre:` modifier order over `prose-pre:dark:` to ensure correct CSS generation. Confidence: 0.70
- When overriding `pre` styles in the Tailwind Typography config, always include `borderStyle: 'solid'` alongside `borderWidth`/`borderColor`, and explicitly set `'pre code': { color: 'inherit' }` to override the default `--tw-prose-pre-code` variable (which defaults to a light color for dark backgrounds). Confidence: 0.80

# design
- Use zero border-radius (border-radius: 0) for UI elements and components — no rounded corners. Confidence: 0.95
- Use only black and white themes — no blue, cyan, or colored themes on pages. Confidence: 0.90
- Default to dark mode (#0a0a0a background) with a single light/dark toggle button. Confidence: 0.85
- Keep pages clean and minimal — avoid decorative elements, glow effects, and cyberpunk aesthetics. Confidence: 0.85

# code-style
- Write code like a senior engineer — keep logic local to functions/methods rather than extracting to top-level constants when it reduces clarity. Confidence: 0.85
- Refactor for readability and maintainability — code should be easy to understand, not spaghetti. Confidence: 0.85
- Avoid duplicate config/style files — consolidate into a single file when two files serve the same purpose. Confidence: 0.80
- Keep demo/example scripts simple and direct — just the core usage calls, no interactive modes, state machines, or keyboard handling unless explicitly needed. Confidence: 0.88

# package
- Inline CSS into the component bundle rather than shipping a separate styles.css file that consumers must import manually. Confidence: 0.80
- Prefer the bundler-based CSS import approach (e.g., `import './styles.css'` like sonner does) over manual `<style>` tag injection at runtime. Confidence: 0.70

# workflow
- Use pnpm as the package manager. Confidence: 0.90
- When building multi-step features, implement in phases and wait for explicit approval before moving to the next phase (e.g., "first do X, then after approval do Y"). Confidence: 0.75

# terminal-ui
- Use braille characters for terminal spinner/animation dots — they are compact, fit on one line, and look visually brilliant. Confidence: 0.80
- For terminal spinners, support per-dot fading/color variation so each dot animates independently rather than the whole row changing uniformly. Confidence: 0.75
- For the lumiterm project, ship only `index.js` (plain JS library) and `index.d.ts` (types) — do not include a CLI bin tool. Confidence: 0.75
