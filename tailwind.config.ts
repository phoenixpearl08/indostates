import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hospital: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9dffd",
          300: "#7cc5fb",
          400: "#36a7f7",
          500: "#0b8be7",
          600: "#026fc5",
          700: "#0359a0",
          800: "#074c83",
          900: "#0c406e",
          950: "#082949",
        },
        navy: {
          800: "#132b45",
          900: "#0c1d30",
          950: "#071320",
        },
        cyanBrand: {
          DEFAULT: "#0284c7",
          light: "#e0f2fe",
          dark: "#0369a1",
        },
        emeraldBrand: {
          DEFAULT: "#059669",
          light: "#d1fae5",
          dark: "#047857",
        },
        emergency: {
          DEFAULT: "#dc2626",
          light: "#fee2e2",
          dark: "#b91c1c",
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        card: "0 10px 30px -5px rgba(12, 64, 110, 0.08)",
        floating: "0 20px 40px -10px rgba(12, 64, 110, 0.16)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
