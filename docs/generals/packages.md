# Packages — @habitta/\*

Los paquetes internos viven en `packages/` y se comparten entre `website` y `dashboard`. Ninguna app duplica lógica que ya existe aquí.

Todos se importan con el prefijo `@habitta/`:

```ts
import { Button } from '@habitta/ui';
import type { Lead } from '@habitta/types';
import { formatPrice } from '@habitta/utils';
import { getLeads } from '@habitta/database';
```

---

## @habitta/ui

Componentes visuales React reutilizables entre ambas apps.

**Regla clave:** solo reciben props, nunca consultan datos ni tienen lógica de negocio.

### Componentes disponibles

| Componente  | Para qué                                 |
| ----------- | ---------------------------------------- |
| `Button`    | Botones con variantes de estilo          |
| `Card`      | Contenedor de sección con borde/sombra   |
| `Container` | Wrapper de ancho máximo centrado         |
| `Section`   | Sección de página con espaciado vertical |
| `Badge`     | Etiqueta pequeña de estado o categoría   |
| `Modal`     | Diálogo modal controlado por props       |

### Cuándo agregar algo aquí

Si un componente visual se usa (o se va a usar) en más de una app → va aquí.
Si solo lo usa el dashboard o solo el website → va en la carpeta `components/` de esa app.

---

## @habitta/types

Tipos TypeScript de las entidades del negocio. Documentado en detalle en `types.md`.

**Regla clave:** si un tipo ya existe aquí, no se crea otro igual en ninguna app.

### Entidades

`Project` · `Package` · `Lead` · `Client`

Todos usan `type` (no `interface`) y snake_case en los campos para coincidir con Supabase.

---

## @habitta/utils

Funciones puras sin side effects ni dependencias de frameworks. Tienen tests unitarios con Jest.

### Funciones disponibles

| Función                     | Qué hace                                | Ejemplo                                                 |
| --------------------------- | --------------------------------------- | ------------------------------------------------------- |
| `formatPrice(amount)`       | Formatea número a COP con símbolo       | `formatPrice(250000000)` → `"$250.000.000"`             |
| `slugify(text)`             | Convierte texto a slug URL-safe         | `slugify("Bello Antioquia")` → `"bello-antioquia"`      |
| `dateFormatter(dateString)` | Formatea fecha ISO a español colombiano | `dateFormatter("2026-03-16")` → `"16 de marzo de 2026"` |

### Reglas

- Sin `console.log`, sin llamadas a APIs, sin imports de React o Next.js
- Cada función tiene su archivo propio y su test correspondiente

---

## @habitta/database

Centraliza **toda** la comunicación con Supabase. Las apps no importan `@supabase/supabase-js` directamente.

### Cómo está organizado

```
packages/database/src/
├── client.ts        → Instancia del cliente Supabase (singleton)
├── index.ts         → Re-exporta todo lo de queries/
└── queries/
    ├── projects.ts  → Queries de proyectos
    ├── packages.ts  → Queries de paquetes de acabados
    ├── leads.ts     → Queries de leads
    └── clients.ts   → Queries de clientes
```

### Funciones disponibles

| Función                                      | Qué hace                                |
| -------------------------------------------- | --------------------------------------- |
| `getProjects()`                              | Todos los proyectos ordenados por fecha |
| `getProjectBySlug(slug)`                     | Un proyecto por su slug, o `null`       |
| `getPackagesByProject(projectSlug)`          | Paquetes de un proyecto                 |
| `getPackageBySlug(projectSlug, packageSlug)` | Un paquete específico, o `null`         |
| `createLead(data)`                           | Crea un lead nuevo con status `'new'`   |
| `getLeads()`                                 | Todos los leads ordenados por fecha     |
| `getClients()`                               | Todos los clientes ordenados por fecha  |
| `getClientById(id)`                          | Un cliente por ID, o `null`             |

### El cliente Supabase (`client.ts`)

Lee las variables de entorno en este orden:

1. `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` → para el website (Astro)
2. `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` → para el dashboard (Next.js)

Así el mismo paquete funciona en ambas apps sin cambios.

### Cuándo agregar una query aquí

Siempre. Si algún componente o página necesita datos de Supabase, la función va en `queries/` y se exporta desde `index.ts`. Nunca escribir una query directamente en un componente.
