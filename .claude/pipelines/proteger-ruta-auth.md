# Pipeline: proteger-ruta-auth

## Cuándo usarlo

Cuando se necesite implementar o revisar la autenticación en el dashboard:

- Proteger una ruta nueva con sesión activa
- Configurar el middleware de auth para nuevas secciones
- Implementar sign in / sign out
- Gestionar sesiones y refresh tokens
- Recuperación de contraseña para el equipo

## Tarea para el orquestador

Ejecuta los siguientes agentes en este orden exacto.

---

## Paso 1 — backend-supabase-agent

**Qué hace:** Configura o verifica la autenticación con Supabase Auth.
Revisa que el cliente de Supabase esté correctamente inicializado para SSR en Next.js.
Verifica las políticas RLS de las tablas que la ruta protegida va a consumir.
Si es una ruta nueva, asegura que el usuario autenticado tenga permisos correctos.

Skills que usa:

- supabase-auth
- schema-design-skill

Resultado esperado: auth configurado correctamente a nivel de Supabase.

---

## Paso 2 — dashboard-builder-agent

**Qué hace:** Implementa la protección de ruta en Next.js App Router.
Configura el middleware de Supabase para la ruta indicada.
Implementa el redirect a /login si no hay sesión activa.
Si no existe, crea la página de login con formulario de sign in.

Patrón de protección:

```typescript
// apps/dashboard/middleware.ts
// Intercepta rutas /dashboard/* y verifica sesión con Supabase
```

Skills que usa:

- next-best-practices
- nextjs-shadcn
- supabase-auth
- ts-strict-skill

Resultado esperado: ruta protegida — redirige a /login si no hay sesión.

---

## Paso 3 — typescript-auditor-agent

**Qué hace:** Valida los tipos del middleware y de las funciones de auth.
Verifica que el tipo de sesión y user sean correctos (no any).
Verifica que SUPABASE_SERVICE_ROLE_KEY no esté en código cliente.

Skills que usa:

- ts-strict-skill
- typescript-best-practices

Resultado esperado: tipos de auth correctos sin exposición de secretos.

---

## Paso 4 — linter-formatter-agent

**Qué hace:** Formatea el middleware y los componentes de auth.

Skills que usa:

- eslint-prettier
- prettier-skill

Resultado esperado: código de auth limpio y consistente.

---

## Notas

- Toda la lógica de auth usa Supabase Auth, nunca custom auth.
- SUPABASE_SERVICE_ROLE_KEY solo en Server Actions o middleware server-side.
- La sesión se verifica en el middleware de Next.js antes de renderizar la página.
- Todas las rutas bajo /dashboard/\* requieren sesión activa.
- Para el equipo pequeño de Habitta: auth por email/password es suficiente.
- El token de sesión se refresca automáticamente con el cliente SSR de Supabase.
