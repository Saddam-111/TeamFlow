/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-black': '#0a0a0a',
        'obsidian': '#0c0c0c',
        'obsidian-light': '#141414',
        'surface': '#18181B',
        'surface-light': '#27272A',
        'lime-accent': '#ccff00',
        'emerald-glow': '#10b981',
        'acid-yellow': '#ccff00',
        'glass-white': 'rgba(255, 255, 255, 0.03)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': 'clamp(3rem, 10vw, 12rem)',
        'hero': 'clamp(2.5rem, 8vw, 8rem)',
        'h1': 'clamp(2rem, 5vw, 4rem)',
        'h2': 'clamp(1.5rem, 3vw, 2.5rem)',
        'h3': 'clamp(1.25rem, 2vw, 1.75rem)',
        'body': '1rem',
        'small': '0.875rem'
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      backdropBlur: {
        'xl': '16px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      letterSpacing: {
        tighter: '-0.06em',
        tight: '-0.04em',
        normal: '0',
        wide: '0.06em',
        wider: '0.12em',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(204, 255, 0, 0.3)',
        'glow-sm': '0 0 20px rgba(204, 255, 0, 0.2)',
        'glow-lg': '0 0 60px rgba(204, 255, 0, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(204, 255, 0, 0.1)',
      },
    },
  },
  plugins: [],
}