/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        cyan: {
          400: '#a6ead7ff',
          500: '#89efd2ff',
          600: '#42dcb0ff',
        },
        purple: {
          400: '#C0BAFF',
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