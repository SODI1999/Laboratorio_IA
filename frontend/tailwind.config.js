/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border, 214 32% 91%))",
        input: "hsl(var(--input, 214 32% 91%))",
        ring: "hsl(var(--ring, 222 84% 5%))",
        background: "hsl(var(--background, 0 0% 100%))",
        foreground: "hsl(var(--foreground, 222 84% 5%))",
        primary: {
          DEFAULT: "hsl(var(--primary, 222 47% 11%))",
          foreground: "hsl(var(--primary-foreground, 210 40% 98%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 210 40% 96.1%))",
          foreground: "hsl(var(--secondary-foreground, 222 47% 11.2%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 210 40% 96.1%))",
          foreground: "hsl(var(--muted-foreground, 215.4 16.3% 46.9%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 210 40% 96.1%))",
          foreground: "hsl(var(--accent-foreground, 222 47% 11.2%))",
        },
        status: {
          available: {
            bg: "#ecfdf5",
            text: "#047857",
            border: "#a7f3d0",
          },
          assigned: {
            bg: "#eff6ff",
            text: "#1d4ed8",
            border: "#bfdbfe",
          },
          maintenance: {
            bg: "#fffbeb",
            text: "#b45309",
            border: "#fde68a",
          },
          retired: {
            bg: "#f1f5f9",
            text: "#475569",
            border: "#cbd5e1",
          },
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
}
