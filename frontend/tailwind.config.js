/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        surface2: "var(--color-surface2, var(--color-surface))",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        accent2: "var(--color-accent2)",
        warn: "var(--color-warn)",
        danger: "var(--color-danger)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "counter": "counter 2s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(108,99,255,0.3)" },
          "50%": { boxShadow: "0 0 60px rgba(108,99,255,0.8), 0 0 100px rgba(108,99,255,0.3)" },
        },
      },
      backgroundImage: {
        "radial-accent": "radial-gradient(circle at 50% 50%, rgba(108,99,255,0.15) 0%, transparent 70%)",
        "hero-gradient": "radial-gradient(ellipse at 60% 50%, rgba(108,99,255,0.12) 0%, rgba(0,212,170,0.05) 40%, transparent 70%)",
      },
    },
  },
  plugins: [],
}
