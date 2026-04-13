# Módulo de Métricas

Documentación del módulo de métricas del dashboard de Habitta.

---

## Rutas

| Ruta                  | Acceso      | Descripción                              |
| --------------------- | ----------- | ---------------------------------------- |
| `/dashboard`          | Todos       | Cards de resumen con datos de métricas   |
| `/dashboard/metrics`  | Solo admin  | Página completa con gráficas y análisis  |

El link "Ver métricas completas →" en la página de inicio solo se renderiza si `user.role === 'admin'`.

---

## Queries y rendimiento

Todas las queries de métricas están en `packages/database/src/queries/metrics.ts`.

### getDashboardMetrics()

Query principal que agrega datos de `leads` y `clients` en una sola llamada. Retorna el tipo `DashboardMetrics` de `@habitta/types`:

```ts
{
  revenue: { total, thisMonth, lastMonth, growthPercentage }
  leads: { total, thisMonth, conversionRate }
  clients: { total, thisMonth, averageTicket }
  topPackage: PackagePerformance | null
  topProject: ProjectPerformance | null
}
```

**Por qué una sola query y no queries separadas:** antes, la página de inicio hacía 3 llamadas independientes (`getLeads`, `getClients`, `getProjects`) y calculaba los aggregados en JavaScript del servidor. Ahora `getDashboardMetrics()` hace 2 consultas (`leads` y `clients`) y llama internamente a `getPackagePerformance()` y `getProjectPerformance()` en paralelo con `Promise.all`. Más eficiente con datasets grandes porque:
- Menos round-trips a Supabase
- Los cálculos de conversión, growth y totales ocurren en el servidor, no en el cliente

### getMonthlyRevenue(months)

Consulta `clients` filtrando por `created_at` en el rango de los últimos N meses. Los aggregados de revenue y conteo de clientes se calculan en JavaScript sobre los rows devueltos.

> **Alternativa futura:** si el volumen de datos crece, considerar una función de PostgreSQL con `date_trunc` y `SUM` para hacer la agrupación directamente en la base de datos.

### getPackagePerformance() y getProjectPerformance()

Hacen joins en memoria entre `clients`, `packages` y `projects`. Para tablas pequeñas (< 10k rows) esto es aceptable; para escala mayor, migrar a vistas materializadas en Supabase.

---

## Gráficas

**Stack:** [Recharts](https://recharts.org/) — librería de gráficas para React.

Todos los componentes de gráficas son Client Components (`'use client'`) porque Recharts requiere el DOM.

| Componente                    | Ubicación                                       | Tipo de gráfica       |
| ----------------------------- | ----------------------------------------------- | --------------------- |
| `RevenueChart`                | `components/metrics/RevenueChart.tsx`           | Área — ingresos mes a mes |
| `PackagePerformanceChart`     | `components/metrics/PackagePerformanceChart.tsx`| Barras — ventas por paquete |
| `ProjectPerformanceTable`     | `components/metrics/ProjectPerformanceTable.tsx`| Tabla con rankings    |
| `ConversionFunnel`            | `components/metrics/ConversionFunnel.tsx`       | Embudo leads → clientes |

---

## GrowthBadge

Componente reutilizable que muestra el crecimiento porcentual entre dos periodos.

**Ubicación:** `components/metrics/GrowthBadge.tsx`

**Props:**

```ts
interface GrowthBadgeProps {
  value: number; // porcentaje — positivo o negativo
}
```

**Comportamiento:**
- Valor positivo → fondo verde (`--success-tint`), ícono `TrendingUp`
- Valor negativo → fondo rojo (`--destructive-tint`), ícono `TrendingDown`
- Prefijo `+` automático para valores positivos

**Uso en otros módulos:**

```tsx
import GrowthBadge from '@/components/metrics/GrowthBadge';

// En cualquier card que tenga crecimiento mensual
<GrowthBadge value={metrics.revenue.growthPercentage} />
```

Actualmente se usa en:
- `app/dashboard/page.tsx` — card de ingresos totales
- `app/dashboard/metrics/page.tsx` — KPI card de ingresos

---

## Meses sin datos en RevenueChart

`getMonthlyRevenue()` siempre rellena todos los meses del rango solicitado, incluso si no hay clientes en ese mes:

```ts
// Genera el mapa completo primero con revenue: 0
for (let i = 0; i < months; i++) {
  monthsMap.set(key, { revenue: 0, clients: 0 });
}

// Luego sobrescribe con datos reales
for (const row of rows) { ... }
```

**Por qué:** Recharts necesita un punto de datos por cada mes para dibujar una línea continua. Si se omiten meses vacíos, la gráfica de área tiene huecos o saltos visuales incorrectos. Rellenar con `0` garantiza que la gráfica sea coherente visualmente y que el eje X muestre todos los meses del periodo.
