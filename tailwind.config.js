/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
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
