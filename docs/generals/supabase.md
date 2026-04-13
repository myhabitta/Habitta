# Supabase — Base de datos y Auth

Supabase es el backend de Habitta. Provee base de datos PostgreSQL, autenticación y storage.

---

## Estructura de carpetas

```
supabase/
├── migrations/   → Archivos SQL de cambios al schema (versionados en git)
├── seed/         → Datos de prueba para desarrollo local
└── config/       → Configuración adicional (RLS, storage buckets, etc.)
config.toml       → Config principal del entorno local de Supabase
```

---

## Tablas principales

| Tabla      | Qué guarda              | Relaciones                                                                       |
| ---------- | ----------------------- | -------------------------------------------------------------------------------- |
| `projects` | Proyectos inmobiliarios | —                                                                                |
| `packages` | Paquetes de acabados    | `project_id` → `projects.id`                                                     |
| `leads`    | Contactos del website   | `project_id` → `projects.id` (opcional), `package_id` → `packages.id` (opcional) |
| `clients`  | Clientes activos        | `lead_id` → `leads.id`, `project_id`, `package_id`                               |

---

## Entorno local

Supabase puede correr localmente con Docker. Config en `config.toml`:

```
API:     http://localhost:54321
DB:      postgresql://localhost:54322
Studio:  http://localhost:54323
```

Comandos útiles:

```bash
supabase start              # Levanta Supabase local
supabase stop               # Para Supabase local
supabase db reset           # Resetea BD y aplica seed
supabase db push            # Aplica migraciones pendientes
supabase migration new nombre  # Crea nueva migración
supabase gen types typescript --local > packages/types/supabase.ts  # Genera tipos desde BD
```

---

## Cómo se hacen cambios al schema

**Siempre con migraciones, nunca editando tablas manualmente en producción.**

```bash
# 1. Crear el archivo de migración
supabase migration new add_campo_presupuesto_leads

# 2. Editar el SQL generado en supabase/migrations/
# 3. Aplicar localmente
supabase db reset

# 4. Aplicar en producción
supabase db push
```

Los archivos de migración se commitean en git — son el historial del schema.

---

## Auth

Supabase Auth maneja el login del equipo en el dashboard.

- Solo el equipo interno accede al dashboard — no hay registro público
- El auth usa email + password
- El `middleware.ts` del dashboard verifica la sesión en cada request

### Variables de entorno por app

**Website** (Astro — solo lectura pública):

```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
```

**Dashboard** (Next.js — incluye operaciones de servidor):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   ← solo en servidor, nunca al cliente
```

### Diferencia entre las claves

| Clave              | Permisos                               | Se puede exponer |
| ------------------ | -------------------------------------- | ---------------- |
| `anon key`         | Solo lo que permiten las políticas RLS | Sí (es pública)  |
| `service_role key` | Permisos totales, ignora RLS           | **Nunca**        |

---

## RLS (Row Level Security)

Políticas de seguridad a nivel de fila en PostgreSQL. Controlan qué puede leer o escribir cada tipo de usuario según su rol.

- Se definen en `supabase/config/` o dentro de los archivos de migración
- La `anon key` solo puede hacer lo que las políticas permiten
- La `service_role key` las bypasea — por eso nunca debe llegar al cliente

---

## Flujo de un lead (ejemplo extremo a extremo)

```
1. Usuario llena formulario en website
         ↓
2. createLead() en @habitta/database llama a Supabase con anon key
         ↓
3. RLS permite el INSERT en tabla leads (política pública)
         ↓
4. Lead queda en Supabase con status 'new'
         ↓
5. Dashboard consulta getLeads() → muestra la tabla al equipo
         ↓
6. Equipo actualiza status, agrega notas
         ↓
7. Si se convierte → se crea registro en tabla clients
```
