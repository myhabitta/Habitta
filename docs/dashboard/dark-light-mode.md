# Dark / Light Mode — Habitta Dashboard

## Stack utilizado
- next-themes para manejo del tema
- TailwindCSS darkMode: 'class'
- shadcn/ui (compatible nativamente via CSS variables)

## Cómo funciona

```
ThemeProvider (next-themes)
  → agrega/quita clase `.dark` en <html>
  → Tailwind activa variantes `dark:`
  → CSS variables en :root y .dark cambian
  → shadcn/ui aplica los colores correctos automáticamente
```

## Cómo usar en componentes nuevos

Siempre preferir las variables de shadcn/ui:

```tsx
// Correcto — dark mode automático
<div className="bg-background text-foreground">
<div className="bg-card text-card-foreground">
<div className="bg-muted text-muted-foreground">

// Solo si necesitas dark explícito
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

// Evitar — no cambia con el tema
<div className="bg-[#ffffff]">
```

## Dónde está el toggle

`components/ui/ThemeToggle.tsx` — se integra en el Header en la Fase 4.

## Temas disponibles

| Tema | Comportamiento |
| --- | --- |
| `light` | Modo claro forzado |
| `dark` | Modo oscuro forzado |
| `system` | Sigue la preferencia del sistema operativo (default) |

## Colores disponibles por contexto

| Clase Tailwind | Light | Dark | Uso |
| --- | --- | --- | --- |
| `bg-background` | blanco | azul oscuro | Fondo de página |
| `bg-card` | blanco | azul oscuro | Contenedores Card |
| `bg-muted` | gris claro | gris azulado | Fondos de inputs, filas |
| `text-foreground` | casi negro | casi blanco | Texto principal |
| `text-muted-foreground` | gris | gris claro | Texto secundario |
| `border-border` | gris claro | gris azulado | Bordes de componentes |
| `bg-brand` | #C8763A | #C8763A | Brand Habitta (no cambia) |

## Estructura de archivos

```
apps/dashboard/
├── app/
│   ├── globals.css              → CSS variables :root y .dark
│   └── layout.tsx               → ThemeProvider envuelve toda la app
├── components/
│   ├── providers/
│   │   └── ThemeProvider.tsx    → Wrapper de next-themes
│   └── ui/
│       └── ThemeToggle.tsx      → Botón Sun/Moon para el header
└── tailwind.config.ts           → darkMode: ['class'] + hsl(var(--x))
```
