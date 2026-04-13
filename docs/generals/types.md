# Tipos TypeScript — @habitta/types

Paquete centralizado de tipos del negocio. Todas las apps y paquetes importan desde aquí.

```ts
import type { Project, Package, Lead, LeadNote, Client } from '@habitta/types';
```

**Regla:** nunca duplicar un tipo en una app. Si existe aquí, se importa de aquí.

---

## Convenciones

- Se usa `type` (no `interface`) para todos los modelos de datos
- Los campos usan **snake_case** para coincidir con las columnas de Supabase/PostgreSQL
- Los timestamps son `string` (ISO 8601 — formato que devuelve Supabase)

---

## Entidades

### Project

Proyecto inmobiliario.

| Campo         | Tipo                     | Notas                                |
| ------------- | ------------------------ | ------------------------------------ |
| `id`          | `string`                 | UUID de Supabase                     |
| `slug`        | `string`                 | URL-friendly (ej: `bello-antioquia`) |
| `name`        | `string`                 | Nombre del proyecto                  |
| `city`        | `string`                 | Ciudad donde está ubicado            |
| `department`  | `string`                 | Departamento colombiano              |
| `description` | `string`                 | Descripción general                  |
| `status`      | `'active' \| 'inactive'` | Si está visible o no                 |
| `created_at`  | `string`                 | ISO 8601                             |
| `updated_at`  | `string`                 | ISO 8601                             |

---

### Package

Paquete de acabados de un proyecto.

| Campo         | Tipo                     | Notas                                |
| ------------- | ------------------------ | ------------------------------------ |
| `id`          | `string`                 | UUID                                 |
| `project_id`  | `string`                 | FK → projects.id                     |
| `name`        | `string`                 | Nombre del paquete                   |
| `slug`        | `string`                 | URL-friendly (ej: `paquete-premium`) |
| `description` | `string`                 | Descripción del paquete              |
| `price`       | `number`                 | Precio en COP                        |
| `features`    | `string[]`               | Lista de características incluidas   |
| `status`      | `'active' \| 'inactive'` | Si está disponible                   |
| `created_at`  | `string`                 | ISO 8601                             |
| `updated_at`  | `string`                 | ISO 8601                             |

---

### LeadNote

Entrada individual del historial de acompañamiento de un lead.

| Campo        | Tipo     | Notas                                           |
| ------------ | -------- | ----------------------------------------------- |
| `text`       | `string` | Contenido de la nota                            |
| `created_at` | `string` | ISO 8601 — cuándo se escribió                   |
| `created_by` | `string` | Email del usuario del dashboard que la escribió |

---

### Lead

Persona interesada en un proyecto. Puede venir del website o ser registrada manualmente desde el dashboard.

| Campo        | Tipo                                                             | Notas                                                            |
| ------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| `id`         | `string`                                                         | UUID                                                             |
| `first_name` | `string`                                                         |                                                                  |
| `last_name`  | `string`                                                         |                                                                  |
| `email`      | `string`                                                         |                                                                  |
| `phone`      | `string`                                                         |                                                                  |
| `project_id` | `string?`                                                        | Proyecto de interés (opcional)                                   |
| `package_id` | `string?`                                                        | Paquete de interés (opcional)                                    |
| `status`     | `'new' \| 'contacted' \| 'negotiating' \| 'converted' \| 'lost'` | Estado en el proceso comercial                                   |
| `notes`      | `LeadNote[]`                                                     | Historial de acompañamiento — se guarda como `jsonb` en Supabase |
| `created_at` | `string`                                                         | ISO 8601                                                         |
| `updated_at` | `string`                                                         | ISO 8601                                                         |

**Flujo de status:**

```
new → contacted → negotiating → converted (pasa a clients)
                              ↘ lost
```

**Dos formas de crear un lead:**

- Desde el **website**: el comprador llena el formulario → `status: 'new'`, `notes: []`
- Desde el **dashboard**: el equipo lo registra manualmente (llamada, feria, referido)

---

### Client

Lead que avanzó en el proceso y se convirtió en cliente.

| Campo          | Tipo     | Notas               |
| -------------- | -------- | ------------------- |
| `id`           | `string` | UUID                |
| `lead_id`      | `string` | FK → leads.id       |
| `first_name`   | `string` |                     |
| `last_name`    | `string` |                     |
| `email`        | `string` |                     |
| `phone`        | `string` |                     |
| `project_id`   | `string` | Proyecto contratado |
| `package_id`   | `string` | Paquete contratado  |
| `total_amount` | `number` | Monto total en COP  |
| `created_at`   | `string` | ISO 8601            |
| `updated_at`   | `string` | ISO 8601            |
