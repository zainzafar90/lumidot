import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            code: {
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.8125rem',
              color: 'rgb(9 9 11)',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: 'rgb(250 250 250)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgb(228 228 231)',
              borderRadius: '0px',
              color: 'rgb(9 9 11)',
            },
            'pre code': {
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              backgroundColor: 'transparent',
            },
          },
        },
        invert: {
          css: {
            code: {
              color: 'rgb(250 250 250)',
            },
            pre: {
              backgroundColor: 'rgb(24 24 27)',
              borderColor: 'rgb(39 39 42)',
              color: 'rgb(250 250 250)',
            },
            'pre code': {
              color: 'inherit',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;
