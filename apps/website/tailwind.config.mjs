/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      // ─── Dark Theme Colors (v4 Design) ───────────────────────────
      colors: {
        brand: {
          DEFAULT: '#E8703A',
          dark: '#c8592a',
          light: '#f09060',
        },
        sand: '#c5b1a0',
        olive: '#424832',
        dark: '#1E1A1B',
        light: '#f0ebe5',
        muted: '#6b635d',
        surface: {
          DEFAULT: '#1E1A1B',
          raised: '#141212',
          accent: '#2a2626',
        },
        ink: {
          DEFAULT: '#f0ebe5',
          muted: 'rgba(240, 235, 229, 0.5)',
          subtle: 'rgba(240, 235, 229, 0.35)',
          faint: 'rgba(240, 235, 229, 0.12)',
          ghost: 'rgba(240, 235, 229, 0.18)',
        },
        border: {
          DEFAULT: 'rgba(197, 177, 160, 0.1)',
        },
      },

      // ─── Typography ──────────────────────────────────────────────
      fontFamily: {
        display: ['"Work Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      // ─── Animations ──────────────────────────────────────────────
      animation: {
        'fade-up': 'fadeUp 0.9s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        ticker: 'ticker 22s linear infinite',
        'ticker-reverse': 'ticker 22s linear infinite reverse',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'scroll-line': 'scrollLine 2s ease-in-out infinite',
        'draw-line': 'drawLine 0.8s ease forwards',
        'ripple-out': 'rippleOut 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(36px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        ticker: {
          to: { transform: 'translateX(-50%)' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.6)', opacity: '0.5' },
        },
        scrollLine: {
          '0%': { top: '-100%' },
          '100%': { top: '200%' },
        },
        drawLine: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        rippleOut: {
          to: { transform: 'translate(-50%, -50%) scale(25)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
