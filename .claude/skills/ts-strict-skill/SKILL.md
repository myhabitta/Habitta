---
name: ts-strict-skill
description: TypeScript strict mode rules and patterns for Habitta. Use when configuring tsconfig.json, fixing strict TypeScript errors, typing props, handling unknown vs any, typing Supabase responses, or auditing types across the monorepo.
license: MIT
metadata:
  authors: 'Habitta Team'
  version: '1.0.0'
---

# TypeScript Strict — Habitta Monorepo

Guía de TypeScript en modo estricto para el monorepo Habitta. Todos los `tsconfig.json` del proyecto deben tener `strict: true`.

---

## Configuración base (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Por app

**apps/website** — extiende la base, agrega paths para alias:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**apps/dashboard** — igual, con paths para Next.js App Router:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Reglas de oro Habitta

```
❌ any         → PROHIBIDO. Usar unknown si el tipo es incierto.
✅ unknown      → Para datos externos (API, formularios, params de ruta)
✅ type         → Para modelos de datos: Project, Lead, Client, Package
✅ interface    → Para props de componentes React
❌ as Type      → Evitar type assertions salvo que sean inevitables
✅ satisfies    → Preferir sobre as cuando sea posible
```

---

## Tipos compartidos (`@habitta/types`)

**Nunca** duplicar un tipo en una app. Si existe en `@habitta/types`, importarlo de ahí.

```ts
// packages/types/project.ts
export type Project = {
  id: string;
  name: string;
  slug: string;
  city: string;
  description: string;
  published: boolean;
  created_at: string;
};

// packages/types/package.ts
export type Package = {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  level: 'basico' | 'estandar' | 'premium';
  price: number;
  description: string;
};

// packages/types/lead.ts
export type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  project_id?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  created_at: string;
};

// packages/types/client.ts
export type Client = {
  id: string;
  lead_id: string;
  name: string;
  email: string;
  project_id: string;
  package_id: string;
  created_at: string;
};
```

---

## Props de componentes React

Usar `interface` para props, en el mismo archivo del componente:

```tsx
// ✅ Correcto
interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  featured?: boolean;
}

const ProjectCard = ({ project, onClick, featured = false }: ProjectCardProps) => {
  return <div>{project.name}</div>;
};

// ❌ Incorrecto — no usar type inline en el parámetro
const ProjectCard = ({ project }: { project: any }) => { ... };
```

---

## Tipado de datos externos (Supabase)

```ts
// ✅ Usar tipos de @habitta/types, no confiar en el tipo implícito
import type { Project } from '@habitta/types';
import { getProjects } from '@habitta/database';

const projects: Project[] = await getProjects();

// ✅ Si el dato puede ser null (query por slug)
const project: Project | null = await getProjectBySlug(slug);
if (!project) return notFound();
```

---

## Manejo de `unknown`

```ts
// Para datos de formularios
const handleSubmit = (data: unknown) => {
  if (!isLead(data)) throw new Error('Invalid lead data');
  createLead(data); // data tipado como Lead aquí
};

// Type guard
const isLead = (data: unknown): data is Lead => {
  return typeof data === 'object' && data !== null && 'name' in data && 'email' in data;
};
```

---

## Patrones comunes en Habitta

### Parámetros de ruta en Astro

```ts
// apps/website/src/pages/proyectos/[slug].astro
const { slug } = Astro.params;
// slug es string | undefined en Astro — manejar siempre:
if (!slug) return Astro.redirect('/proyectos');
```

### Server Actions en Next.js (dashboard)

```ts
'use server';
import type { Lead } from '@habitta/types';

export async function createLeadAction(formData: FormData): Promise<{ success: boolean }> {
  const data: unknown = Object.fromEntries(formData);
  // Validar antes de usar
  const lead = parseLeadData(data); // retorna Lead | null
  if (!lead) return { success: false };
  await createLead(lead);
  return { success: true };
}
```

### Resultado con error tipado

```ts
type Result<T> = { success: true; data: T } | { success: false; error: string };

async function fetchProject(slug: string): Promise<Result<Project>> {
  const project = await getProjectBySlug(slug);
  if (!project) return { success: false, error: 'Project not found' };
  return { success: true, data: project };
}
```

---

## Verificar tipos antes de commit

```bash
# Verificar todo el monorepo
npx tsc --noEmit

# Por app
cd apps/website && npx tsc --noEmit
cd apps/dashboard && npx tsc --noEmit

# Por package
cd packages/utils && npx tsc --noEmit
cd packages/types && npx tsc --noEmit
```

---

## Errores comunes y soluciones

### `Type 'string | undefined' is not assignable to type 'string'`

```ts
// ❌ Problema
const slug: string = Astro.params.slug;

// ✅ Solución
const slug = Astro.params.slug;
if (!slug) return Astro.redirect('/');
// Aquí slug es string
```

### `Object is possibly 'null'`

```ts
// ❌ Problema
const name = project.name; // project puede ser null

// ✅ Solución
if (!project) return notFound();
const name = project.name; // seguro
```

### `Parameter 'x' implicitly has an 'any' type`

```ts
// ❌ Problema
const format = (price) => `$${price}`;

// ✅ Solución
const format = (price: number): string => `$${price}`;
```
