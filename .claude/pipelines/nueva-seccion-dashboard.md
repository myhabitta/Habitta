# Pipeline: nueva-seccion-dashboard

## Cuándo usarlo

Cuando se necesite crear una nueva página o sección
en apps/dashboard (leads, clients, projects u otras).

## Principio de este pipeline

**Construir UI y conectar datos son tareas separadas.**
La sección se construye primero con datos dummy tipados.
La conexión con Supabase es una tarea posterior e independiente.
Una vista bien construida con datos fake es entregable — se puede revisar, aprobar y ajustar
antes de conectar la base de datos real.

## Tarea para el orquestador

Ejecuta los siguientes agentes en este orden exacto.

---

## Paso 1 — dashboard-builder-agent

**Qué hace:** Crea la página en apps/dashboard/app/dashboard/[seccion]/page.tsx.
Usa componentes de shadcn/ui. Trabaja con datos dummy tipados, no con Supabase aún.
Aplica layout protegido con auth (el middleware ya existe, solo lo referencia).
Server Components por defecto; Client Components solo si hay formularios o filtros.

Los datos dummy deben respetar el shape real esperado:

```typescript
// Ejemplo para sección de leads
const mockLeads = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    proyecto: 'bello-antioquia',
    estado: 'nuevo',
    fecha: '2026-03-01',
  },
  {
    id: '2',
    nombre: 'María López',
    email: 'maria@example.com',
    proyecto: 'laureles',
    estado: 'contactado',
    fecha: '2026-03-05',
  },
];
```

Skills que usa:

- next-best-practices
- nextjs-shadcn
- tailwind-best-practices
- ts-strict-skill

Resultado esperado: sección visualmente completa con tablas, filtros y acciones usando datos dummy.

---

## Paso 2 — charts-metrics-agent (opcional)

**Qué hace:** Si la sección incluye métricas o gráficas (ventas, conversión,
paquete más vendido, leads por mes), las construye con datos dummy estáticos.
Siempre son Client Components. Los datos reales llegan en el paso de conexión.

Skills que usa:

- nextjs-shadcn
- ts-strict-skill

Resultado esperado: gráficas y métricas construidas y visibles con datos de ejemplo.

---

## Paso 3 — typescript-auditor-agent

**Qué hace:** Valida que los tipos de los datos dummy estén correctamente
definidos en @habitta/types. Define el contrato de datos que Supabase deberá
respetar cuando se conecte. Cero any.

Skills que usa:

- ts-strict-skill
- typescript-best-practices

Resultado esperado: tipos definidos y listos — el contrato de datos existe antes de la BD.

---

## Paso 4 — linter-formatter-agent

**Qué hace:** Formatea y valida todo el código de la sección.

Skills que usa:

- eslint-prettier
- prettier-skill

Resultado esperado: código limpio y consistente.

---

## Paso 5 (posterior, separado) — conectar datos reales

**Cuándo:** Solo cuando la UI esté aprobada y se quiera conectar con Supabase.

Activar por separado según lo que se necesite:

- Pipeline `nueva-query-database` → agregar la query en @habitta/database
- Pipeline `nueva-migracion-supabase` → si el schema necesita cambios primero
- Luego `backend-supabase-agent` reemplaza los datos dummy por las queries reales
- Reemplazar `mockLeads` por `await getLeads()` de @habitta/database

---

## Notas

- SUPABASE_SERVICE_ROLE_KEY solo en Server Actions o API Routes, nunca en cliente.
- Toda query va en @habitta/database cuando se conecte, nunca directamente en el componente.
- Usar shadcn/ui para tablas, formularios y modales.
- Secciones actuales: /dashboard/leads, /dashboard/clients, /dashboard/projects
- El paso 2 (charts-metrics-agent) es opcional si la sección no incluye visualizaciones.
