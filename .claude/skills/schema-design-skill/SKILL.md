---
name: schema-design-skill
description: Database schema design for Habitta's Supabase/PostgreSQL. Use when creating migrations, designing new tables, adding columns, defining relationships between projects/packages/leads/clients, or setting up RLS policies.
license: MIT
metadata:
  authors: 'Habitta Team'
  version: '1.0.0'
---

# Schema Design — Habitta Supabase

Guía de diseño de schema para la base de datos Supabase (PostgreSQL) de Habitta.

---

## Regla fundamental

**Nunca editar tablas manualmente en producción.** Siempre crear una migración con el CLI:

```bash
# Crear migración nueva
supabase migration new nombre_descriptivo

# Aplicar migraciones
supabase db push

# Resetear con seed (solo desarrollo)
supabase db reset

# Generar tipos TypeScript desde el schema actual
supabase gen types typescript --local > packages/types/supabase.ts
```

---

## Tablas principales

### `projects` — Proyectos inmobiliarios

```sql
create table projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  city        text not null,
  description text,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Índice para búsqueda por slug (ruta /proyectos/[slug])
create index projects_slug_idx on projects(slug);
```

### `packages` — Paquetes de acabados

```sql
create table packages (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  name        text not null,
  slug        text not null,
  level       text not null check (level in ('basico', 'estandar', 'premium')),
  price       numeric(12, 2) not null,
  description text,
  created_at  timestamptz not null default now(),
  unique(project_id, slug)
);

create index packages_project_id_idx on packages(project_id);
```

### `leads` — Contactos capturados desde el website

```sql
create table leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  project_id  uuid references projects(id) on delete set null,
  status      text not null default 'new'
                check (status in ('new', 'contacted', 'qualified', 'converted')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index leads_status_idx on leads(status);
create index leads_project_id_idx on leads(project_id);
```

### `clients` — Leads convertidos en clientes

```sql
create table clients (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references leads(id) on delete set null,
  name        text not null,
  email       text not null,
  project_id  uuid not null references projects(id),
  package_id  uuid not null references packages(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index clients_project_id_idx on clients(project_id);
create index clients_lead_id_idx on clients(lead_id);
```

---

## Relaciones

```
projects ──< packages      (un proyecto tiene muchos paquetes)
projects ──< leads         (un proyecto puede tener muchos leads)
leads    ──< clients       (un lead puede convertirse en cliente)
packages ──< clients       (un paquete puede tener muchos clientes)
```

---

## Convenciones de schema

| Elemento         | Convención                                      |
| ---------------- | ----------------------------------------------- |
| Primary key      | `uuid` con `gen_random_uuid()`                  |
| Timestamps       | `timestamptz` (con zona horaria)                |
| Nombres tablas   | `snake_case` plural                             |
| Nombres columnas | `snake_case`                                    |
| Foreign keys     | `tabla_id` (ej: `project_id`, `lead_id`)        |
| Slugs            | `text unique` con índice                        |
| Enums            | `check constraint` en lugar de tipo enum        |
| Soft delete      | No usar — eliminar directamente o usar `status` |

---

## RLS (Row Level Security)

Todas las tablas deben tener RLS habilitado:

```sql
-- Habilitar RLS
alter table projects enable row level security;
alter table packages enable row level security;
alter table leads enable row level security;
alter table clients enable row level security;

-- Política: lectura pública para proyectos publicados (website)
create policy "projects_public_read"
  on projects for select
  using (published = true);

-- Política: solo usuarios autenticados pueden ver leads (dashboard)
create policy "leads_auth_only"
  on leads for all
  using (auth.role() = 'authenticated');

-- Política: solo usuarios autenticados pueden ver clients (dashboard)
create policy "clients_auth_only"
  on clients for all
  using (auth.role() = 'authenticated');
```

---

## Flujo de migración

### Agregar un campo nuevo

```bash
# 1. Crear migración
supabase migration new add_images_to_projects

# 2. Editar el archivo generado en supabase/migrations/
# supabase/migrations/20240310_add_images_to_projects.sql
alter table projects add column images text[] default '{}';

# 3. Aplicar
supabase db push

# 4. Regenerar tipos TypeScript
supabase gen types typescript --local > packages/types/supabase.ts

# 5. Actualizar el tipo en packages/types/project.ts
```

### Crear tabla nueva

```bash
supabase migration new create_appointments_table
# Escribir el CREATE TABLE en el archivo de migración
supabase db push
supabase gen types typescript --local > packages/types/supabase.ts
```

---

## Seed de desarrollo

```sql
-- supabase/seed/seed.sql

insert into projects (name, slug, city, description, published) values
  ('Residencias El Parque', 'residencias-el-parque', 'Medellín', 'Proyecto de vivienda en el corazón de Medellín', true),
  ('Torres Bello', 'torres-bello', 'Bello', 'Conjunto residencial en Bello, Antioquia', true);

insert into packages (project_id, name, slug, level, price, description)
select p.id, 'Paquete Básico', 'basico', 'basico', 150000000, 'Acabados básicos de alta calidad'
from projects p where p.slug = 'torres-bello';
```

```bash
# Aplicar seed
supabase db reset
```

---

## Queries en `@habitta/database`

Toda query va en `packages/database/` — nunca en componentes:

```ts
// packages/database/queries/projects.ts
import { supabase } from '../client';
import type { Project } from '@habitta/types';

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();

  if (error) return null;
  return data;
}
```
