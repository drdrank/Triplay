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
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        cream: '#FFF8F0',
        coral: {
          50:  '#fff4f0',
          100: '#ffe4d8',
          400: '#FF8C61',
          500: '#FF6B35',
          600: '#e5522a',
        },
        mint: {
          400: '#4ECDC4',
          500: '#3BB5AC',
        },
        lavender: {
          400: '#A78BFA',
          500: '#8B5CF6',
        },
        sunflower: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        de: '#22C55E',   // German green
        nl: '#3B82F6',   // Dutch blue
        tr: '#EF4444',   // Turkish red
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'bounce-in':    'bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'wiggle':       'wiggle 0.4s ease-in-out',
        'pop':          'pop 0.25s ease-out',
        'shake':        'shake 0.35s ease-in-out',
        'star-burst':   'starBurst 0.6s ease-out forwards',
        'confetti-fall':'confettiFall linear forwards',
        'fade-in':      'fadeIn 0.3s ease-out',
        'slide-up':     'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        'pulse-soft':   'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        bounceIn: {
          '0%':   { transform: 'scale(0.7)', opacity: '0' },
          '70%':  { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(0deg)' },
          '25%':     { transform: 'rotate(-8deg)' },
          '75%':     { transform: 'rotate(8deg)' },
        },
        pop: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%':     { transform: 'translateX(-10px)' },
          '40%':     { transform: 'translateX(10px)' },
          '60%':     { transform: 'translateX(-6px)' },
          '80%':     { transform: 'translateX(6px)' },
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
        slideUp: {
          '0%':   { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%,100%': { transform: 'scale(1)' },
          '50%':     { transform: 'scale(1.04)' },
        },
      },
      boxShadow: {
        'card':   '0 4px 20px rgba(0,0,0,0.08)',
        'card-lg':'0 8px 32px rgba(0,0,0,0.12)',
        'btn':    '0 4px 12px rgba(0,0,0,0.15)',
        'btn-lg': '0 6px 20px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
}

export default config
