/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0ea5e9",
        accent: "#22c55e"
      },
      fontSize: {
        base: "18px"
      }
    }
  },
  plugins: []
}
