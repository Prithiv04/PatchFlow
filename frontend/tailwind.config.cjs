// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#121217',
        card: '#181820',
        border: '#27272a',
        primary: {
          DEFAULT: '#7c3aed',
          hover: '#6d28d9',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        text: '#f8fafc',
        muted: '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 20px -3px rgba(124, 58, 237, 0.3)',
      },
    },
  },
  plugins: [],
};
