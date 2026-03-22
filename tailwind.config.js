/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fredoka'", "'Nunito'", 'system-ui', 'sans-serif'],
        body: ["'Nunito'", 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: {
          cream: '#FFF8E7',
          red: '#E74C3C',
          orange: '#F39C12',
          yellow: '#F1C40F',
          green: '#27AE60',
          blue: '#2980B9',
          purple: '#8E44AD',
          pink: '#E91E90',
          teal: '#1ABC9C',
          brown: '#8B6914',
          navy: '#2C3E50',
          coral: '#FF6B6B',
          mint: '#55EFC4',
          sky: '#74B9FF',
          lavender: '#A29BFE',
        },
      },
      boxShadow: {
        'paper-sm': '2px 2px 0px rgba(0,0,0,0.15), 4px 4px 8px rgba(0,0,0,0.1)',
        'paper-md': '3px 3px 0px rgba(0,0,0,0.2), 6px 6px 16px rgba(0,0,0,0.12)',
        'paper-lg': '4px 4px 0px rgba(0,0,0,0.2), 8px 8px 24px rgba(0,0,0,0.15)',
        'paper-xl': '6px 6px 0px rgba(0,0,0,0.2), 12px 12px 40px rgba(0,0,0,0.18)',
        'paper-inset': 'inset 2px 2px 6px rgba(0,0,0,0.15), inset -1px -1px 3px rgba(255,255,255,0.3)',
      },
    },
  },
  plugins: [],
}
