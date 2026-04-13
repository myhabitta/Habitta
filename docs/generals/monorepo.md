# Monorepo — Estructura y funcionamiento

El proyecto es un monorepo gestionado con **pnpm workspaces** y **Turborepo**. Todo el código vive en un solo repositorio pero está separado en apps y paquetes independientes.

---

## Estructura

```
habitta/
├── apps/
│   ├── website/       → Sitio público (Astro)
│   └── dashboard/     → App interna (Next.js)
│
├── packages/
│   ├── ui/            → Componentes visuales compartidos
│   ├── types/         → Tipos TypeScript del negocio
│   ├── utils/         → Funciones puras (formatPrice, slugify, etc.)
│   └── database/      → Todas las queries a Supabase
│
├── supabase/
│   ├── migrations/    → Cambios al schema de BD (SQL)
│   ├── seed/          → Datos de prueba
│   └── config/        → Configuración de Supabase
│
└── docs/              → Esta documentación
```

---

## Paquetes internos

Los paquetes en `/packages` se nombran `@habitta/<nombre>` y se importan así en cualquier app:

```ts
import { formatPrice } from '@habitta/utils';
import { Project } from '@habitta/types';
import { getProjects } from '@habitta/database';
import { Button } from '@habitta/ui';
```

Esto evita rutas relativas largas y deja claro de dónde viene cada cosa.

---

## Comandos principales

```bash
pnpm dev              # Levanta website y dashboard en paralelo
pnpm build            # Build de todo el monorepo
pnpm lint             # Lint de todo el monorepo
pnpm format           # Formatea todo con Prettier
pnpm test             # Corre todos los tests

# Solo una app
pnpm --filter website dev
pnpm --filter dashboard dev
```

---

## Reglas del monorepo

- Si algo se usa en más de una app → va a `packages/`
- Nunca instalar dependencias en la raíz si solo las usa una app
- Nunca duplicar tipos, queries o componentes entre apps
- Las migraciones de BD siempre se generan con el CLI de Supabase, nunca a mano
