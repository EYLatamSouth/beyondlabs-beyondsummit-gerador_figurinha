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
      keyframes: {
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-reveal': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-slide-up': 'fade-slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'scale-reveal': 'scale-reveal 0.3s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
