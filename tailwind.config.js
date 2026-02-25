const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          koder: "#FF6B00",
          glow: "#FF9F1C",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        forest: {
          deep: "#0A3D2A",
          light: "#1E8A6B",
          moss: "#0D5A3D",
        },
        dark: {
          DEFAULT: "#0A0A0A",
          muted: "#121212",
          elevated: "#1A1A1A",
        },
        light: {
          DEFAULT: "#F8F9FA",
          muted: "#EEF1F4",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#94A3B8",
          soft: "#E5E7EB",
        },
        success: "#22C55E",
        error: "#EF4444",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-satoshi)", "var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        "orange-glow":
          "0 0 0 1px rgba(255, 107, 0, 0.15), 0 10px 24px rgba(255, 107, 0, 0.24)",
        "orange-strong":
          "0 0 0 1px rgba(255, 159, 28, 0.2), 0 20px 40px rgba(255, 107, 0, 0.3)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: 0, transform: "translate3d(0, 16px, 0)" },
          to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 107, 0, 0.35)" },
          "50%": { boxShadow: "0 0 0 12px rgba(255, 107, 0, 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 500ms ease-out both",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
      },
      backgroundImage: {
        "forest-overlay":
          "linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,61,42,0.72) 55%, rgba(10,61,42,0.88) 100%)",
      },
    },
  },
  plugins: [],
};

