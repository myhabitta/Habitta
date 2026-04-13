# Módulo de Leads

## Rutas

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/dashboard/leads` | Listado con filtros por status y proyecto | admin, sales |
| `/dashboard/leads/new` | Crear lead manualmente | admin, sales |
| `/dashboard/leads/[id]` | Detalle del lead + notas + stepper de status | admin, sales |
| `/dashboard/leads/[id]/convert` | Convertir lead a cliente | admin, sales |

## Estados del lead

```
new → contacted → negotiating → converted
                              ↘ lost
```

- **new**: Lead recién capturado (website o manual)
- **contacted**: El equipo hizo contacto inicial
- **negotiating**: Hay una negociación activa
- **converted**: Lead cerrado — se crea un registro en `clients`
- **lost**: Lead descartado — no avanza

Transiciones permitidas: cualquier status puede ir a cualquier otro.
El stepper UI guía el flujo natural pero no lo impone en DB.

## Flujo de conversión

Al ejecutar `convertLeadToClient(leadId, { project_id, package_id, total_amount })`:

1. Se lee el lead para obtener `first_name`, `last_name`, `email`, `phone`
2. Se crea un registro en `clients` con esos datos + `project_id`, `package_id`, `total_amount`, `lead_id`
3. Se actualiza el lead: `status = 'converted'`

Si cualquier paso falla, se lanza un error descriptivo. La operación NO es transaccional a nivel de base de datos (no usa una función RPC de Postgres) — si el UPDATE del lead falla después de crear el cliente, el cliente queda creado pero el lead sin status. Para ambientes de producción críticos, considerar migrar a una RPC function en Supabase.

## Filtros por URL

Los filtros de la página de leads usan `searchParams` en el Server Component en vez de estado React local por tres razones:

1. **SSR**: Los datos se filtran en el servidor, sin fetch extra en el cliente
2. **Compartible**: La URL `/dashboard/leads?status=new` puede copiarse y compartirse
3. **Historial**: `router.push()` permite navegar atrás a la URL filtrada anterior

## Leads desde el website

El website público llama a `createLead()` de `@habitta/database` cuando alguien llena el formulario de contacto. El lead llega con `status: 'new'` automáticamente y aparece inmediatamente en `/dashboard/leads`.

El dashboard no necesita polling — el equipo revalida o hace refresh para ver nuevos leads. En una iteración futura se puede agregar un webhook o realtime de Supabase.

## Paquetes dinámicos en formularios

Los formularios de creación de lead y conversión cargan los paquetes dinámicamente desde `/api/packages?project_id=X` (Route Handler de Next.js). Esto evita pasar todos los paquetes de todos los proyectos al componente cliente y mantiene el payload pequeño.
