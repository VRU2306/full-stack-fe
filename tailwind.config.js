/** @type {import('tailwindcss').Config} */
import { colors as defaultColors } from 'tailwindcss/defaultTheme';
import { colors } from "@mui/material";
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...defaultColors,
        ...colors,
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
      fontSize: {
        'custom-sm': ['12px', { lineHeight: '15.6px' }],
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
        },
      },
    },
  },
  plugins: [],
}

