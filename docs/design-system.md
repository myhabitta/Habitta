# Habitta Dashboard — Design System

Sistema de diseño visual para `apps/dashboard`. Luxury/refined con toques modernos, orientado a productividad interna del equipo de ventas.

---

## Principio fundamental

**Nunca usar colores hardcodeados.** Todo valor de color, fuente o espaciado debe venir de un token definido en este sistema. Si necesitas un color que no existe, añádelo como token primero.

```tsx
// Correcto
<div className="bg-habitta-sidebar-bg text-habitta-sidebar-text" />
<span className="text-habitta-accent font-display" />

// Nunca
<div style={{ background: '#f5f7fa', color: '#3a4257' }} />
<span className="text-[#C8763A]" />
```

---

## Tipografia

### Fuentes disponibles

| Familia         | Variable CSS      | Clase Tailwind   | Origen          |
|-----------------|-------------------|------------------|-----------------|
| Playfair Display | `--font-display` | `font-display`   | next/font/google |
| DM Sans         | `--font-sans`     | `font-sans`      | next/font/google |

Las variables se inyectan en el tag `<html>` desde `apps/dashboard/app/layout.tsx` y están disponibles globalmente en todo el dashboard.

### Cuándo usar cada fuente

**Playfair Display (`font-display`)** — tipografía serif elegante con alto contraste entre trazos finos y gruesos.

Usar en:
- Títulos de página (`h1`, `h2`) con jerarquía editorial
- Nombres de proyectos inmobiliarios en cards o headers
- Estadísticas o cifras destacadas que necesiten peso visual
- Encabezados de secciones de reporte o detalle

```tsx
<h1 className="font-display text-3xl font-semibold tracking-tight">
  Proyectos activos
</h1>

<span className="font-display text-4xl font-bold text-habitta-accent">
  142
</span>
```

**DM Sans (`font-sans`)** — sans-serif geométrica de alta legibilidad, optimizada para interfaces.

Usar en:
- Todo el cuerpo de texto (es el default del `<body>`)
- Labels de formularios, botones, badges
- Texto de tablas y listas
- Navegación y sidebar
- Textos secundarios y metadatos

```tsx
<p className="font-sans text-sm text-muted-foreground">
  Última actualización: hace 3 minutos
</p>
```

### Escala tipográfica recomendada

| Uso                        | Clases Tailwind                                        |
|----------------------------|--------------------------------------------------------|
| Título de página           | `font-display text-3xl font-semibold tracking-tight`   |
| Subtítulo de sección       | `font-display text-xl font-medium`                     |
| Título de card             | `font-sans text-base font-semibold`                    |
| Cuerpo de texto            | `font-sans text-sm`                                    |
| Texto secundario           | `font-sans text-sm text-muted-foreground`              |
| Label de formulario        | `font-sans text-sm font-medium`                        |
| Badge / chip               | `font-sans text-xs font-medium`                        |
| Número/métrica destacada   | `font-display text-4xl font-bold`                      |

---

## Paleta de colores

### Tokens de UI base (shadcn/ui)

Definidos en `apps/dashboard/app/globals.css`. Se aplican automáticamente en los componentes shadcn.

| Token Tailwind         | Light (`#hex`)  | Dark (`#hex`)   | Uso principal                              |
|------------------------|-----------------|-----------------|--------------------------------------------|
| `bg-background`        | `#ffffff`       | `#0f172a`       | Fondo de toda la app                       |
| `text-foreground`      | `#0f172a`       | `#f8fafc`       | Texto principal                            |
| `bg-card`              | `#ffffff`       | `#1e293b`       | Fondo de tarjetas                          |
| `text-card-foreground` | `#0f172a`       | `#f8fafc`       | Texto dentro de tarjetas                   |
| `bg-primary`           | `#1e293b`       | `#f8fafc`       | Botones primarios, elementos destacados    |
| `text-muted-foreground`| `#64748b`       | `#94a3b8`       | Texto secundario, placeholders             |
| `bg-secondary`         | `#f1f5f9`       | `#334155`       | Fondos de hover, elementos de soporte      |
| `border-border`        | `#e2e8f0`       | `#334155`       | Bordes generales                           |
| `bg-destructive`       | `#ef4444`       | `#991b1b`       | Acciones destructivas (eliminar, error)    |

### Tokens Habitta temáticos (acento y sidebar)

Definidos en `apps/dashboard/app/globals.css` bajo `--habitta-*`. Cambian automáticamente con el tema (light/dark).

#### Acento dorado/cobre

| Token Tailwind                  | Light (`#hex`) | Dark (`#hex`) | Descripción                           |
|---------------------------------|----------------|---------------|---------------------------------------|
| `text-habitta-accent`            | `#CA902B`      | `#CB9D4D`     | Tono cobre dorado, marca Habitta       |
| `bg-habitta-accent`              | `#CA902B`      | `#CB9D4D`     | Fondos de acento, CTA secundarios     |
| `text-habitta-accent-foreground` | `#ffffff`      | `#131720`     | Texto sobre fondo de acento           |
| `bg-habitta-accent-foreground`   | `#ffffff`      | `#131720`     | Fondo para texto con acento invertido |

Cuándo usar el acento:
- Indicadores de estado premium o destacado
- Iconos y decoraciones de la marca
- Bordes de elementos activos o seleccionados
- Badges de tipo "nuevo lead", "cliente VIP"
- Hover states en elementos de navegación importantes

```tsx
// Badge de estado premium
<Badge className="bg-habitta-accent text-habitta-accent-foreground">
  Cliente VIP
</Badge>

// Borde activo en una card seleccionada
<Card className="border-2 border-habitta-accent">
  ...
</Card>

// Texto de acento sobre fondo claro
<span className="text-habitta-accent font-semibold">
  +12% este mes
</span>
```

#### Sidebar

| Token Tailwind                    | Light (`#hex`) | Dark (`#hex`) | Descripción                         |
|-----------------------------------|----------------|---------------|-------------------------------------|
| `bg-habitta-sidebar-bg`            | `#F6F7F9`      | `#131720`     | Fondo del panel de navegación       |
| `border-habitta-sidebar-border`    | `#E2E4E9`      | `#212631`     | Bordes internos del sidebar         |
| `text-habitta-sidebar-text`        | `#4C5567`      | `#98A1B3`     | Texto de ítems de navegación        |
| `text-habitta-sidebar-text-active` | `#131720`      | `#ffffff`     | Texto del ítem de navegación activo |

Cuándo usar tokens de sidebar:
- Exclusivamente dentro del componente `Sidebar` y su navegación
- Nunca usar estos tokens fuera del contexto de navegación lateral

```tsx
// Ítem de navegación
<li className="text-habitta-sidebar-text hover:text-habitta-sidebar-text-active">
  Leads
</li>

// Separador dentro del sidebar
<hr className="border-habitta-sidebar-border" />
```

### Tokens de brand (fijos, sin tema)

Definidos en `apps/dashboard/tailwind.config.ts`. No cambian entre light y dark. Son el color de identidad visual de Habitta.

| Token Tailwind    | Hex       | Uso                                           |
|-------------------|-----------|-----------------------------------------------|
| `bg-brand`        | `#C8763A` | Color principal Habitta, logos, elementos fijos |
| `text-brand`      | `#C8763A` | Texto con el color de marca                   |
| `bg-brand-dark`   | `#8B3A0F` | Variante oscura para hover o gradientes       |
| `bg-brand-light`  | `#E8A060` | Variante clara para fondos suaves de marca    |

Diferencia entre `brand` y `habitta-accent`: `brand` es fijo (para logos y elementos de identidad que no cambian de tono entre temas), `habitta-accent` se adapta al tema (más saturado en light, más suave en dark).

---

## Como usar tokens en componentes nuevos

### Patron basico

Siempre importar desde el sistema de diseño, nunca hardcodear:

```tsx
// atoms/StatusBadge.tsx
interface StatusBadgeProps {
  status: 'nuevo' | 'contactado' | 'convertido';
}

const statusConfig = {
  nuevo: {
    label: 'Nuevo',
    className: 'bg-habitta-accent/10 text-habitta-accent border-habitta-accent/20',
  },
  contactado: {
    label: 'Contactado',
    className: 'bg-secondary text-secondary-foreground',
  },
  convertido: {
    label: 'Convertido',
    className: 'bg-primary text-primary-foreground',
  },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { label, className } = statusConfig[status];
  return (
    <Badge className={className}>
      {label}
    </Badge>
  );
};
```

### KPI Card con tipografia del sistema

```tsx
// metrics/KpiCard.tsx
'use client';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
}

const KpiCard = ({ title, value, change, positive }: KpiCardProps) => {
  return (
    <Card className="p-6">
      <p className="font-sans text-sm text-muted-foreground">{title}</p>
      <p className="font-display text-4xl font-bold mt-2">{value}</p>
      {change && (
        <p className={`font-sans text-sm mt-1 ${positive ? 'text-habitta-accent' : 'text-destructive'}`}>
          {change}
        </p>
      )}
    </Card>
  );
};
```

### Header de pagina con jerarquia visual

```tsx
// Patron para encabezados de seccion en el dashboard
<div className="mb-8">
  <h1 className="font-display text-3xl font-semibold tracking-tight">
    Leads
  </h1>
  <p className="font-sans text-sm text-muted-foreground mt-1">
    142 leads capturados este mes
  </p>
</div>
```

### Tabla con identidad visual Habitta

```tsx
// Fila seleccionada o activa en una tabla
<TableRow className="hover:bg-habitta-accent/5 data-[state=selected]:bg-habitta-accent/10">
  ...
</TableRow>
```

---

## Checklist para nuevos componentes

Antes de hacer commit de un componente nuevo, verificar:

- [ ] Usa `font-display` para titulos y `font-sans` para cuerpo (nunca inline `style={{ fontFamily: ... }}`)
- [ ] Los colores vienen de tokens Tailwind (`text-habitta-accent`, `bg-sidebar-bg`, etc.)
- [ ] No hay valores hardcodeados de color (`#hex`, `rgb()`, `hsl()` directo en className o style)
- [ ] Los tokens de sidebar se usan solo dentro del contexto de navegacion lateral
- [ ] Si el componente tiene estado de hover/focus, usa transiciones: `transition-colors duration-150`
- [ ] En modo oscuro, el componente se ve correcto sin clases `dark:` adicionales (los tokens ya lo manejan)

---

## Donde viven los tokens

| Que                           | Donde editarlo                                      |
|-------------------------------|-----------------------------------------------------|
| Fuentes (variables CSS)       | `apps/dashboard/app/layout.tsx`                     |
| Tokens UI base (shadcn)       | `apps/dashboard/app/globals.css` — `:root` y `.dark` |
| Tokens Habitta temáticos       | `apps/dashboard/app/globals.css` — bajo comentario `Habitta brand tokens` |
| Mapping Tailwind de tokens    | `apps/dashboard/tailwind.config.ts` — `theme.extend.colors` |
| Fuentes en Tailwind           | `apps/dashboard/tailwind.config.ts` — `theme.extend.fontFamily` |
| Colores brand fijos           | `apps/dashboard/tailwind.config.ts` — `colors.brand` |

---

## Layout del Dashboard

Estructura: sidebar fijo 260px + columna principal (header 64px + contenido scrolleable)

### Cómo agregar una página nueva

1. Crear `apps/dashboard/app/dashboard/nueva-seccion/page.tsx`
2. El layout la envuelve automáticamente con Sidebar + Header
3. Agregar el item de navegación en el array `navItems` de `components/layout/Sidebar.tsx`

### Cómo agregar item al sidebar

Editar el array `navItems` en `components/layout/Sidebar.tsx`:
```ts
{
  label: 'Nueva sección',
  href: '/dashboard/nueva-seccion',
  icon: IconoLucide,
  roles: ['admin'] // o ['admin', 'sales']
}
```

### Cómo proteger ruta por rol

Agregar la ruta en `middleware.ts` dentro de `ADMIN_ONLY_ROUTES`:
```ts
const ADMIN_ONLY_ROUTES = ['/dashboard/projects', '/dashboard/nueva-seccion']
```

### Patrón de datos en páginas

- Siempre fetch en Server Component con `async/await` y `Promise.all`
- Nunca `useEffect` para datos iniciales
- Para interactividad: pasar datos como props a Client Components
```tsx
// Correcto
const [leads, clients] = await Promise.all([getLeads(), getClients()])

// Nunca
useEffect(() => { fetchData() }, [])
```
