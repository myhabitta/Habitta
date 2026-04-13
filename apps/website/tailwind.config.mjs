/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      // ─── Brand Colors ──────────────────────────────────────────
      colors: {
        primary: '#424832',
        secondary: '#c5b1a0',
        tertiary: '#27272a',
        quaternary: '#E8703A',
        quinary: '#759465',
        dark: '#1E1A1B',
        light: '#f8f8f8',
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#F9F8F6',
          accent: '#F3F1ED',
        },
        ink: {
          DEFAULT: '#1E1A1B',
          muted: 'rgba(30, 26, 27, 0.55)',
          subtle: 'rgba(30, 26, 27, 0.35)',
          faint: 'rgba(30, 26, 27, 0.08)',
        },
      },

      // ─── Typography ────────────────────────────────────────────
      fontFamily: {
        display: ['"Work Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        primary: ['"Work Sans"', 'system-ui', 'sans-serif'],
        secondary: ['Inter', 'system-ui', 'sans-serif'],
      },

      // ─── Animations ────────────────────────────────────────────
      animation: {
        'fade-up': 'fadeUp 0.9s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        float: 'float 12s ease-in-out infinite',
        'scroll-down': 'scrollDown 2s cubic-bezier(0.77,0,0.18,1) infinite',
        reveal: 'reveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-in-right': 'slideInRight 0.7s ease forwards',
        'draw-line': 'drawLine 0.8s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(20px,-30px) scale(1.04)' },
          '66%': { transform: 'translate(-15px,20px) scale(0.97)' },
        },
        scrollDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateY(350%)', opacity: '0' },
        },
        reveal: {
          from: { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        drawLine: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
};
