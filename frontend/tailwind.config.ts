import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'glass': 'rgba(255, 255, 255, 0.1)',
        // Bind Tailwind tokens to CSS variables (RGB versions for alpha utility support)
        fg: 'rgb(var(--color-fg-rgb) / <alpha-value>)',
        heading: 'rgb(var(--color-fg-heading-rgb) / <alpha-value>)',
        accent: 'rgb(var(--color-fg-accent-rgb) / <alpha-value>)',
      },
      backdropBlur: {
        'xl': '20px',
      },
      fontFamily: {
        'shuneva': ['var(--font-shuneva)', 'serif'],
        'sans': ['var(--font-geist-sans)', 'sans-serif'],
        'mono': ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
