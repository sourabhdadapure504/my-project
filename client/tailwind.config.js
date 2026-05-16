/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        neon: {
          green: '#39ff14',
          blue: '#00f5ff',
          purple: '#bf5fff',
          red: '#ff003c',
          yellow: '#fff01f',
        },
        dark: {
          900: '#020409',
          800: '#060d18',
          700: '#0a1628',
          600: '#0f1f3d',
          500: '#152847',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
        body: ['Syne', 'sans-serif'],
      },
      boxShadow: {
        'neon-teal': '0 0 20px rgba(20, 184, 166, 0.5), 0 0 60px rgba(20, 184, 166, 0.2)',
        'neon-blue': '0 0 20px rgba(0, 245, 255, 0.5), 0 0 60px rgba(0, 245, 255, 0.2)',
        'neon-red': '0 0 20px rgba(255, 0, 60, 0.5), 0 0 60px rgba(255, 0, 60, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanLine 2s linear infinite',
        'flicker': 'flicker 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(20,184,166,0.2), 0 0 20px rgba(20,184,166,0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(20,184,166,0.6), 0 0 60px rgba(20,184,166,0.3)' },
        }
      }
    },
  },
  plugins: [],
}
