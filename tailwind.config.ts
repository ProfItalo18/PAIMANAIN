import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paiBlue: '#0070b8',
        paiGreen: '#5c9f45',
        ink: '#0f172a'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(0,112,184,.22)',
        card: '0 16px 45px rgba(15,23,42,.08)'
      },
      backgroundImage: {
        aurora: 'radial-gradient(circle at top left, rgba(0,112,184,.22), transparent 32rem), radial-gradient(circle at top right, rgba(92,159,69,.18), transparent 28rem), linear-gradient(135deg, #f8fafc 0%, #eef7ff 45%, #f7fff4 100%)'
      }
    }
  },
  plugins: []
} satisfies Config;
