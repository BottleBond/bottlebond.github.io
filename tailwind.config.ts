import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Earth tones (luxury whiskey aesthetic)
        'burnt-sienna': {
          50: '#fdf6f3',
          100: '#fbeae4',
          200: '#f8d5c8',
          300: '#f2b6a0',
          400: '#e98b6e',
          500: '#8B4513', // Primary burnt sienna
          600: '#7a3c10',
          700: '#66310e',
          800: '#552912',
          900: '#472414',
        },
        'deep-brown': {
          50: '#f9f6f4',
          100: '#f2ebe6',
          200: '#e3d4ca',
          300: '#d1b7a6',
          400: '#ba9179',
          500: '#654321', // Primary deep brown
          600: '#5a3b1c',
          700: '#4a3018',
          800: '#3e2815',
          900: '#352214',
        },
        gold: {
          50: '#fdfaeb',
          100: '#fbf3cc',
          200: '#f7e799',
          300: '#f2d35d',
          400: '#ecc033',
          500: '#D4AF37', // Primary gold
          600: '#b8902a',
          700: '#996d25',
          800: '#7d5624',
          900: '#684722',
        },
        'dark-orange': {
          50: '#fef5f4',
          100: '#fde9e7',
          200: '#fcd6d3',
          300: '#f9b6b0',
          400: '#f48b82',
          500: '#CD5C5C', // Primary dark orange/indian red
          600: '#b54747',
          700: '#983838',
          800: '#7e3232',
          900: '#6a2f2f',
        },
        // Secondary - Muted blue accent
        'slate-blue': {
          50: '#f5f7fa',
          100: '#eaeff4',
          200: '#d1dce6',
          300: '#a9bfd0',
          400: '#7b9db5',
          500: '#708090', // Primary slate blue
          600: '#5b6b7a',
          700: '#4b5864',
          800: '#414b54',
          900: '#393f48',
        },
        // Neutral - Background and text
        cream: {
          50: '#FDFDFB',
          100: '#F5F5F0', // Primary cream
          200: '#EDEDE5',
          300: '#E0E0D6',
          400: '#D0D0C4',
        },
        charcoal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#2C2C2C', // Primary charcoal
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      lineHeight: {
        relaxed: '1.6',
        loose: '1.8',
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
      },
      boxShadow: {
        warm: '0 4px 6px rgba(139, 69, 19, 0.1)',
        'warm-lg': '0 10px 15px rgba(139, 69, 19, 0.15)',
        'warm-xl': '0 20px 25px rgba(139, 69, 19, 0.2)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
        slow: '300ms',
      },
    },
  },
  plugins: [],
};

export default config;
