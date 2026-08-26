/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#1a6b4a',   // Deep medical green
          accent:  '#f97316',   // Saffron-orange
          bg:      '#f0fdf4',   // Mint background
        },
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':  'spin 1.5s linear infinite',
        'bounce-in':  'bounceIn 0.5s ease-out',
      },
      keyframes: {
        bounceIn: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '70%':  { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
