/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F5F1',
          100: '#D6E5D9',
          200: '#A8CDB0',
          300: '#7AB587',
          400: '#4C9D5E',
          500: '#2D7A3F',
          600: '#1E3A2B',
          700: '#162D21',
          800: '#0F2017',
          900: '#07130D',
        },
        cream: '#F7F9F6',
        amber: {
          500: '#D97706',
          600: '#B45309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
