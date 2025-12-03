/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B58",
        secondary: "#2D3142", 
        accent: "#FFB347",
        surface: "#FFFFFF",
        background: "#F8F9FA"
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      animation: {
        'bounce-cart': 'bounce 0.6s',
        'pulse-glow': 'pulse 0.8s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}