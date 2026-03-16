import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        // Brand
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Accent
        amber: {
          50:  '#fffbeb',
          100: '#fef3c7',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Surface
        surface: {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        // Language colors
        de: '#16a34a',
        nl: '#2563eb',
        tr: '#dc2626',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'bounce-in':    'bounceIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        'pop':          'popIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both',
        'shake':        'shake 0.4s ease-in-out',
        'star-burst':   'starBurst 0.6s ease-out forwards',
        'confetti-fall':'confettiFall linear forwards',
        'fade-in':      'fadeIn 0.22s ease both',
        'fade-up':      'fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both',
        'slide-up':     'slideUp 0.38s cubic-bezier(0.22,1,0.36,1) both',
        'pulse-soft':   'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        bounceIn: {
          '0%':   { transform: 'scale(0.65)', opacity: '0' },
          '55%':  { transform: 'scale(1.06)', opacity: '1' },
          '75%':  { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)' },
        },
        popIn: {
          '0%':   { transform: 'scale(0.82)', opacity: '0' },
          '65%':  { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '15%':     { transform: 'translateX(-8px)' },
          '30%':     { transform: 'translateX(8px)' },
          '45%':     { transform: 'translateX(-5px)' },
          '60%':     { transform: 'translateX(5px)' },
          '75%':     { transform: 'translateX(-2px)' },
        },
        starBurst: {
          '0%':   { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '60%':  { transform: 'scale(1.4) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(0) rotate(360deg)', opacity: '0' },
        },
        confettiFall: {
          '0%':   { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(28px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%,100%': { transform: 'scale(1)' },
          '50%':     { transform: 'scale(1.04)' },
        },
      },
      boxShadow: {
        'xs':     '0 1px 2px rgba(0,0,0,0.05)',
        'sm':     '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card':   '0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-md':'0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-lg':'0 8px 32px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)',
        'glow-brand':'0 4px 24px rgba(99,102,241,0.35)',
        'glow-amber':'0 4px 24px rgba(245,158,11,0.35)',
      },
    },
  },
  plugins: [],
}

export default config
