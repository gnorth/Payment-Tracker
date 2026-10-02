/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        military: {
          dark: '#0e1510',
          card: '#16221a',
          accent: '#4a7c59',
          gold: '#d4af37',
          olive: '#3b5249'
        }
      }
    },
  },
  plugins: [],
}
