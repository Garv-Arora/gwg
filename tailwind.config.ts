import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F14",
        card: "#161C24",
        soft: "#1F2937",
        mint: {
          DEFAULT: "#22C55E",
          soft: "#22C55E22",
          deep: "#16A34A",
        },
        gold: {
          DEFAULT: "#FACC15",
          soft: "#FACC1522",
        },
        danger: {
          DEFAULT: "#EF4444",
          soft: "#EF444422",
        },
        ink: {
          primary: "#F9FAFB",
          secondary: "#CBD5E1",
          muted: "#94A3B8",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "24px",
        input: "16px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(34,197,94,0.25), 0 10px 40px -10px rgba(34,197,94,0.45)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        rise: "rise 0.35s ease-out both",
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
