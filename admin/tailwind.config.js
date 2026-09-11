/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'horizon-sky': '#38bdf8',
        'ocean-blue': '#0284c7',
        'ocean-abyss': '#020617',
        'ocean-slate': '#0f172a',
      }
    },
  },
  plugins: [],
}
