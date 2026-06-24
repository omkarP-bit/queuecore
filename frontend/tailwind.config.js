/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A6BFF',
          dark: '#0F4FCC',
          light: '#E8F0FF',
        },
        accent: {
          DEFAULT: '#00C48C',
          light: '#E6FAF4',
        },
        urgent: '#FF6B35',
        emergency: '#E53E3E',
        surface: '#1A1F2E',
        bg: {
          DEFAULT: '#0D1117',
          light: '#121827',
          dark: '#090B10',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        border: '#2D3748',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 10px 30px -10px rgba(0,0,0,0.5)',
        float: '0 10px 30px -10px rgba(0,0,0,0.5), 0 0 20px rgba(26,107,255,0.2)',
        modal: '0 24px 64px rgba(0,0,0,0.16)',
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
