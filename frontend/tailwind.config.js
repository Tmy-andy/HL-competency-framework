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
        primary: '#195de6',
        'background-light': '#f6f6f8',
        'background-dark': '#111621',
        'text-light': '#0e121b',
        'text-dark': '#ffffff',
        'card-light': '#ffffff',
        'card-dark': '#1a2233',
        'border-light': '#d0d7e7',
        'border-dark': '#34405a',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
