import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF9F6",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#245640",
          hover: "#1c4332",
          light: "#2f7053",
          50: "#f0f7f3",
          100: "#e0efe6",
          500: "#245640",
          600: "#1c4332",
          700: "#153326",
        },
        accent: {
          DEFAULT: "#F28C45",
          hover: "#de7832",
          light: "#fff3eb",
          50: "#fff9f5",
          100: "#ffedd5",
          500: "#F28C45",
          600: "#ea580c",
        },
        sage: {
          DEFAULT: "#E8F0E8",
          light: "#f3f7f3",
          dark: "#d1e2d1",
        },
        foreground: "#252525",
        muted: {
          DEFAULT: "#777777",
          light: "#999999",
          dark: "#555555",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(0, 0, 0, 0.04)",
        card: "0 4px 20px -2px rgba(36, 86, 64, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 12px 30px -4px rgba(36, 86, 64, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)",
        float: "0 20px 40px -10px rgba(36, 86, 64, 0.15)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
export default config;
