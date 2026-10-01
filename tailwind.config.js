/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
        caveat: ["var(--font-caveat)", "Caveat", "cursive"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          blue: "#0756A8",
          orange: "#F79400",
          navy: "#042D5A",
          lightBlue: "#EBF3FC",
          lightOrange: "#FEF4E6",
          cream: "#FAF8F5",
        },
        primary: {
          DEFAULT: "#0756A8",
          foreground: "#ffffff",
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc5fb",
          400: "#36a6f6",
          500: "#0756A8",
          600: "#06468a",
          700: "#05376d",
          800: "#062f59",
          900: "#0a284c",
        },
        secondary: {
          DEFAULT: "#F79400",
          foreground: "#ffffff",
          50: "#fff8eb",
          100: "#fef0d6",
          200: "#fde1ad",
          300: "#fbcb7a",
          400: "#f9ab43",
          500: "#F79400",
          600: "#d9740b",
          700: "#b4530c",
          800: "#92400e",
          900: "#78350f",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
}

