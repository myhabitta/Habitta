# Dashboard — Autenticación

> Este documento se actualizará a medida que se implemente el auth.
> Por ahora documenta la arquitectura planificada.

---

## Tecnología

Supabase Auth. Maneja sesiones, tokens y refresh automático.

---

## Cómo funciona el flujo

```
Usuario entra a /dashboard/cualquier-ruta
          ↓
middleware.ts intercepta el request
          ↓
¿Hay sesión válida?
    Sí → continúa a la ruta
    No → redirige a /login
          ↓
Usuario hace login (email + password)
          ↓
Supabase devuelve sesión
          ↓
Redirige a /dashboard/leads
```

---

## Archivos clave

| Archivo         | Qué hace                                             |
| --------------- | ---------------------------------------------------- |
| `middleware.ts` | Verifica sesión en cada request a rutas protegidas   |
| `app/(auth)/`   | Rutas de login, logout y callback de Supabase        |
| `lib/supabase/` | Clientes de Supabase (server y client) _(por crear)_ |

---

## Claves de Supabase

| Variable                        | Dónde se usa                     | Se expone al cliente |
| ------------------------------- | -------------------------------- | -------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Cualquier lado                   | Sí (es pública)      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client Components                | Sí (es pública)      |
| `SUPABASE_SERVICE_ROLE_KEY`     | Solo Server Actions / API Routes | **Nunca**            |

La `SERVICE_ROLE_KEY` tiene permisos totales sobre la BD — si llega al cliente es una vulnerabilidad grave.

---

## Estado actual

- [ ] Middleware de verificación de sesión
- [ ] Rutas de login/logout
- [ ] Cliente Supabase para server y client
- [ ] Protección de rutas `/dashboard/*`
