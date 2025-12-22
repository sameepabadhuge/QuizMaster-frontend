/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          600: "#7EC4FF", // primary button color
          700: "#5FAFEF", // hover/darker state
        },
      },
    },
  },
  plugins: [],
};
