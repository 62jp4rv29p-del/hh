import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        thai: ["var(--font-noto-thai)", "sans-serif"],
      },
      colors: {
        "bg-base":        "var(--color-bg-base)",
        "bg-surface":     "var(--color-bg-surface)",
        "bg-elevated":    "var(--color-bg-elevated)",
        "bg-overlay":     "var(--color-bg-overlay)",
        "text-primary":   "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted":     "var(--color-text-muted)",
        "bubble-ai":      "var(--color-bubble-ai)",
        "bubble-user":    "var(--color-bubble-user)",
        warm:             "var(--color-warm)",
        "warm-subtle":    "var(--color-warm-subtle)",
        "warm-text":      "var(--color-warm-text)",
        border:           "var(--color-border)",
        "border-subtle":  "var(--color-border-subtle)",
        "crisis-bg":      "var(--color-crisis-bg)",
        "crisis-border":  "var(--color-crisis-border)",
        "crisis-text":    "var(--color-crisis-text)",
        "error-text":     "var(--color-error-text)",
        "success-text":   "var(--color-success-text)",
      },
    },
  },
  plugins: [],
};

export default config;
