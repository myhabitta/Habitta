---
name: build-check
description: Build validation, test execution, and pre-deploy checks for the Habitta monorepo. Use before pushing to main, when debugging build errors, running tests, validating TypeScript compilation, or verifying the Turbo pipeline across website (Astro) and dashboard (Next.js).
license: MIT
metadata:
  authors: 'Habitta Team'
  version: '1.0.0'
---

# Build Check — Habitta Monorepo

Guía de validación de builds y tests para el monorepo Habitta. Usa **Turbo** para orchestar builds en paralelo y **Jest** para tests unitarios.

---

## Pipeline de builds

```
habitta (raíz)
├── turbo run build
│   ├── packages/utils    → build primero (dependencia)
│   ├── packages/types    → build primero (dependencia)
│   ├── packages/ui       → build (depende de types)
│   ├── packages/database → build (depende de types)
│   ├── apps/website      → astro build (depende de packages)
│   └── apps/dashboard    → next build (depende de packages)
```

Turbo respeta `"dependsOn": ["^build"]` — siempre buildea packages antes que las apps.

---

## Comandos esenciales

```bash
# Build completo del monorepo (recomendado antes de push)
pnpm build

# Build solo website (Astro → genera /dist)
pnpm --filter website build

# Build solo dashboard (Next.js → genera /.next)
pnpm --filter dashboard build

# Build de un package específico
pnpm --filter @habitta/utils build
pnpm --filter @habitta/ui build
pnpm --filter @habitta/database build
pnpm --filter @habitta/types build

# Preview del website después del build
pnpm --filter website preview
```

---

## Comandos de tests

```bash
# Correr todos los tests del monorepo
pnpm test

# Tests de un package específico
pnpm --filter @habitta/utils test
pnpm --filter @habitta/ui test

# Tests en modo watch (desarrollo)
pnpm test --watch

# Tests con coverage
pnpm test --coverage
```

---

## Checklist pre-deploy (ejecutar en orden)

```bash
# 1. Verificar TypeScript en todo el monorepo
npx tsc --noEmit

# 2. Lint
pnpm lint

# 3. Formato
pnpm format:check

# 4. Tests
pnpm test

# 5. Build completo
pnpm build

# Si todo pasa → seguro para push a main
```

---

## Verificar TypeScript por app

```bash
# Website
cd apps/website && npx tsc --noEmit

# Dashboard
cd apps/dashboard && npx tsc --noEmit

# Package utils
cd packages/utils && npx tsc --noEmit
```

---

## Outputs de build

| App / Package       | Output   | Notas                           |
| ------------------- | -------- | ------------------------------- |
| `apps/website`      | `dist/`  | Astro static build              |
| `apps/dashboard`    | `.next/` | Next.js build (ignorado en git) |
| `packages/ui`       | `dist/`  | Componentes compilados          |
| `packages/utils`    | `dist/`  | Utilidades compiladas           |
| `packages/types`    | `dist/`  | Tipos compilados                |
| `packages/database` | `dist/`  | Cliente DB compilado            |

---

## Errores comunes de build

### Error: módulo de workspace no encontrado

```
Cannot find module '@habitta/utils'
```

**Solución:**

```bash
# Verificar que el package está en pnpm-workspace.yaml
cat pnpm-workspace.yaml

# Re-instalar dependencias
pnpm install

# Build del package que falta
pnpm --filter @habitta/utils build
```

### Error: tipos de Supabase desactualizados

```
Property 'X' does not exist on type 'Database'
```

**Solución:**

```bash
# Regenerar tipos desde Supabase
supabase gen types typescript --local > packages/types/supabase.ts

# Rebuild types package
pnpm --filter @habitta/types build
```

### Error: build de Astro falla con React Island

```
Error: Cannot use client directive on non-React component
```

**Solución:**

- Verificar que el componente tiene extensión `.tsx` (no `.astro`)
- Verificar que `@astrojs/react` está en `astro.config.mjs`
- El componente debe ser un componente React válido con `export default`

### Error: Next.js build falla — variable de entorno no definida

```
Error: NEXT_PUBLIC_SUPABASE_URL is not defined
```

**Solución:**

```bash
# Verificar .env.local en apps/dashboard
cat apps/dashboard/.env.local

# Variables requeridas:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # SOLO server-side, nunca exponer al cliente
```

### Error: Turbo cache obsoleto

```bash
# Limpiar cache de Turbo
pnpm turbo clean
# o borrar manualmente
rm -rf .turbo
```

---

## Configuración Turbo (`turbo.json`)

```json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
```

- `"persistent": true` → el proceso dev no termina (expected)
- `"cache": false` → dev no se cachea
- `"^build"` → buildea dependencias upstream primero
- `"outputs"` → Turbo sabe qué cachear entre runs

---

## Configuración Jest (packages)

```js
// jest.config.js (en cada package)
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@habitta/(.*)$': '<rootDir>/../$1/src',
  },
};
```

Tests van en: `packages/<nombre>/src/__tests__/` o junto al archivo como `*.test.ts`

---

## Variables de entorno requeridas

### apps/website

```env
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
```

### apps/dashboard

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # ⚠️ SOLO server-side
```

> `SERVICE_ROLE_KEY` **nunca** va en el cliente. Solo en Server Actions o API Routes.
