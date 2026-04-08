import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        'green-dark': '#1A5C2A',
        'green-mid': '#3D9A52',
        'green-light': '#7DC48A',
        gold: '#C9A84C',
        'gray-text': '#374151',
        'gray-light': '#F5F5F5',
        accent: {
          purple: '#6B3FA0',
          cyan: '#4BBFDB',
          pink: '#E8365D',
          lime: '#8DC63F',
          yellow: '#F5C518',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
} satisfies Config
