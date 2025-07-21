/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#BF1E2E',
        black: '#1a1a1a',
        white: '#ffffff',
        gray: {
          100: '#f5f5f5',
          200: '#e5e5e5',
          // ...add more if needed
        },
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
