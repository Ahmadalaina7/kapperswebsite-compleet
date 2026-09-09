import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fbf9f1',
          100: '#f6f1df',
          200: '#ecdfbf',
          300: '#dfc698',
          400: '#d2ab72',
          500: '#c69553',
          600: '#ba8046',
          700: '#9a633a',
          800: '#7f5234',
          900: '#67442d',
          950: '#382316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(198, 149, 83, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
