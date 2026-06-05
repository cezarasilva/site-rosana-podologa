import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff0f3',
          100: '#ffe0e7',
          200: '#ffc6d4',
          300: '#ff9ab3',
          400: '#ff6090',
          500: '#ff2d71',
          600: '#f00056',
          700: '#cc0049',
          800: '#a80043',
          900: '#8f003e',
          950: '#500020',
        },
        rose: {
          primary: '#c2185b',
          light: '#fce4ec',
          medium: '#f48fb1',
          dark: '#880e4f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
