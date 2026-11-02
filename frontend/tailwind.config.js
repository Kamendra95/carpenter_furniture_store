/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#fdf8f3',
          100: '#faf0e6',
          200: '#f5e1d3',
          300: '#ebcab8',
          400: '#dfae93',
          500: '#d18f6e',
          600: '#c07353',
          700: '#a35b42',
          800: '#864b3a',
          900: '#6e3f33',
          950: '#3a1f19',
        },
        cream: {
          50: '#fffefc',
          100: '#fefcf5',
          200: '#fdf7e8',
          300: '#f0dfc3',
          400: '#e8cfa6',
          500: '#8a6a58',
          600: '#745241',
          700: '#5e4032',
          800: '#4b3127',
          900: '#3c261e',
        },
        charcoal: {
          50: '#f0f0f0',
          100: '#e0e0e0',
          200: '#c7c7c7',
          300: '#a3a3a3',
          400: '#858585',
          500: '#6b6b6b',
          600: '#555555',
          700: '#464646',
          800: '#3d3d3d',
          900: '#363636',
          950: '#1f1f1f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(58, 31, 25, 0.06)',
        'warm': '0 12px 32px -14px rgba(58, 31, 25, 0.28)',
        'warm-lg': '0 24px 60px -24px rgba(58, 31, 25, 0.4)',
      },
      container: {
        center: true,
        padding: '1.5rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
}