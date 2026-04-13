# Pipeline: nueva-query-database

## Cuándo usarlo

Cuando se necesite agregar una nueva función de query a @habitta/database
SIN cambiar el schema de la base de datos.
Tarea más ligera que nueva-migracion-supabase — solo agrega lógica de consulta.

Ejemplos:

- Agregar getLeadsByProject(projectSlug)
- Agregar getClientsByStatus(status)
- Agregar updateLeadStatus(leadId, status)
- Agregar getProjectStats() para el dashboard

## Tarea para el orquestador

Ejecuta los siguientes agentes en este orden exacto.

---

## Paso 1 — backend-supabase-agent

**Qué hace:** Crea la función de query en packages/database/src/queries/[entidad].ts.
Usa el cliente de Supabase ya inicializado en el package.
Tipea el retorno usando los tipos de @habitta/types.
Exporta la función desde packages/database/src/index.ts.

Convenciones de naming:

- Consultas: getEntidad(), getEntidadBySlug(), getEntidadById()
- Mutaciones: createEntidad(), updateEntidad(), deleteEntidad()

Skills que usa:

- supabase-database
- supabase-postgres-best-practices
- ts-strict-skill

Resultado esperado: función de query creada, tipada y exportada.

---

## Paso 2 — typescript-auditor-agent

**Qué hace:** Valida que el tipo de retorno sea correcto,
que no haya any, y que el tipo coincida con el schema real de Supabase.
Si los tipos de @habitta/types necesitan un ajuste menor (sin migración), los actualiza.

Skills que usa:

- ts-strict-skill
- typescript-best-practices

Resultado esperado: tipos correctos y consistentes con el schema.

---

## Paso 3 — linter-formatter-agent

**Qué hace:** Formatea el archivo de queries y verifica imports.

Skills que usa:

- eslint-prettier
- prettier-skill

Resultado esperado: código limpio listo para consumir desde cualquier app.

---

## Notas

- Si la query requiere un campo nuevo en BD → usar pipeline nueva-migracion-supabase en su lugar.
- Toda query usa el cliente de @habitta/database, nunca @supabase/supabase-js directamente.
- Las apps importan la función: import { getLeads } from '@habitta/database'
- Queries existentes: getProjects(), getPackagesByProject(), createLead(), getLeads(), getClients()
