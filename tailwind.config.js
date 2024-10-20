/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx}"],
  theme: {
    extend: {
      colors: {
        main: {
          4: "hsl(97, 52%, 58%)",
          5: "hsl(97, 52%, 48%)",
          7: "hsl(97, 52%, 38%)",
        },
      },
    },
  },
  plugins: [],
});
