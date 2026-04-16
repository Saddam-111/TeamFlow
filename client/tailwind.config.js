/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'acid-yellow': '#DFE104',
        'bg-black': '#09090B',
        'surface': '#18181B',
        'surface-light': '#27272A'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        }
      }
    },
  },
  plugins: [],
}
