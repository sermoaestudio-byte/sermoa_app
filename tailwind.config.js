/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--brand-50, #f4f7f4)',
          100: 'var(--brand-100, #e5ece5)',
          200: 'var(--brand-200, #cadbcd)',
          300: 'var(--brand-300, #a3c2a8)',
          400: 'var(--brand-400, #75a37e)',
          500: 'var(--brand-500, #54875e)',
          600: 'var(--brand-600, #406c49)',
          700: 'var(--brand-700, #34573c)',
          800: 'var(--brand-800, #2b4632)',
          900: 'var(--brand-900, #253a2b)',
          950: 'var(--brand-950, #131f17)',
          olive: 'var(--brand-500, #54875e)',
          darkolive: 'var(--brand-600, #406c49)',
        },
        sage: {
          50: '#f6f7f5',
          100: '#eaede7',
          200: '#d5dcd0',
          300: '#b6c4af',
          400: '#94a78b',
          500: '#778c6e',
          600: '#5e7056',
          700: '#4b5945',
          800: '#3e493a',
          900: '#343e32',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'card': '0 0 0 1px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
