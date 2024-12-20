/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/assets/index-splash.jpg')",
      },
      colors: {
        boxBgColor1: "rgba(0, 0, 0, 0.74)",
        boxBgColor2 : "rgb(74, 47, 150)"

      },
    },
  },
  plugins: [],
};
