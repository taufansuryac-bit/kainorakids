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
        white: '#FFFFFF',
        ink: '#191917',
        paper: '#FFFFFF',
        cream: '#FFFFFF',
        brand: {
          red: '#222222',
          brick: '#222222',
          yellow: '#D9FF38',
          pink: '#EFEFEC',
          teal: '#F3F3F0',
          blue: '#404040',
          sky: '#404040',
          orange: '#E9E9E4',
          green: '#536814',
        },
        gray: {
          50: '#FAFAF8',
          100: '#F3F3F0',
          200: '#E4E4DF',
          300: '#CACAC5',
          400: '#92928E',
          500: '#666662',
          600: '#484845',
          700: '#333330',
          800: '#222220',
          900: '#0C0C0C',
        },
        amber: {
          50: '#F8F9F2',
          100: '#EEF2D3',
          200: '#E3EBAD',
          300: '#D9E780',
          400: '#D9FF38',
          500: '#D9FF38',
          600: '#839721',
          700: '#4E5C11',
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
        arcade: ['Archivo', 'sans-serif'],
        pixel: ['"Pixelify Sans"', 'Archivo', 'monospace'],
      },
      boxShadow: {
        solid: '6px 6px 0 0 #0C0C0C',
        'solid-sm': '3px 3px 0 0 #0C0C0C',
        'solid-lg': '10px 10px 0 0 #0C0C0C',
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
