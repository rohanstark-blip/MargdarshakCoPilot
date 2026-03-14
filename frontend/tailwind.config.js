/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["'Noto Sans'", "system-ui", "sans-serif"],
        hindi: ["'Noto Sans Devanagari'", "system-ui", "sans-serif"],
      },
      colors: {
        gov: {
          blue: "#1e3a8a",
          "blue-dark": "#172554",
          "blue-light": "#2563eb",
          "blue-hover": "#1d4ed8",
          navy: "#0f172a",
          saffron: "#f97316",
          "saffron-dark": "#ea580c",
          green: "#15803d",
          white: "#ffffff",
          cream: "#fefce8",
          "gray-50": "#f8fafc",
          "gray-100": "#f1f5f9",
          "gray-200": "#e2e8f0",
          "gray-300": "#cbd5e1",
          "gray-400": "#94a3b8",
          "gray-500": "#64748b",
          "gray-600": "#475569",
          "gray-700": "#334155",
          "gray-800": "#1e293b",
        },
        verify: {
          pass: "#16a34a",
          fail: "#dc2626",
          warn: "#ca8a04",
        },
      },
      animation: {
        "marquee": "marquee 40s linear infinite",
        "fade-in": "fade-in 0.3s ease forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
