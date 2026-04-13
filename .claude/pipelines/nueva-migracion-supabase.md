# Pipeline: nueva-migracion-supabase

## Cuándo usarlo

Cuando se necesite modificar el schema de la base de datos:
agregar tabla, agregar columna, modificar relaciones o políticas RLS.

## Tarea para el orquestador

Ejecuta los siguientes agentes en este orden exacto.
Si algún paso falla, detener y notificar antes de continuar.

---

## Paso 1 — backend-supabase-agent

**Qué hace:** Crea el archivo de migración en supabase/migrations/.
Nombre del archivo: timestamp_descripcion.sql (generado con CLI)
Escribe el SQL con los cambios necesarios.
Define políticas RLS si la tabla es nueva.
Nunca modifica tablas en producción directamente.

Comandos que usa:

```bash
supabase migration new nombre_descripcion
supabase db push
```

Skills que usa:

- schema-design-skill
- supabase-database
- supabase-postgres-best-practices

Resultado esperado: archivo .sql de migración creado y correcto.

---

## Paso 2 — typescript-auditor-agent

**Qué hace:** Después de la migración, valida que los tipos en
packages/types/ estén sincronizados con los nuevos campos de BD.
Si hay campos nuevos en BD que no están en los tipos, los agrega.

Comando que usa:

```bash
supabase gen types typescript --local > packages/types/supabase.ts
```

Skills que usa:

- ts-strict-skill
- typescript-best-practices

Resultado esperado: tipos actualizados y sincronizados con el schema.

---

## Paso 3 — linter-formatter-agent

**Qué hace:** Formatea los archivos de tipos modificados.

Skills que usa:

- prettier-skill
- eslint-prettier

Resultado esperado: tipos formateados correctamente.

---

## Notas

- Nunca editar tablas manualmente en producción.
- Siempre usar el CLI: `supabase migration new nombre`
- Después de crear la migración correr: `supabase db push`
- Regenerar tipos después de cada migración.
- Tablas principales: projects, packages, leads, clients
- Las políticas RLS se definen en supabase/config
