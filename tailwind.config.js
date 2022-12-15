/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'spin-cc': {
          to: {
            transform: 'rotate(-360deg)',
          }
        },
      },
      animation: {
        'spin-cc': 'spin-cc 1s linear infinite',
      }
    },
  },
  plugins: [],
}
