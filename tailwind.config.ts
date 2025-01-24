import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          50: "#fafafa", // Very light grey
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a", // Deep charcoal
          900: "#18181b", // Rich black
        },
        orange: {
          50: "#fffaf0", // Soft peach
          100: "#feebd2",
          200: "#fdcf8f",
          300: "#fbbd65", // Warm golden orange
          400: "#f59e35",
          500: "#ed7f14", // Vibrant orange
          600: "#d9670d",
          700: "#b7520b", // Deep burnt orange
          800: "#933f0a",
          900: "#732f08", // Rich dark orange
        },
        yellow: {
          50: "#fffbeb", // Soft pale yellow
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // Vibrant sunny yellow
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f", // Deep golden yellow
        },
        blue: {
          50: "#f0f9ff", // Misty sky
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9", // Sky blue
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985", // Deep rain blue
          900: "#0c4a6e", // Stormy blue
        },
        grey: {
          50: "#fafafa", // Light grey
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a", // Neutral mid-grey
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b", // Charcoal black
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
