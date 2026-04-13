# Habitta — Visión general

Habitta es una startup inmobiliaria colombiana que vende proyectos de vivienda con diferentes niveles de acabados llamados **paquetes**.

---

## El flujo del negocio

```
Comprador ve un proyecto en el website
          ↓
Elige un paquete de acabados y llena el formulario
          ↓
Se crea un Lead en la base de datos
          ↓
El equipo lo gestiona desde el Dashboard
          ↓
Se convierte en Cliente
```

---

## Las dos apps

| App           | Quién la usa                      | Framework             |
| ------------- | --------------------------------- | --------------------- |
| **Website**   | Compradores potenciales (público) | Astro + React Islands |
| **Dashboard** | Equipo interno de Habitta          | Next.js App Router    |

---

## La base de datos

Supabase (PostgreSQL). Cuatro tablas principales:

| Tabla      | Qué guarda                                  |
| ---------- | ------------------------------------------- |
| `projects` | Proyectos inmobiliarios                     |
| `packages` | Paquetes de acabados por proyecto           |
| `leads`    | Personas que contactaron desde el website   |
| `clients`  | Leads que avanzaron en el proceso comercial |

---

## Cómo se despliega

- **Website y Dashboard** → Vercel
- **Base de datos y Auth** → Supabase
- **Imágenes y assets** → Cloudflare R2

---

## Documentos relacionados

- `monorepo.md` → cómo está organizado el código
- `tooling.md` → configuración de herramientas (TypeScript, Prettier, ESLint)
- `docs/dashboard/` → detalle del dashboard
- `docs/website/` → detalle del website
