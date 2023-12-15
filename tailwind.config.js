import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Luckiest Guy', 'sans-serif'],
        serif: ['Luckiest Guy', 'sans-serif'],
      },
      colors: {
        'Holiday-Green': '#0D5753',
        'Holiday-Green-Edge': '#072A28',
        'Holiday-Red': '#881425',
        'Pill-Green': '#A2D7BF',
        'AI-Green': '#D3F2F5',
        'Light-Green': '#C6D5C5',
        'Holiday-Blue': '#2F4665',
        'Light-Red': '#D0BABC',
        'White-75': 'rgba(255, 255, 255, 0.75)',
        'Primary-Button-Shadow': 'hsl(0deg 0% 0% / 0.25);',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        jumbo: '32px',
        epic: '36px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      dropShadow: {
        avatar: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      },
      backgroundColor: {
        epic: 'hsl(0deg 0% 0% / 0.25);',
      },
      transformOrigin: {
        '1px': 'translateY(1px)',
        '2px': 'translateY(2px)',
        '4px': 'translateY(4px)',
        '6px': 'translateY(6px)',
        '-4px': 'translateY(-4px)',
        '-6px': 'translateY(-6px)',
      },
      boxShadow: {
        'Holiday-Green': 'inset 0 0 0 1px #0D5753',
        'Holiday-Red': 'inset 0 0 0 1px #A91A2F',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
