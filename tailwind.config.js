/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Burası 'src' klasörü ihtimalini de kapsar:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        legal: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          500: '#334e68', // Kurumsal Mavi
          600: '#243b53', // Koyu Mavi
          800: '#102a43', // Lacivert (Otorite Rengi)
          900: '#0a1c2e', // Gece Mavisi
          gold: '#c5a365', // Premium Altın (Güven/Kalite)
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'paper': '0 1px 1px rgba(0,0,0,0.15), 0 10px 0 -5px #eee, 0 10px 1px -4px rgba(0,0,0,0.15), 0 20px 0 -10px #eee, 0 20px 1px -9px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
};