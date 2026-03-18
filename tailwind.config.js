module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}", './node_modules/tw-elements/dist/js/**/*.js'],
  darkMode: "class",
  theme: {
    extend: {
      width: {
        sidebar: "350px",
        search: "400px",
      },
      rotate: {
        137: "137deg",
      },
      backgroundColor: {
        packed: "#EEF6FF",
        // packed: "#f2f2f2", you can use this color if you like
      },
      colors: {
        primary: "#0ea5e9", // Sky 500
        secondary: "#64748b", // Slate 500
      },
      fontFamily: {
        lexend: "'Lexend', sans-serif",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require('tw-elements/dist/plugin')],
};
