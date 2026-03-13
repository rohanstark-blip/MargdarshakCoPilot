/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Mono'", "monospace"],
        body: ["'Satoshi'", "system-ui", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      colors: {
        cream: "#F2EFEA",
        ink: "#1A1A1A",
        saffron: {
          DEFAULT: "#FF6B2B",
          light: "#FF8F5C",
        },
        lime: "#CDFE04",
        blush: "#FFB4A2",
        sky: "#8ECAE6",
        brutal: {
          black: "#1A1A1A",
          white: "#FFFFFF",
          grey: "#D4D0C8",
          darkgrey: "#888580",
        },
        verify: {
          pass: "#00C853",
          fail: "#FF1744",
          warn: "#FFD600",
        },
      },
      boxShadow: {
        brutal: "4px 4px 0px #1A1A1A",
        "brutal-lg": "6px 6px 0px #1A1A1A",
        "brutal-sm": "3px 3px 0px #1A1A1A",
        "brutal-saffron": "4px 4px 0px #FF6B2B",
        "brutal-lime": "4px 4px 0px #CDFE04",
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        md: "4px",
      },
      animation: {
        "stamp-slam": "stamp-slam 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.4s ease forwards",
        "slide-up": "slide-up 0.4s ease forwards",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
      keyframes: {
        "stamp-slam": {
          "0%": { transform: "scale(1.8) rotate(-8deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotate(-2deg)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
