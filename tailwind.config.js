/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // para o Expo Router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

