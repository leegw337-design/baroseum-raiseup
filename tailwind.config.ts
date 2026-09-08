import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EEF3FD',
          100: '#D5E1FB',
          200: '#ABBDF7',
          300: '#7F9AF1',
          400: '#5476EB',
          500: '#1E4FD8',
          600: '#1840AD',
          700: '#123083',
          800: '#0C2058',
          900: '#06102C',
        },
        accent: {
          50:  '#FFF0F1',
          100: '#FFD9DB',
          200: '#FFB3B7',
          300: '#FF8D93',
          400: '#FF676F',
          500: '#F96167',
          600: '#E53E45',
          700: '#BF2D33',
          800: '#991C22',
          900: '#730B11',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0C2058 0%, #1E4FD8 55%, #5476EB 100%)',
        'card-gradient': 'linear-gradient(135deg, #1E4FD8 0%, #5476EB 100%)',
        'accent-gradient': 'linear-gradient(135deg, #F96167 0%, #FF8D93 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'bar-fill': 'barFill 1.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        barFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--fill-w, 0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(30, 79, 216, 0.10)',
        'card-hover': '0 12px 48px rgba(30, 79, 216, 0.20)',
        'accent': '0 4px 20px rgba(249, 97, 103, 0.28)',
        'nav': '0 2px 20px rgba(15, 23, 42, 0.12)',
        'deep': '0 8px 40px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
}
export default config
