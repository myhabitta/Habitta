# Autenticación — Habitta Dashboard

## Stack
- Supabase Auth (email + password)
- @supabase/ssr — compatibilidad con Next.js App Router (SSR + cookies)
- Server Actions — submit del formulario sin API routes adicionales

## Flujo completo

```
Usuario → /login
   → LoginForm (Client Component)
   → loginAction (Server Action)
   → signIn() de @habitta/database
   → Supabase Auth API
   → Éxito: redirect('/dashboard')
   → Error: mostrar mensaje en formulario
```

## Middleware

Archivo: `apps/dashboard/middleware.ts`

| Ruta | Comportamiento |
|------|---------------|
| `/login` | Pública. Si hay sesión → redirect `/dashboard` |
| `/dashboard/*` | Requiere sesión activa |
| `/dashboard/projects/*` | Requiere `role === 'admin'` |

## Roles

| Rol | Acceso |
|-----|--------|
| `admin` | Todo el dashboard — leads, clientes, proyectos |
| `sales` | Solo leads y clientes. Bloqueado en /dashboard/projects |

El rol se lee desde `user.user_metadata.role`. Si no tiene rol asignado, el middleware asigna `'sales'` por defecto.

## Crear nuevos usuarios

1. Ir a **Supabase Dashboard → Authentication → Users**
2. Click **"Add user"** → "Create new user"
3. Ingresar email y contraseña
4. Después de crear el usuario, ir a **Table Editor → profiles**
5. Editar la fila del nuevo usuario:
   - `full_name`: nombre completo
   - `role`: `admin` o `sales`

> El trigger `on_auth_user_created` crea automáticamente la fila en `profiles` con `role = 'sales'` al crear el usuario.

## Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase. Visible en Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública anon. Para operaciones desde el cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave privada. Solo en servidor. **Nunca exponer al cliente** |
