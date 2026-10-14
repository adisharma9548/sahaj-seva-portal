import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#E8710A", // primary saffron
          600: "#D35F07",
          700: "#B44C05",
          800: "#8F3A07",
          900: "#752E07",
        },
        navy: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#627D98",
          500: "#334E68",
          600: "#243B53",
          700: "#1B2A49", // primary navy
          800: "#101D33",
          900: "#0A1220",
        },
        sevaGreen: {
          50: "#E8F5E9",
          500: "#2E7D32",
          600: "#1B5E20",
        },
        sevaAmber: {
          50: "#FFFDE7",
          500: "#F9A825",
          600: "#F57F17",
        },
        sevaRed: {
          50: "#FFEBEE",
          500: "#D32F2F",
          600: "#C62828",
        },
        sevaBg: "#FAFAF7",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-devanagari)", "system-ui", "sans-serif"],
        hindi: ["var(--font-devanagari)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
