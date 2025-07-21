/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
        primary: '#e3342f',
        black: '#1a1a1a',
        white: '#ffffff',
        gray: {
          100: '#f5f5f5',
          200: '#e5e5e5',
          // ...add more if needed
        }}},
  },
  plugins: [],
};
