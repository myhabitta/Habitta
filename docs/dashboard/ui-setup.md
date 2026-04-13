# Dashboard — UI Setup (Tailwind + shadcn/ui)

## Stack de UI

| Herramienta              | Versión | Para qué                              |
| ------------------------ | ------- | ------------------------------------- |
| TailwindCSS              | v3      | Estilos utility-first                 |
| shadcn/ui                | latest  | Componentes accesibles sobre Radix UI |
| clsx                     | latest  | Condicionales de clases               |
| tailwind-merge           | latest  | Merge inteligente de clases Tailwind  |
| class-variance-authority | latest  | Variantes de componentes (cva)        |

---

## Archivos clave de configuración

### `tailwind.config.ts`

- `darkMode: ['class']` — dark mode vía clase CSS
- `content` apunta a `app/`, `components/` y `../../packages/ui/`
- `theme.extend.colors` mapea las CSS variables de shadcn (`--primary`, `--background`, etc.)

### `app/globals.css`

Tiene tres secciones:

1. Directivas de Tailwind (`@tailwind base/components/utilities`)
2. CSS variables de shadcn en `:root` (modo claro) y `.dark` (modo oscuro) — base **slate**
3. Reset base: `border-border` en `*`, `bg-background text-foreground` en `body`

### `postcss.config.js`

Plugins: `tailwindcss` y `autoprefixer`.

### `lib/utils.ts`

Función `cn()` usada por todos los componentes shadcn:

```ts
import { cn } from '@/lib/utils';
// Combina clsx + tailwind-merge para merge seguro de clases
```

---

## Componentes instalados

Ubicación: `components/ui/`

| Componente | Archivo      | Cuándo usarlo                                                                        |
| ---------- | ------------ | ------------------------------------------------------------------------------------ |
| `Button`   | `button.tsx` | Acciones primarias, secundarias, destructivas                                        |
| `Card`     | `card.tsx`   | Contenedores de sección con CardHeader, CardContent, CardFooter                      |
| `Input`    | `input.tsx`  | Campos de texto de formularios                                                       |
| `Label`    | `label.tsx`  | Etiquetas accesibles para inputs                                                     |
| `Form`     | `form.tsx`   | Formularios con react-hook-form + validación                                         |
| `Table`    | `table.tsx`  | Tablas de datos con header, body, row, cell                                          |
| `Badge`    | `badge.tsx`  | Estados, etiquetas, categorías (variantes: default, secondary, destructive, outline) |

---

## Cómo importar

```ts
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
```

---

## Cómo agregar más componentes shadcn

```bash
# Desde apps/dashboard/
npx shadcn@latest add <nombre-componente>
```

Los componentes se crearán en `components/ui/` automáticamente si se corre desde el directorio correcto.

---

## Dependencias instaladas (en dashboard)

```json
"dependencies": {
  "@radix-ui/react-slot": "...",
  "@radix-ui/react-label": "...",
  "@radix-ui/react-checkbox": "...",
  "class-variance-authority": "...",
  "clsx": "...",
  "tailwind-merge": "...",
  "react-hook-form": "...",
  "@hookform/resolvers": "...",
  "zod": "..."
}
```
