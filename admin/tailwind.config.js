/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-orange': '#ffffff',
        'accent-yellow': '#e4e4e7',
      }
    },
  },
  plugins: [],
}
