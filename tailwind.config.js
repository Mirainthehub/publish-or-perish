/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'academic-blue': '#2a4d8f',
        'academic-dark': '#1a2e4f',
        'academic-light': '#f8fafc',
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
