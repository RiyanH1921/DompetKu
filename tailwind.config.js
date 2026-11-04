/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F6F5EE',
          'bg-dark': '#121614',
          surface: '#FFFFFF',
          'surface-dark': '#1C221E',
          card: '#EDECE4',
          'card-dark': '#252D28',
          green: '#1B3B2B',
          'green-light': '#244C38',
          'green-dark': '#13281E',
          income: '#25724A',
          'income-bg': '#EAF3ED',
          expense: '#A73C2C',
          'expense-bg': '#F9ECE9',
          amber: '#D19E52',
          'amber-light': '#F6EEDB',
          text: '#1C201D',
          'text-dark': '#F0F2EF',
          muted: '#767A73',
          'muted-dark': '#9CA099',
          border: '#E3E1D5',
          'border-dark': '#2E3831',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [],
}

