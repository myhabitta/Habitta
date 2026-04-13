import type { Config } from 'tailwindcss';

// ─── Habitta Dashboard — Tailwind Config ───────────────────────────────────
//
// COLORES UI (background, text, border…)
//   → Se editan en app/globals.css  (:root = light,  .dark = dark mode)
//   → Los valores son HEX directos — fácil de leer y cambiar
//
//
// ──────────────────────────────────────────────────────────────────────────

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── Brand Colors (misma paleta que website) ────────────────
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

        // ─── UI colors (CSS variables de globals.css) ───────────────
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          tint: 'var(--destructive-tint)',
          foreground: 'var(--destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          tint: 'var(--success-tint)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          tint: 'var(--warning-tint)',
          foreground: 'var(--warning-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        // ─── Habitta tokens temáticos (CSS variables de globals.css) ─
        habitta: {
          accent: 'var(--habitta-accent)',
          'accent-hover': 'var(--habitta-accent-hover)',
          'accent-light': 'var(--habitta-accent-light)',
          'accent-tint': 'var(--habitta-accent-tint)',
          'accent-foreground': 'var(--habitta-accent-foreground)',
          brand: 'var(--habitta-brand)',
          'brand-foreground': 'var(--habitta-brand-foreground)',
          sidebar: {
            bg: 'var(--habitta-sidebar-bg)',
            border: 'var(--habitta-sidebar-border)',
            text: 'var(--habitta-sidebar-text)',
            'text-active': 'var(--habitta-sidebar-text-active)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        display: ['"Work Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        primary: ['"Work Sans"', 'system-ui', 'sans-serif'],
        secondary: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
