/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          teal: '#102C38',
          dark: '#0A1B22',
          deep: '#061116',
        },
        navy: {
          deep: '#101B35',
          royal: '#17254A',
        },
        lavender: {
          muted: '#A99BBF',
          light: '#C4B8D8',
          dark: '#82749A',
        },
        lotus: {
          pink: '#E98EAF',
          deep: '#D16D91',
          blush: '#F4C4D2',
          petal: '#FBDCE5',
        },
        ivory: {
          warm: '#F3EAE2',
          light: '#FAF6F2',
          muted: '#DED1C4',
        },
        diya: {
          glow: '#FFE29A',
          amber: '#FDB863',
          flame: '#FF8833',
          terracotta: '#A65337',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'flame-flicker': 'flicker 3s infinite ease-in-out',
        'float-slow': 'float 7s infinite ease-in-out',
        'petal-drift': 'petalDrift 12s infinite linear',
        'pulse-subtle': 'pulseSubtle 4s infinite ease-in-out',
        'lantern-sway': 'sway 6s infinite ease-in-out',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', opacity: '0.95' },
          '25%': { transform: 'scale(1.06, 0.96) rotate(1.5deg)', opacity: '1' },
          '50%': { transform: 'scale(0.97, 1.04) rotate(-0.5deg)', opacity: '0.88' },
          '75%': { transform: 'scale(1.04, 1.01) rotate(1deg)', opacity: '0.97' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2.5deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.95', transform: 'scale(1.04)' },
        },
        petalDrift: {
          '0%': { transform: 'translate(0, -10px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.85' },
          '90%': { opacity: '0.75' },
          '100%': { transform: 'translate(80px, 100vh) rotate(360deg)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}

