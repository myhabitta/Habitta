# Dashboard — Visión general

App interna de Habitta. Solo la usa el equipo comercial y administrativo.

**Framework:** Next.js 15 con App Router
**Puerto dev:** 3000
**Deploy:** Vercel
**Acceso:** requiere login (Supabase Auth)

---

## ¿Qué hace?

Centraliza la gestión del proceso comercial de Habitta:

- Ver y gestionar los leads que llegan desde el website
- Convertir leads en clientes y hacer seguimiento
- Administrar los proyectos inmobiliarios y sus paquetes

---

## Secciones principales

| Ruta                  | Qué hace                                      |
| --------------------- | --------------------------------------------- |
| `/`                   | Redirige automáticamente a `/dashboard/leads` |
| `/dashboard/leads`    | Lista de leads, estado, filtros y acciones    |
| `/dashboard/clients`  | Clientes activos con historial                |
| `/dashboard/projects` | Gestión de proyectos y paquetes               |

---

## Documentos relacionados

- `structure.md` → cómo está organizado el código internamente
- `auth.md` → cómo funciona el login y la protección de rutas
- `data-flow.md` → cómo llegan los datos del servidor al cliente _(se actualizará)_
