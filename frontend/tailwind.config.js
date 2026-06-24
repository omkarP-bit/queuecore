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
        surface: '#FFFFFF',
        bg: {
          DEFAULT: '#F4F7FF',
          dark: '#0D1117',
        },
        text: {
          primary: '#0D1117',
          secondary: '#4A5568',
          muted: '#A0AEC0',
        },
        border: '#E2E8F0',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(26,107,255,0.08), 0 0 0 1px #E2E8F0',
        float: '0 8px 32px rgba(26,107,255,0.12), 0 2px 8px rgba(0,0,0,0.04)',
        modal: '0 24px 64px rgba(0,0,0,0.16)',
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
