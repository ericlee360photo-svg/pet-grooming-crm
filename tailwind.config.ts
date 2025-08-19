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
        // BarkBook Brand Colors
        primary: {
          DEFAULT: "#19253d",
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d",
          600: "#495057",
          700: "#343a40",
          800: "#19253d", // Primary brand color
          900: "#212529",
        },
        accent: {
          DEFAULT: "#ee8669",
          50: "#fff5f2",
          100: "#ffe8e0",
          200: "#ffd1c0",
          300: "#ffb399",
          400: "#ff8a66",
          500: "#ee8669", // Accent brand color
          600: "#e65a3a",
          700: "#c23d1f",
          800: "#a0321c",
          900: "#842d1c",
        },
        cream: {
          DEFAULT: "#f8eee4",
          50: "#fefcf9",
          100: "#f8eee4", // Cream brand color
          200: "#f0e0d0",
          300: "#e6ccb8",
          400: "#d9b39a",
          500: "#cc997c",
          600: "#bf7f5e",
          700: "#a6664a",
          800: "#8a5440",
          900: "#724637",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
