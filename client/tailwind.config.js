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
          navy: '#0B132B',       // Primary deep navy/space cadet
          indigo: '#1C2541',     // Card / container dark indigo
          slate: '#3A506B',      // Secondary muted slate
          teal: '#06D6A0',       // Vibrant futuristic teal
          tealDark: '#0D9488',   // Accessible teal text on light bg
          amber: '#F59E0B',      // Warm amber accent
          amberLight: '#FEF3C7', // Amber pill background
          coral: '#FF6B6B',      // Playful coral accent
          coralDark: '#E11D48',  // Accessible coral
          light: '#F8FAFC',      // Off-white canvas
          cardLight: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}

