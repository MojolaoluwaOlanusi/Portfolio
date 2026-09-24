import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class", // we'll manually toggle or just use dark
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6C63FF", // your purple accent
          light: "#8B85FF",
          dark: "#4F46E5",
        },
      },
    },
  },
  plugins: [],
};
export default config;