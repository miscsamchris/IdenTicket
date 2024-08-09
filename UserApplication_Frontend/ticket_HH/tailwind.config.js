/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          900: '#4c1d95',
        },
        indigo: {
          800: '#3730a3',
        },
      },
    },
  },
  plugins: [],
}