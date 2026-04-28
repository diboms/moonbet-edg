import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // EDG Moon — or/jaune conservé pour les Moons 🌙
        moon: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // EDG Brand — violet/indigo signature
        edg: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        // EDG Pink — accent secondaire
        edgpink: {
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
        },
        // EDG Blue — accent tertiaire
        edgblue: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
        dark: {
          900: "#07070a",
          800: "#0f0f14",
          700: "#1a1a24",
          600: "#252535",
          500: "#3a3a50",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      backgroundImage: {
        // EDG signature gradient — violet → bleu
        "edg-gradient": "linear-gradient(135deg, #7c3aed 0%, #4f46e5 40%, #0ea5e9 100%)",
        // EDG multicolor — toute la palette
        "edg-rainbow": "linear-gradient(135deg, #ec4899 0%, #7c3aed 35%, #4f46e5 65%, #0ea5e9 100%)",
        // Moon gold conservé
        "moon-gradient": "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)",
        // Dark EDG background
        "dark-gradient": "linear-gradient(135deg, #07070a 0%, #0f0f14 100%)",
        // Card glow EDG
        "card-edg": "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(14,165,233,0.06) 100%)",
        // Orange-rose accent
        "edg-warm": "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
