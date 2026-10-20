/** @type {import('tailwindcss').Config} */
// KAINORA KIDS — Neo-Brutalist design tokens.
// Palet mengikuti gambar referensi: krem editorial, tinta hitam, merah checkerboard,
// kuning kanvas, pink/teal/biru/oranye untuk panel.
// Skala `gray`, `amber`, `red`, `pink` di-remap supaya seluruh halaman lama
// (yang masih memakai kelas itu) otomatis ikut ke satu sistem desain.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#FFF9EA',
        ink: '#14110F',
        paper: '#FFF9EA',
        cream: '#F3E9D2',
        brand: {
          red: '#E0322B',
          brick: '#C23F2B',
          yellow: '#FFE11A',
          pink: '#F59DC2',
          teal: '#62C6B3',
          blue: '#6B8FDA',
          sky: '#3B8FD9',
          orange: '#F28A2E',
          green: '#1FA86B',
        },
        gray: {
          50: '#FBF5E6',
          100: '#F3E9D2',
          200: '#E4D5B3',
          300: '#CDBB93',
          400: '#9C917F',
          500: '#6B6155',
          600: '#4D443A',
          700: '#383129',
          800: '#241F1A',
          900: '#14110F',
        },
        amber: {
          50: '#FFF6D6',
          100: '#FFEC9E',
          200: '#FFE46B',
          300: '#FFDD3D',
          400: '#FFE11A',
          500: '#FFCB05',
          600: '#E0A800',
          700: '#8A5E00',
        },
        red: {
          50: '#FDE7E4',
          100: '#FAC9C4',
          500: '#E0322B',
          600: '#E0322B',
          700: '#B8241E',
        },
        pink: {
          100: '#FCDDEA',
          400: '#F27DAE',
          500: '#F59DC2',
          600: '#E4679E',
        },
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'system-ui', 'sans-serif'],
        arcade: ['Bungee', 'Archivo', 'sans-serif'],
        pixel: ['"Pixelify Sans"', 'Archivo', 'monospace'],
      },
      boxShadow: {
        solid: '6px 6px 0 0 #14110F',
        'solid-sm': '3px 3px 0 0 #14110F',
        'solid-lg': '10px 10px 0 0 #14110F',
      },
      borderRadius: {
        panel: '22px',
      },
      keyframes: {
        'floor-run': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(var(--floor-cell-double))' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--r, 0deg))' },
          '50%': { transform: 'translateY(-12px) rotate(calc(var(--r, 0deg) + 3deg))' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        'marquee-x': {
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        bob: 'bob 4.5s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
      },
    },
  },
  plugins: [],
};
