/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05070b',
        surface: '#0b111c',
        elevated: '#101827',
        primary: {
          DEFAULT: '#2563eb',
          light: '#3b82f6',
        },
        cyan: '#22d3ee',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
      maxWidth: {
        content: '1500px',
      },
    },
  },
  plugins: [],
};
