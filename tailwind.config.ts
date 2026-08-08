import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0E0E10',
        surface: '#18181B',
        elevated: '#1F1F23',
        border: '#2A2A2E',
        ink: '#F5F5F2',
        muted: '#A1A1AA',
        ember: {
          DEFAULT: '#E8A33D',
          light: '#F2C069',
          dark: '#C6832A',
        },
        success: '#3FA66B',
        alert: '#E8613F',
      },
      fontFamily: {
        sans: ['"Manrope"', 'sans-serif'],
      },
      borderRadius: {
        card: '1.25rem',
        pill: '999px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
