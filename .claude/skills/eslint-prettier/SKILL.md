---
name: eslint-prettier
description: ESLint and Prettier linting, formatting, and code quality for the Habitta monorepo. Use when fixing lint errors, configuring ESLint rules, formatting code, auditing imports, or running format checks across website (Astro), dashboard (Next.js), and shared packages.
license: MIT
metadata:
  authors: 'Habitta Team'
  version: '1.0.0'
---

# ESLint + Prettier — Habitta Monorepo

Guía de linting y formateo para el monorepo Habitta. El proyecto usa **ESLint** para calidad de código y **Prettier** para formato consistente.

---

## Stack de linting

| App / Package        | Herramienta      | Comando                        |
| -------------------- | ---------------- | ------------------------------ |
| `apps/website`       | ESLint           | `pnpm --filter website lint`   |
| `apps/dashboard`     | ESLint (Next.js) | `pnpm --filter dashboard lint` |
| Todo el monorepo     | Prettier         | `pnpm format`                  |
| Verificar sin editar | Prettier (check) | `pnpm format:check`            |
| Todo el monorepo     | ESLint           | `pnpm lint`                    |

---

## Comandos esenciales

```bash
# Lint de todo el monorepo
pnpm lint

# Lint solo website (Astro + TS)
pnpm --filter website lint

# Lint solo dashboard (Next.js)
pnpm --filter dashboard lint

# Formatear todo con Prettier
pnpm format

# Verificar formato sin modificar archivos
pnpm format:check

# Lint de un package específico
pnpm --filter @habitta/utils lint
pnpm --filter @habitta/ui lint
```

---

## Configuración ESLint — website (Astro)

El script de lint del website corre: `eslint src --ext .ts,.tsx,.astro`

Reglas clave para archivos `.astro`:

- Usar `eslint-plugin-astro` para soporte de templates Astro
- No usar React en componentes estáticos — solo `.astro`
- Las Islands de React van en `src/components/*.tsx`

```js
// eslint.config.js (website)
import astro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

export default [
  ...astro.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
```

## Configuración ESLint — dashboard (Next.js)

El dashboard usa `next lint` que ya incluye:

- `eslint-config-next` con reglas de React, accesibilidad y Next.js
- Parser TypeScript por defecto

```js
// .eslintrc.json (dashboard)
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
```

---

## Configuración Prettier (monorepo)

El formato se aplica a: `**/*.{ts,tsx,astro,json,md}`

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": { "parser": "astro" }
    }
  ]
}
```

---

## Reglas críticas del proyecto

### TypeScript

```
❌ no-explicit-any      → Prohibido usar `any`. Usar `unknown` si el tipo es incierto.
✅ strict: true         → Siempre activo en todos los tsconfig.json
❌ no-unused-vars       → Variables no usadas = error
```

### Imports

```
✅ Orden: externos → internos (@habitta/*) → relativos
✅ Usar path aliases en vez de rutas relativas largas
❌ No importar @supabase/supabase-js directamente → usar @habitta/database
❌ No duplicar tipos → si existe en @habitta/types, importarlo de ahí
```

### Nombrado

```
PascalCase  → Componentes React/Astro: Button.tsx, ProjectCard.astro
camelCase   → Utilidades, tipos: formatPrice.ts, project.ts
UPPER_SNAKE → Constantes globales: MAX_LEADS_PER_PAGE
kebab-case  → Slugs de proyectos: bello-antioquia
```

---

## Flujo de trabajo antes de commit

```bash
# 1. Verificar tipos TypeScript
npx tsc --noEmit

# 2. Lint de todo el monorepo
pnpm lint

# 3. Verificar formato
pnpm format:check

# 4. Si hay errores de formato, aplicar
pnpm format

# 5. Lint final
pnpm lint
```

---

## Errores comunes y soluciones

### Error: `any` detectado

```typescript
// ❌ Incorrecto
const data: any = await fetchData();

// ✅ Correcto
const data: unknown = await fetchData();
// o con tipo explícito:
const data: Project[] = await getProjects();
```

### Error: import directo a Supabase

```typescript
// ❌ Incorrecto
import { createClient } from '@supabase/supabase-js';

// ✅ Correcto
import { getProjects } from '@habitta/database';
```

### Error: ruta relativa larga

```typescript
// ❌ Incorrecto
import { Button } from '../../../packages/ui/src/Button';

// ✅ Correcto
import { Button } from '@habitta/ui';
```

### Error: componente React para contenido estático en website

```
// ❌ Incorrecto — usar React para header estático
// ✅ Correcto — usar .astro para contenido sin interactividad
```
