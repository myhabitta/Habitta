# Dashboard — Estructura de carpetas

```
apps/dashboard/
├── app/                          → Rutas (App Router de Next.js)
│   ├── layout.tsx                → Layout raíz: html, body, fuentes, providers
│   ├── page.tsx                  → Redirige a /dashboard/leads
│   ├── (auth)/                   → Grupo de rutas de autenticación
│   │   └── ...                   → login, logout, callback
│   └── dashboard/                → Rutas protegidas
│       ├── page.tsx              → Placeholder / home del dashboard
│       ├── leads/
│       ├── clients/
│       └── projects/
│
├── components/                   → Componentes del dashboard
│   ├── atoms/                    → Wrappers mínimos de shadcn/ui
│   ├── molecules/                → Combinaciones con estado local acotado
│   ├── organisms/                → Secciones completas de una feature
│   └── metrics/                  → Gráficas y visualizaciones (Recharts)
│
├── lib/                          → Helpers internos
│   └── ...                       → utils del dashboard, helpers de auth, etc.
│
├── middleware.ts                  → Intercepta requests y verifica sesión
├── next.config.ts                 → Config de Next.js
├── tsconfig.json                  → Extiende tsconfig.base.json de la raíz
└── tailwind.config.ts             → Tema de Habitta (tokens de color, fuentes)
```

---

## Convenciones de componentes

Los componentes siguen Atomic Design adaptado a Next.js + shadcn/ui:

| Nivel        | Cuándo usarlo                                                           |
| ------------ | ----------------------------------------------------------------------- |
| `atoms/`     | Wrapper de un componente shadcn/ui o pieza visual mínima                |
| `molecules/` | Combina 2+ atoms, puede tener estado local (`useState`)                 |
| `organisms/` | Sección completa de una feature (tabla de leads, formulario de cliente) |
| `metrics/`   | Siempre Client Component — charts con Recharts o shadcn/charts          |

**Regla Server/Client:**

- Organisms que solo muestran datos → Server Component
- Organisms con formularios, filtros o interactividad → Client Component (`'use client'`)

---

## Path alias

El alias `@/*` apunta a la raíz de `apps/dashboard/`. Ejemplos:

```ts
import { LeadsTable } from '@/components/organisms/LeadsTable';
import { getLeads } from '@habitta/database';
import type { Lead } from '@habitta/types';
```

---

## Configuración TypeScript

`tsconfig.json` extiende `../../tsconfig.base.json`. Hereda:

- `strict: true`
- `target: ES2022`

Y agrega lo específico de Next.js:

- `"jsx": "preserve"`
- `"plugins": [{ "name": "next" }]`
- `"incremental": true`
