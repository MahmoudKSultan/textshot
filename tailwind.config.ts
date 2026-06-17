import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
      },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["20px", "28px"],
        xl: ["24px", "32px"],
      },
      colors: {
        success: {
          DEFAULT: "#22c55e",
        },
        warning: {
          DEFAULT: "#f59e0b",
        },
        error: {
          DEFAULT: "#ef4444",
        },
        surface: {
          DEFAULT: "#f5f5f4",
          dark: "#1c1917",
        },
      },
    },
  },
  plugins: [],
};

export default config;
