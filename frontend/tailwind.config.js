/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#00b4c5',
          600: '#00979f',
          700: '#007b8a',
          800: '#006070',
          900: '#004d5a',
        },
        gold: {
          300: '#ffe082',
          400: '#ffca28',
          500: '#ffb800',
          600: '#f9a825',
          700: '#f57f17',
        },
        cream: {
          50:  '#fdfcf8',
          100: '#f8f5f0',
          200: '#f0ebe0',
          300: '#e8e0d0',
        },
        dark: {
          900: '#0d1b22',
          800: '#1b3a4b',
          700: '#1e4d5c',
          600: '#2c6070',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body:    ['Inter', 'sans-serif'],
        accent:  ['Satisfy', 'cursive'],
      },
      animation: {
        'float':       'float 5s ease-in-out infinite',
        'float-slow':  'float 7s ease-in-out infinite',
        'spin-slow':   'spin 12s linear infinite',
        'fade-up':     'fadeUp 0.6s ease-out forwards',
        'shimmer':     'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':      { transform: 'translateY(-18px) rotate(3deg)' },
        },
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'food':     '0 20px 40px -8px rgba(0,0,0,0.2), 0 8px 16px -4px rgba(0,0,0,0.1)',
        'card':     '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover':'0 16px 48px rgba(0,0,0,0.15)',
        'teal':     '0 8px 32px rgba(0,180,197,0.35)',
        'gold':     '0 8px 32px rgba(255,184,0,0.4)',
        'btn':      '0 4px 15px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
