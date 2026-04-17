/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f1117',
        panel: '#1a1f2e',
        border: '#2a2f42',
      },
    },
  },
  plugins: [],
}
