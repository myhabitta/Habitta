# Módulo de Clientes

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/dashboard/clients` | Listado de todos los clientes con stats y filtro por proyecto |
| `/dashboard/clients/[id]` | Detalle de un cliente: info personal, compra realizada, lead de origen |

## Origen de los clientes

Los clientes se crean **exclusivamente** a través de la conversión de un lead.
No existe formulario de creación manual de clientes.

El flujo es:
1. Un visitante del website llena el formulario de contacto — se crea un `lead`
2. El equipo comercial lo gestiona en `/dashboard/leads`
3. Al cerrar la venta, se convierte desde `/dashboard/leads/[id]/convert`
4. Esto crea un registro en `clients` con `lead_id` apuntando al lead

## Relaciones en base de datos

```
clients → projects (INNER JOIN por project_id)
  Siempre obligatorio: un cliente siempre tiene un proyecto asignado

clients → packages (INNER JOIN por package_id)
  Siempre obligatorio: un cliente siempre tiene un paquete elegido

clients → leads (LEFT JOIN por lead_id)
  Opcional: puede ser null si se creó por otro medio en el futuro
```

## Estados del cliente

```
pendiente → en_proceso → completado
```

- **pendiente**: Proceso de compra iniciado, en espera de confirmación
- **en_proceso**: Documentación y trámites en curso
- **completado**: Proceso de compra finalizado exitosamente

A diferencia del lead, el estado del cliente se selecciona directamente desde el `ClientStatusSelector` — no hay stepper lineal porque los tres estados son igualmente válidos en cualquier orden según el equipo comercial.

## Métricas de ingresos

`totalRevenue` y `averageTicket` se calculan en `getClientStats()` dentro de `@habitta/database`, no en el frontend.

Razones:
- **Consistencia**: el mismo número aparece igual en cualquier componente
- **Performance**: una sola query vs múltiples renders calculando lo mismo
- **Escalabilidad**: cuando haya miles de clientes, el cálculo se hace en la BD, no en memoria del servidor Node
- **Separación de responsabilidades**: el componente solo muestra, no calcula

`totalRevenue`: `SUM(total_amount)` sobre todos los clientes
`averageTicket`: `totalRevenue / total` (0 si no hay clientes, para evitar división por cero)
`thisMonth`: COUNT de clientes cuyo `created_at >= primer día del mes actual` (comparación ISO string UTC)

## Componentes

| Componente | Tipo | Descripción |
|------------|------|-------------|
| `ClientsTable` | Client | Tabla de clientes con navegación por fila |
| `ClientsFilters` | Client | Selector de proyecto para filtrar la tabla |
| `ClientNotesEditor` | Client | Editor de notas con guardado via Server Action |
| `ClientStatusSelector` | Client | Selector de estado (pendiente / en_proceso / completado) |
| `ClientsEmptyState` | Server | Estado vacío cuando no hay clientes o no hay resultados del filtro |
