# Habitta

## Contexto de negocio

**Habitta** es una empresa inmobiliaria colombiana (startup) que comercializa en proyectos de vivienda diferentes niveles de acabados.

- Los **proyectos** son edificios o conjuntos residenciales ubicados en ciudades colombianas.
- Los **paquetes** son niveles de acabados que el comprador puede elegir para su unidad (ej: básico, estándar, premium).
- El flujo comercial va desde la captación de un **lead** en el website, hasta su conversión en **cliente** gestionado desde el dashboard interno.
- El equipo es pequeño — priorizar soluciones simples, directas y mantenibles sobre soluciones complejas o sobreingeniadas.

---

## Arquitectura del proyecto

Habitta es un **Monorepo** gestionado con `pnpm workspaces`.

```
habitta
│
├── apps
│   ├── website       # Plataforma pública (Astro + React Islands)
│   └── dashboard     # App interna de gestión (Next.js)
│
├── packages
│   ├── ui            # Componentes compartidos
│   ├── types         # Tipos TypeScript compartidos
│   ├── utils         # Funciones utilitarias
│   └── database      # Cliente y queries de Supabase
│
├── supabase
│   ├── migrations
│   ├── seed
│   └── config
│
├── docs
├── package.json
├── pnpm-workspace.yaml
└── CLAUDE.md
```

---

## Comandos esenciales

### Instalación

```bash
pnpm install
```

### Desarrollo

```bash
# Todas las apps en paralelo
pnpm dev

# Solo website
pnpm --filter website dev

# Solo dashboard
pnpm --filter dashboard dev
```

### Build

```bash
# Build de todo el monorepo
pnpm build

# Build de una app específica
pnpm --filter website build
pnpm --filter dashboard build
```

### Tests

```bash
# Correr todos los tests
pnpm test

# Tests de un paquete específico
pnpm --filter @habitta/utils test

# Tests en modo watch
pnpm test --watch
```

### Linting y formato

```bash
# Lint
pnpm lint

# Formato con Prettier
pnpm format

# Verificar formato sin escribir
pnpm format:check
```

### Base de datos (Supabase)

```bash
# Aplicar migraciones
supabase db push

# Resetear base de datos con seed
supabase db reset

# Generar tipos TypeScript desde Supabase
supabase gen types typescript --local > packages/types/supabase.ts
```

---

## Stack tecnológico

| Capa                  | Tecnología            |
| --------------------- | --------------------- |
| Website público       | Astro + React Islands |
| Dashboard interno     | Next.js (App Router)  |
| Estilos               | TailwindCSS           |
| Componentes dashboard | shadcn/ui             |
| Lenguaje              | TypeScript (strict)   |
| Base de datos         | Supabase (PostgreSQL) |
| Auth                  | Supabase Auth         |
| Storage               | Cloudflare R2         |
| Deploy                | Vercel                |
| Package manager       | pnpm                  |
| Testing               | Jest                  |
| Linting               | ESLint + Prettier     |

---

## Apps

### apps/website

Plataforma pública orientada a SEO y conversión de leads.

- **Framework:** Astro con React Islands solo donde haya interactividad
- **Prioridad:** rendimiento, SEO, velocidad de carga
- **No usar:** componentes React para contenido estático — usar `.astro` por defecto

**Rutas principales:**

```
/                              → Landing principal
/proyectos                     → Listado de proyectos
/proyectos/[slug]              → Detalle de un proyecto
/proyectos/[slug]/[package]    → Detalle de un paquete de acabados
```

**Ejemplo real:**

```
/proyectos/bello-antioquia
/proyectos/bello-antioquia/paquete-premium
```

#### Estructura de componentes — Atomic Design (website)

Los componentes de `apps/website` siguen Atomic Design. Cada nivel tiene una responsabilidad específica:

```
apps/website/src/components/
├── atoms/       → Elemento mínimo indivisible. Sin composición interna.
├── molecules/   → 2+ átomos combinados con una función concreta.
└── organisms/   → Sección completa de página. Compone átomos y moléculas.
```

**Reglas por nivel:**

| Nivel         | Archivo                                                | Puede importar de                     | Cuándo usarlo                                |
| ------------- | ------------------------------------------------------ | ------------------------------------- | -------------------------------------------- |
| **atoms**     | `.astro` por defecto, `.tsx` si necesita estado        | Nada (o solo `@habitta/ui`)           | Pieza visual indivisible — un único concepto |
| **molecules** | `.astro` por defecto, `.tsx` si tiene interactividad   | `atoms/`                              | Combina 2+ átomos con una función acotada    |
| **organisms** | `.astro` por defecto, `.tsx` si maneja estado complejo | `atoms/`, `molecules/`, `@habitta/ui` | Sección completa de la página                |

**Reglas generales:**

- Un componente por archivo — PascalCase → `EyebrowLabel.astro`, `StatItem.astro`
- Átomo y molécula: nunca consultan datos, solo reciben props
- Organismo: recibe datos como props desde la página — nunca hace fetch directo
- Si un componente solo lo usa una página y no tiene reutilización clara, va en `organisms/` directamente

---

### apps/dashboard

Aplicación interna para el equipo de Habitta. No es pública.

- **Framework:** Next.js con App Router
- **UI:** shadcn/ui sobre TailwindCSS
- **Auth:** protegida con Supabase Auth — todas las rutas requieren sesión activa

#### Estructura de componentes — Atomic Design (dashboard)

Los componentes de `apps/dashboard` siguen el mismo patrón adaptado a Next.js + shadcn/ui:

```
apps/dashboard/components/
├── atoms/      → Wrappers mínimos de shadcn/ui o piezas custom indivisibles.
├── molecules/  → Combinaciones funcionales con estado local acotado.
├── organisms/  → Secciones completas de una feature.
└── metrics/    → Visualizaciones de datos (Recharts + shadcn charts). Siempre Client.
```

**Diferencia con website:** los atoms y molecules del dashboard pueden ser Client Components (`'use client'`) si necesitan estado. Los organisms son Server Components cuando solo muestran datos, Client cuando tienen formularios o filtros.

**Secciones principales:**

```
/dashboard/leads       → Gestión de leads capturados
/dashboard/clients     → Gestión de clientes activos
/dashboard/projects    → Gestión de proyectos inmobiliarios
```

---

## Responsive Design — Dashboard

El dashboard es una aplicación interna pero **debe ser usable en tablet y móvil**. Estas reglas son obligatorias en todo componente nuevo.

### Breakpoints de referencia

| Breakpoint | Clase Tailwind | Uso en dashboard                        |
| ---------- | -------------- | --------------------------------------- |
| < 768px    | (base)         | Mobile — sidebar oculto, 1 columna      |
| >= 768px   | `md:`          | Tablet — sidebar visible, 2 columnas    |
| >= 1024px  | `lg:`          | Desktop — layout completo, 3-4 columnas |

### Sidebar

- En mobile (< md): oculto por defecto, slide-in con overlay al abrir
- En desktop (>= md): siempre visible, posición static
- El Header tiene botón hamburguesa visible solo en mobile (`md:hidden`)
- Al navegar en mobile, el sidebar se cierra automáticamente

### Grids obligatorios

```tsx
// Métricas / cards pequeñas
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

// Cards de proyectos
grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3

// Pricing cards / paquetes
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Formularios — siempre centrados con max-width
max-w-2xl mx-auto
```

### Headers de sección

En mobile el header de sección apila verticalmente, en desktop va en fila:

```tsx
// Correcto
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

// Nunca — se solapa en mobile
<div className="flex items-center justify-between">
```

### Detalles de entidad (proyecto, lead, cliente)

El header de detalle con nombre + badges + botones:

```tsx
// Correcto
<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

// Nunca en páginas de detalle
<div className="flex items-start justify-between">
```

### Padding del contenido principal

```
mobile:  p-4
tablet:  md:p-6
desktop: lg:p-8
```

Ya está configurado en el layout — no sobreescribir con padding propio en páginas.

### Botones de formulario

Siempre stack en mobile, fila en desktop:

```tsx
<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
  <Button variant="outline">Cancelar</Button>
  <Button type="submit">Guardar</Button>
</div>
```

### Tablas

Las tablas de datos (leads, clientes) deben tener scroll horizontal en mobile:

```tsx
<div className="overflow-x-auto rounded-lg border">
  <table className="min-w-full">...</table>
</div>
```

### Texto adaptativo

Títulos principales de página:

```tsx
// Correcto
<h1 className="font-display text-2xl font-semibold md:text-3xl">

// Puede desbordar en mobile
<h1 className="font-display text-3xl font-semibold">
```

---

## Packages

### @habitta/ui

Componentes visuales reutilizables entre `website` y `dashboard`.

- Deben ser **agnósticos de lógica de negocio**
- Solo reciben props, no consultan datos externos
- Componentes actuales: `Button`, `Card`, `Container`, `Section`, `Badge`, `Modal`

### @habitta/types

Tipos TypeScript compartidos entre todas las apps.

- **Nunca** duplicar un tipo en una app si ya existe aquí
- Al agregar una entidad nueva al sistema, el tipo va primero aquí

```ts
// Entidades principales
Project;
Package;
Lead;
Client;
```

### @habitta/utils

Funciones puras y reutilizables.

- Sin side effects
- Sin dependencias de frameworks
- Con tests unitarios en Jest

```ts
formatPrice(); // Formatear precios en COP
slugify(); // Generar slugs para URLs
dateFormatter(); // Formatear fechas en español (Colombia)
```

### @habitta/database

Centraliza toda la comunicación con Supabase.

- Las apps **no** importan `@supabase/supabase-js` directamente — usan este paquete
- Todas las queries van aquí, no en los componentes

```ts
getProjects();
getPackagesByProject(projectSlug);
createLead(data);
getLeads();
getClients();
```

---

## Convenciones de código

### Estilos — solo TailwindCSS

**Regla absoluta: todo el styling usa TailwindCSS. Prohibido CSS vanilla, `<style>` blocks o `styled-components`.**

El tema de Habitta está definido en `tailwind.config.mjs` de cada app. Usar siempre los tokens del tema:

```ts
// ✅ Correcto — usa tokens del tema
<div class="bg-surface text-ink font-display">
<span class="text-brand-primary bg-brand-primary/10">

// ❌ Nunca — valores hardcodeados
<div style="background: #0c0b09; color: #f5f0ea">
<span class="text-[#C8763A]">  // ← evitar valores literales del tema
```

**Tokens disponibles:**

| Token                                     | Valor                     | Uso                       |
| ----------------------------------------- | ------------------------- | ------------------------- |
| `bg-surface`                              | `#0c0b09`                 | Fondo principal           |
| `bg-surface-raised`                       | `#141210`                 | Superficies elevadas      |
| `text-ink` / `bg-ink`                     | `#f5f0ea`                 | Texto principal           |
| `text-ink-muted`                          | `rgba(245,240,234, 0.45)` | Texto secundario          |
| `text-ink-subtle`                         | `rgba(245,240,234, 0.35)` | Texto terciario           |
| `bg-ink-faint`                            | `rgba(245,240,234, 0.12)` | Separadores sutiles       |
| `text-brand-primary` / `bg-brand-primary` | `#C8763A`                 | Color principal Habitta   |
| `bg-brand-dark`                           | `#8B3A0F`                 | Variante oscura del brand |
| `bg-brand-light`                          | `#E8A060`                 | Variante clara del brand  |
| `font-display`                            | Cormorant Garamond        | Títulos, display          |
| `font-sans`                               | Outfit                    | Cuerpo, UI                |

**Excepciones permitidas** (único caso de `<style>` en website):

- `mask-image` — no soportado en Tailwind v3
- Radial gradients complejos en backgrounds decorativos → usar `style=""` inline

**Animaciones:** definidas como `animate-{nombre}` en `tailwind.config.mjs`. No crear keyframes en `<style>` blocks.

### TypeScript

- Usar `strict: true` en todos los `tsconfig.json`
- Preferir `type` sobre `interface` para modelos de datos
- Preferir `interface` para props de componentes React
- No usar `any` — usar `unknown` si el tipo es incierto

### Nombrado

- **Archivos de componentes:** PascalCase → `Button.tsx`, `ProjectCard.tsx`
- **Archivos de utilidades:** camelCase → `formatPrice.ts`, `slugify.ts`
- **Archivos de tipos:** camelCase → `project.ts`, `lead.ts`
- **Variables y funciones:** camelCase
- **Constantes globales:** UPPER_SNAKE_CASE
- **Slugs de proyectos:** kebab-case → `bello-antioquia`

### Componentes React

- Siempre usar **functional components** con arrow functions
- Props tipadas con `interface` en el mismo archivo
- Un componente por archivo

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};

export default Button;
```

### Imports

- Usar **path aliases** en lugar de rutas relativas largas
- Orden: externos → internos → relativos

```ts
// ✅ Correcto
import { formatPrice } from '@habitta/utils';
import { Project } from '@habitta/types';
import { Button } from '@habitta/ui';

// ❌ Evitar
import { formatPrice } from '../../../packages/utils/formatPrice';
```

---

## Reglas del monorepo

- **Nunca** instalar una dependencia en la raíz si solo la usa una app — instalarla en esa app
- **Nunca** copiar lógica entre apps — si algo se repite, va a `packages/`
- Al crear un nuevo package interno, agregarlo al `pnpm-workspace.yaml` y nombrarlo `@habitta/<nombre>`
- Las migraciones de Supabase siempre se generan con el CLI y se commitean en `supabase/migrations/`

---

## Base de datos

### Tablas principales

| Tabla      | Descripción                           |
| ---------- | ------------------------------------- |
| `projects` | Proyectos inmobiliarios               |
| `packages` | Paquetes de acabados por proyecto     |
| `leads`    | Contactos capturados desde el website |
| `clients`  | Leads convertidos en clientes         |

### Reglas

- Toda query va en `@habitta/database`, no en componentes
- Las políticas de seguridad (RLS) se definen en `supabase/config`
- Al modificar el schema, crear una migración con el CLI de Supabase — **nunca editar tablas manualmente en producción**

---

## Variables de entorno

### apps/website

```env
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
```

### apps/dashboard

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

> La `SERVICE_ROLE_KEY` **nunca** se expone al cliente. Solo se usa en Server Actions o API Routes.

---

## Qué NO hacer

- ❌ No usar `any` en TypeScript
- ❌ No crear queries de Supabase dentro de componentes — siempre usar `@habitta/database`
- ❌ No duplicar tipos — si existe en `@habitta/types`, importarlo de ahí
- ❌ No usar componentes React para contenido estático en `website` — usar `.astro`
- ❌ No exponer `SUPABASE_SERVICE_ROLE_KEY` en el cliente
- ❌ No instalar dependencias globales que solo usa una app
- ❌ No hacer fetch directo a Supabase desde el `website` sin pasar por `@habitta/database`
- ❌ No sobreingeniería — el equipo es pequeño, priorizar claridad sobre abstracción

---

## Flujos de trabajo comunes

### Agregar un nuevo proyecto inmobiliario

1. Crear migración si el schema cambia: `supabase migration new add_project_field`
2. Agregar o actualizar el tipo en `packages/types/project.ts`
3. Agregar la query en `packages/database/queries/projects.ts`
4. Crear la página en `apps/website/src/pages/proyectos/[slug].astro`
5. Gestionar desde `apps/dashboard/app/dashboard/projects/`

### Agregar un nuevo paquete de acabados

1. Verificar que el tipo `Package` en `@habitta/types` tenga los campos necesarios
2. Agregar datos en `supabase/seed/` si es para desarrollo
3. La URL pública sigue el patrón: `/proyectos/[slug]/[package]`

### Agregar un componente compartido

1. Crear el componente en `packages/ui/src/NombreComponente.tsx`
2. Exportarlo desde `packages/ui/src/index.ts`
3. Importarlo en la app como `import { NombreComponente } from '@habitta/ui'`

### Captura de un lead

1. El formulario en `website` llama a `createLead()` de `@habitta/database`
2. El lead se guarda en la tabla `leads` de Supabase
3. El equipo lo gestiona desde `dashboard/leads`
4. Al convertirse en cliente, pasa a la tabla `clients`

---

## Infraestructura

| Servicio          | Plataforma    |
| ----------------- | ------------- |
| Website           | Vercel        |
| Dashboard         | Vercel        |
| Base de datos     | Supabase      |
| Auth              | Supabase Auth |
| Assets / imágenes | Cloudflare R2 |

---

## Regla de skills — obligatorio en toda creación

**Todo componente, sección o página que se cree activa skills. Sin excepción.**

El objetivo es que cada entrega tenga desde el primer commit: HTML5 semántico, SEO integrado, Tailwind correcto y tipos bien definidos. Los skills no son un paso extra — son el estándar mínimo de calidad.

| Agente                    | Skills base obligatorios                                                    |
| ------------------------- | --------------------------------------------------------------------------- |
| `website-builder-agent`   | `astro` + `frontend-design` + `tailwind-best-practices` + `ts-strict-skill` |
| `ui-components-agent`     | `frontend-design` + `tailwind-best-practices` + `ts-strict-skill`           |
| `design-animation-agent`  | `motion` + `frontend-design` + `tailwind-best-practices`                    |
| `dashboard-builder-agent` | `next-best-practices` + `nextjs-shadcn` + `ts-strict-skill`                 |
| `charts-metrics-agent`    | `nextjs-shadcn` + `ts-strict-skill`                                         |

La única excepción es trabajo de debugging o corrección puntual de 1-2 líneas donde el contexto ya está claro.

---

## Principios generales

1. **Simplicidad primero** — somos un equipo pequeño, el código debe ser fácil de leer y mantener
2. **Código compartido en packages** — si algo se usa en más de un lugar, va a `packages/`
3. **TypeScript estricto** — los tipos son documentación viva
4. **SEO es prioridad en website** — cada decisión técnica del website considera el impacto en SEO
5. **El dashboard es interno** — puede sacrificar algo de performance por funcionalidad, nunca al revés con el website
6. **Alto rendimiento** - Astro permite páginas extremadamente rápidas.

## Routing de agentes

Cuando recibas una tarea, identifica el agente correcto:

```
| Si la tarea involucra...          | Activa este agente       |
| --------------------------------- | ------------------------ |
| Página o componente en website    | website-builder-agent    |
| Página o sección en dashboard     | dashboard-builder-agent  |
| Componente en packages/ui         | ui-components-agent      |
| Animación o diseño visual         | design-animation-agent   |
| Supabase, queries, schema         | backend-supabase-agent   |
| Errores de TypeScript             | typescript-auditor-agent |
| ESLint, Prettier, imports         | linter-formatter-agent   |
| Build, tests, subir al repo       | deploy-guard-agent       |
| Gráficas o métricas del dashboard | charts-metrics-agent     |
```

### Ejemplos:

#### Crear una página nueva

"Crea la página /proyectos/more-bello con SEO completo"
→ CLAUDE.md activa website-builder-agent + seo-plan + astro

#### Revisar tipado antes de un commit

"Audita los tipos del archivo packages/types/project.ts"
→ CLAUDE.md activa typescript-auditor-agent + ts-strict-skill

#### Subir cambios seguros

"Valida build y tests antes de hacer push a main"
→ CLAUDE.md activa deploy-guard-agent + build-check

#### Diseñar una animación

"Agrega animación de entrada a las cards de proyectos"
→ CLAUDE.md activa design-animation-agent + motion

---

## Flujos de delegación entre agentes

Los agentes se pasan trabajo cuando cruzan el límite de su dominio. Estos son los flujos activos:

```
website-builder ──necesita query compleja──→ backend-supabase
website-builder ──componente reutilizable──→ ui-components
website-builder ──animación compleja──────→ design-animation

dashboard-builder ──necesita query compleja──→ backend-supabase
dashboard-builder ──visualización de datos──→ charts-metrics
dashboard-builder ──componente reutilizable──→ ui-components

backend-supabase ──tipos regenerados/errores downstream──→ typescript-auditor

charts-metrics ──necesita query de métricas──→ backend-supabase
charts-metrics ──errores de tipos en datos──→ typescript-auditor

design-animation ──componente no existe──→ website-builder

linter-formatter ──errores de tipos complejos──→ typescript-auditor
deploy-guard ────────TypeScript falla──────→ typescript-auditor
deploy-guard ───────────lint falla─────────→ linter-formatter
```

**Principio de delegación:** pasar siempre el contexto mínimo necesario (archivo + error exacto), nunca delegar para que el otro agente "explore". Cada agente lee solo lo que se le indica.

---

## Skills disponibles

Skills activos en `.claude/skills/`. Cada uno tiene su `SKILL.md` con reglas, comandos y patrones específicos para Habitta.

### Skills del proyecto (Habitta)

| Skill                 | Para qué sirve                                                                  |
| --------------------- | ------------------------------------------------------------------------------- |
| `build-check`         | Validar builds, correr tests y ejecutar el checklist pre-deploy del monorepo    |
| `eslint-prettier`     | Lint y formateo combinado — reglas ESLint + Prettier para todo el monorepo      |
| `prettier-skill`      | Configuración y uso de Prettier, `.prettierrc`, plugin Astro, errores comunes   |
| `ts-strict-skill`     | TypeScript estricto — `tsconfig`, tipos compartidos, `unknown` vs `any`, props  |
| `schema-design-skill` | Diseño de schema Supabase, migraciones, RLS, relaciones entre tablas            |
| `motion`              | Animaciones CSS para Astro, Motion library para React Islands, View Transitions |
| `vercel`              | Deploy a producción, logs, rollback, variables de entorno, CLI de Vercel        |

### Skills instalados (externos)

| Skill                                    | Para qué sirve                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------- |
| `astro`                                  | CLI, estructura de proyecto, config y adapters de Astro                    |
| `next-best-practices`                    | Convenciones de Next.js App Router, RSC, data fetching, metadata           |
| `nextjs-shadcn`                          | Componentes shadcn/ui, patrones de UI para el dashboard                    |
| `nextjs-typescript-tailwindcss-supabase` | Patrones Next.js + TS + Tailwind + Supabase (ignorar secciones de Drizzle) |
| `frontend-design`                        | UI/UX de alta calidad, diseño distintivo, componentes visuales             |
| `tailwind-best-practices`                | Sintaxis Tailwind v4, patrones modernos, anti-patterns a evitar            |
| `tailwind-css-patterns`                  | Utilidades Tailwind — responsive, flexbox, grid, spacing, tipografía       |
| `typescript-best-practices`              | Patrones TS avanzados — generics, discriminated unions, type guards        |
| `supabase-auth`                          | Autenticación Supabase — sign up, sign in, sesiones, recuperar contraseña  |
| `supabase-database`                      | CRUD en tablas Supabase vía REST API                                       |
| `supabase-nextjs`                        | Integración Next.js con Supabase y Drizzle ORM                             |
| `supabase-postgres-best-practices`       | Optimización de queries y schema en PostgreSQL                             |
| `seo-plan`                               | Estrategia SEO, arquitectura de contenido, roadmap de implementación       |
| `seo-audit`                              | Auditoría técnica SEO — 251 reglas, health score, análisis completo        |
| `seo-content`                            | Calidad de contenido, E-E-A-T, legibilidad, thin content                   |
| `seo-schema`                             | Structured data Schema.org, JSON-LD, rich results                          |
| `seo-geo`                                | Optimización para AI Overviews, ChatGPT, Perplexity (GEO)                  |
| `seo-programmatic`                       | SEO a escala — páginas dinámicas, URL patterns, index bloat                |
| `vercel-react-best-practices`            | Performance de React/Next.js según Vercel Engineering                      |
| `web-design-guidelines`                  | Revisión de UI — accesibilidad, UX, best practices de interfaces           |
| `superdesign`                            | Agente de diseño UI/UX especializado, variaciones y sistemas de diseño     |
| `skill-creator`                          | Crear, mejorar y evaluar skills nuevos                                     |
| `find-skills`                            | Buscar e instalar skills disponibles en el ecosistema                      |

---

## Estructura de carpetas Agentes & Skills

```
habitta/
├── CLAUDE.md ← Orquestador
└── .claude/
    ├── agents/
    │   ├── website-builder-agent.md
    │   ├── dashboard-builder-agent.md
    │   ├── ui-components-agent.md
    │   ├── design-animation-agent.md
    │   ├── backend-supabase-agent.md
    │   ├── typescript-auditor-agent.md
    │   ├── linter-formatter-agent.md
    │   ├── deploy-guard-agent.md
    │   └── charts-metrics-agent.md
    └── skills/
        │
        │   # — Habitta (propios) ————————————————
        ├── build-check/
        ├── eslint-prettier/
        ├── prettier-skill/
        ├── ts-strict-skill/
        ├── schema-design-skill/
        ├── motion/
        ├── vercel/
        │
        │   # — Externos (instalados vía CLI) ————
        ├── astro/
        ├── find-skills/
        ├── frontend-design/
        ├── next-best-practices/
        ├── nextjs-shadcn/
        ├── nextjs-typescript-tailwindcss-supabase/
        ├── seo-audit/
        ├── seo-content/
        ├── seo-geo/
        ├── seo-plan/
        ├── seo-programmatic/
        ├── seo-schema/
        ├── skill-creator/
        ├── supabase-auth/
        ├── supabase-database/
        ├── supabase-nextjs/
        ├── supabase-postgres-best-practices/
        ├── superdesign/
        ├── tailwind-best-practices/
        ├── tailwind-css-patterns/
        ├── typescript-best-practices/
        ├── vercel-react-best-practices/
        └── web-design-guidelines/
```
