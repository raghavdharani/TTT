/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#1e1b4b', // Indigo 950 - Softer, richer blue instead of pitch black
          800: '#312e81', // Indigo 900 - Lighter for cards
          700: '#4338ca', // Indigo 800
        },
        primary: {
          glow: '#c084fc', // Purple 400 - Brighter glow
          accent: '#818cf8', // Indigo 400
        },
        token: {
          x: '#f87171', // Red 400 - Brighter/Softer red
          o: '#60a5fa', // Blue 400 - Brighter/Softer blue
        },
        status: {
          success: '#34d399', // Emerald 400
          attention: '#fbbf24', // Amber 400
          error: '#f87171', // Red 400
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(168, 85, 247, 0.3)',
        'glow-md': '0 0 20px rgba(168, 85, 247, 0.5)',
        'glow-lg': '0 0 30px rgba(168, 85, 247, 0.7)',
        'glow-x': '0 0 15px rgba(220, 38, 38, 0.6)',
        'glow-o': '0 0 15px rgba(37, 99, 235, 0.6)',
      }
    },
  },
  plugins: [],
}


