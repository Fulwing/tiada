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
        'theme-blue': '#3D52A0',
        'light-blue': '#7091E6',
      }
    },
  },
  plugins: [],
  // Ensure your content path includes all necessary directories
}

export default config;