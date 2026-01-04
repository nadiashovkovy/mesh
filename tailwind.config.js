/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: '#a6ead7ff',
          500: '#89efd2ff',
          600: '#42dcb0ff',
        },
        purple: {
          400: '#2a1db0ff',
          500: '#130b6dff',
          600: '#070054ff',
        },
      },
      animation: {
        bounce: 'bounce 1.4s infinite',
      },
    },
  },
  plugins: [],
};