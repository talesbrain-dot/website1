/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#12213A',
          dark: '#0B1526',
          light: '#1E3457',
        },
        brass: {
          DEFAULT: '#C08A2E',
          light: '#DCAF5C',
          dark: '#96691E',
        },
        paper: {
          DEFAULT: '#F6F3EC',
          dark: '#EDE6D6',
          line: '#DCD3BE',
        },
        charcoal: '#1B1B1B',
        registration: '#B23A2E',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1180px',
      },
    },
  },
  plugins: [],
};
