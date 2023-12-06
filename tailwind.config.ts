import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Luckiest Guy', 'sans-serif'],
        serif: ['Luckiest Guy', 'sans-serif'],
      },
      colors: {
        'Holiday-Green': '#0D5753',
        'Holiday-Red': '#881425',
        'Pill-Green': '#A2D7BF',
        'AI-Green': '#D3F2F5',
        'Light-Green': '#C6D5C5',
        'Holiday-Blue': '#2F4665',
        'Light-Red': '#D0BABC',
        'White-75': 'rgba(255, 255, 255, 0.75)',

      },
      borderRadius: {
        'jumbo': '32px',
      },
      dropShadow: {
        'avatar': '0px 4px 4px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
export default config
