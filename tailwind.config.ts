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
        sans: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        // TriPlay brand
        primary:   '#5C4AE4',
        secondary: '#FF6B35',
        accent:    '#00D4AA',
        // Dark surfaces
        dark: {
          bg:      '#0F0E1A',
          card:    '#1A1830',
          elevated:'#221F3D',
          border:  'rgba(255,255,255,0.08)',
        },
        // Text
        lavender: '#C4B5FD',
        // Language colors
        de: '#22C55E',
        nl: '#3B82F6',
        tr: '#EF4444',
        // Surface (kept for compat)
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
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'bounce-in':     'bounceIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        'pop':           'popIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both',
        'shake':         'shake 0.4s ease-in-out',
        'confetti-fall': 'confettiFall linear forwards',
        'fade-in':       'fadeIn 0.22s ease both',
        'fade-up':       'fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both',
        'slide-up':      'slideUp 0.38s cubic-bezier(0.22,1,0.36,1) both',
        'pulse-soft':    'pulseSoft 3s ease-in-out infinite',
        'flame':         'flamePulse 1.4s ease-in-out infinite',
        'sparkle':       'sparkle 2s ease-in-out infinite',
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
        confettiFall: {
          '0%':   { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        fadeIn:   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp:   { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp:  { '0%': { transform: 'translateY(28px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        pulseSoft:  { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.04)' } },
        flamePulse: { '0%,100%': { transform: 'scale(1) rotate(-2deg)' }, '50%': { transform: 'scale(1.15) rotate(2deg)' } },
        sparkle:    { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.5', transform: 'scale(0.8)' } },
      },
      boxShadow: {
        'glow-primary': '0 4px 24px rgba(92,74,228,0.45)',
        'glow-accent':  '0 4px 24px rgba(0,212,170,0.40)',
        'glow-orange':  '0 4px 24px rgba(255,107,53,0.40)',
        'card-dark':    '0 2px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
}

export default config
