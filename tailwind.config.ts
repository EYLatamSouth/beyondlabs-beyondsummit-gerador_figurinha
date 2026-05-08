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
        // Rare sticker effects
        'rare-glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 16px 4px #C9A84C55, 0 0 40px 8px #C9A84C22' },
          '50%': { boxShadow: '0 0 32px 10px #C9A84Caa, 0 0 60px 20px #C9A84C44' },
        },
        'shimmer-sweep': {
          '0%': { transform: 'translateX(-130%) skewX(-20deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateX(230%) skewX(-20deg)', opacity: '0' },
        },
        'sparkle-pop': {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '40%': { transform: 'scale(1.3) rotate(20deg)', opacity: '1' },
          '70%': { transform: 'scale(0.9) rotate(-10deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.85' },
        },
        'sparkle-float': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'translateY(-10px) rotate(180deg)', opacity: '0.7' },
          '100%': { transform: 'translateY(0) rotate(360deg)', opacity: '1' },
        },
        'rare-badge-bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.15)' },
          '60%': { transform: 'scale(0.95)' },
        },
      },
      animation: {
        'fade-slide-up': 'fade-slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'scale-reveal': 'scale-reveal 0.3s ease-out',
        // Rare sticker effects
        'rare-glow-pulse': 'rare-glow-pulse 2s ease-in-out infinite',
        'shimmer-sweep': 'shimmer-sweep 2.8s ease-in-out infinite',
        'sparkle-pop': 'sparkle-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'sparkle-float': 'sparkle-float 2s ease-in-out infinite',
        'rare-badge-bounce': 'rare-badge-bounce 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
