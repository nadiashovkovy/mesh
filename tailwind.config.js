/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: '#51ececff',
          500: '#89EFEF',
          600: '#89EFEF',
        },
        purple: {
          400: '#9980c2ff',
          500: '#2d0a65ff',
          600: '#110338ff',
        },
      },
      animation: {
        bounce: 'bounce 1.4s infinite',
      },
    },
  },
  plugins: [],
};