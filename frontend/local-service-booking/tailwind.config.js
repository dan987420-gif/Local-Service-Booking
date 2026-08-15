/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Deep Indigo
          hover: '#4338CA',
        },
        secondary: {
          DEFAULT: '#0D9488', // Teal
          hover: '#0F766E',
        },
        background: '#F8FAFC',
        card: '#FFFFFF',
        text: {
          main: '#0F172A',
          muted: '#64748B',
        },
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
