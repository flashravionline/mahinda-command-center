/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#ffb900',
          orange: '#FF9D09',
          charcoal: '#3A3937',
          dark: '#262523',
        }
      }
    },
  },
  plugins: [],
}