/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/features/**/*.{js,jsx,ts,tsx}",
    "./src/shared/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "rgba(var(--color-border), <alpha-value>)",
        input: "rgba(var(--color-input), <alpha-value>)",
        ring: "rgba(var(--color-ring), <alpha-value>)",
        background: "rgba(var(--color-background), <alpha-value>)",
        foreground: "rgba(var(--color-foreground), <alpha-value>)",
        primary: {
          DEFAULT: "rgba(var(--color-primary), <alpha-value>)",
          foreground: "rgba(var(--color-primary-foreground), <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgba(var(--color-secondary), <alpha-value>)",
          foreground: "rgba(var(--color-secondary-foreground), <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgba(var(--color-destructive), <alpha-value>)",
          foreground: "rgba(var(--color-destructive-foreground), <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgba(var(--color-muted), <alpha-value>)",
          foreground: "rgba(var(--color-muted-foreground), <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgba(var(--color-accent), <alpha-value>)",
          foreground: "rgba(var(--color-accent-foreground), <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgba(var(--color-popover), <alpha-value>)",
          foreground: "rgba(var(--color-popover-foreground), <alpha-value>)",
        },
        card: {
          DEFAULT: "rgba(var(--color-card), <alpha-value>)",
          foreground: "rgba(var(--color-card-foreground), <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
