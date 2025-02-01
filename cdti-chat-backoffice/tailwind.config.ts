import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#f97316",
        primary: "#636FA4",
        secondary: "#E8CBC0",
        tertiary: "#111827",
      },
      keyframes: {
        wiggle: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(60deg)" },
        },
      },
      animation: {
        // "spin-slow": "wiggle 100s ease-in-out infinite",
        "spin-slow": "spin 200s linear infinite",
      },
      screens: {
        xs: "240px",
        // => @media (min-width: 640px) { ... }
      },
    },
  },
  plugins: [],
} satisfies Config;
