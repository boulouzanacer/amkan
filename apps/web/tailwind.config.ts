import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211f",
        clay: "#bf6f4a",
        palm: "#1f7a69",
        mist: "#eef4f1",
        sun: "#f4c95d"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 33, 31, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
