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
        "gold" : "#3A2F05",
        "silver" : "#292E37",
        "bronze" : "#271304"
      },
      backgroundColor : {
        "primary" : "#000000",
        "secondary" : "#0A0A0A"
      },
      fontFamily : {
        cairo : ["var(--font-cairo)"]
      }
    },
  },
  plugins: [],
} satisfies Config;
