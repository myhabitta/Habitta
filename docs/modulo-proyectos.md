# Módulo de Proyectos

## Rutas

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/dashboard/projects` | Listado de proyectos | admin |
| `/dashboard/projects/new` | Formulario de creación | admin |
| `/dashboard/projects/[id]` | Detalle del proyecto + paquetes | admin |
| `/dashboard/projects/[id]/edit` | Editar proyecto | admin |
| `/dashboard/projects/[id]/packages/new` | Crear paquete | admin |
| `/dashboard/projects/[id]/packages/[packageId]/edit` | Editar paquete | admin |

## Flujo de creación de proyecto

```
Usuario llena ProjectForm
    → createProjectAction (Server Action)
        → slugify(name) genera slug automático
        → createProject() inserta en Supabase
        → revalidatePath('/dashboard/projects')
        → redirect('/dashboard/projects')
```

## Flujo de creación de paquete

```
Usuario llena PackageForm en /projects/[id]/packages/new
    → createPackageAction(projectId, ...) (Server Action)
        → features split por coma o salto de línea
        → price parseado como float
        → createPackage() inserta en Supabase
        → revalidatePath('/dashboard/projects/[id]')
        → redirect('/dashboard/projects/[id]')
```

## Soft delete

Los proyectos y paquetes **nunca se eliminan físicamente** de la base de datos. En su lugar, su `status` se cambia a `'inactive'`. Esto se debe a:

- **Integridad referencial**: un paquete inactivo puede tener leads o clientes asociados en el historial
- **Auditoría**: se conserva el registro completo para reportes
- **Reversibilidad**: un proyecto puede reactivarse sin pérdida de datos
- **Website público**: las URLs del website (`/proyectos/[slug]`) pueden necesitar mostrar un 404 apropiado en vez de romper referencias

## Slugs

Los slugs se generan automáticamente desde el nombre del proyecto usando `slugify()` de `@habitta/utils` al momento de la creación. El slug **no se modifica al editar** el proyecto para evitar romper las URLs públicas del website.

Ejemplo: `"Moré Bello"` → `"more-bello"` → URL: `/proyectos/more-bello`
