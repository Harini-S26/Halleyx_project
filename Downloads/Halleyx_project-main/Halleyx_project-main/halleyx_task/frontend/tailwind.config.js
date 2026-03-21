/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff', 100: '#e0e9ff', 200: '#c7d7fe',
          300: '#a5b8fc', 400: '#818cf8', 500: '#6366f1',
          600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81',
        },
        surface: {
          50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7',
          300: '#d4d4d8', 800: '#27272a', 900: '#18181b', 950: '#09090b',
        }
      },
      boxShadow: {
        card:        '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover':'0 4px 12px 0 rgba(0,0,0,0.08)',
        modal:       '0 20px 60px -10px rgba(0,0,0,0.2)',
        brand:       '0 4px 24px -4px rgba(99,102,241,0.4)',
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    }
  },
  plugins: []
}
