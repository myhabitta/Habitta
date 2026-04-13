---
name: vercel
description: |
  Deploy, configuración y observabilidad en Vercel para Habitta.
  Úsame para deployar website o dashboard a producción, revisar logs de un deploy fallido, configurar el proyecto en Vercel CLI, o gestionar variables de entorno en producción.
  Comandos clave: vercel deploy, vercel logs, vercel env, vercel inspect, vercel rollback.
license: MIT
metadata:
  authors: 'Habitta'
  version: '1.0.0'
---

# Vercel — Habitta

Habitta despliega dos apps en Vercel desde el mismo monorepo:

- **website** → plataforma pública (Astro) — prioridad de uptime máxima
- **dashboard** → app interna (Next.js) — puede tolerar brief downtime

---

## Proyectos en Vercel

| App         | Framework | Comando de build                | Output dir |
| ----------- | --------- | ------------------------------- | ---------- |
| `website`   | Astro     | `pnpm --filter website build`   | `dist/`    |
| `dashboard` | Next.js   | `pnpm --filter dashboard build` | `.next/`   |

---

## CLI — Comandos esenciales

### Setup inicial

```bash
# Instalar CLI globalmente si no está
npm i -g vercel

# Autenticarse
vercel login

# Linkear el proyecto desde la raíz del monorepo
cd apps/website && vercel link
cd apps/dashboard && vercel link
```

### Deploy

```bash
# Deploy a preview (staging)
vercel

# Deploy a producción — SIEMPRE pedir confirmación antes
vercel --prod

# Deploy de una app específica desde la raíz del monorepo
vercel --cwd apps/website --prod
vercel --cwd apps/dashboard --prod
```

### Logs

```bash
# Ver logs del último deploy
vercel logs

# Logs de un deploy específico (obtener URL del deploy de `vercel list`)
vercel logs <deployment-url>

# Logs en tiempo real (útil para debugging)
vercel logs --follow
```

### Inspeccionar deploys

```bash
# Listar deployments recientes
vercel list

# Inspeccionar un deployment específico
vercel inspect <deployment-url>

# Ver estado del proyecto
vercel status
```

### Rollback

```bash
# Revertir al deployment anterior en producción
vercel rollback

# Rollback a un deployment específico
vercel rollback <deployment-url>
```

---

## Variables de entorno

Las variables de entorno se configuran por proyecto y por entorno (production, preview, development).

```bash
# Listar todas las variables del proyecto actual
vercel env ls

# Agregar una variable
vercel env add NOMBRE_VARIABLE

# Agregar para un entorno específico
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Eliminar una variable
vercel env rm NOMBRE_VARIABLE
```

### Variables requeridas por app

**apps/website** (Astro):

```
PUBLIC_SUPABASE_URL          → todos los entornos
PUBLIC_SUPABASE_ANON_KEY     → todos los entornos
```

**apps/dashboard** (Next.js):

```
NEXT_PUBLIC_SUPABASE_URL         → todos los entornos
NEXT_PUBLIC_SUPABASE_ANON_KEY    → todos los entornos
SUPABASE_SERVICE_ROLE_KEY        → solo production y preview (nunca en client)
```

> `SUPABASE_SERVICE_ROLE_KEY` — configurar como variable **sin** prefijo `NEXT_PUBLIC_` para que nunca llegue al bundle del browser.

---

## Configuración `vercel.json`

Cada app puede tener su `vercel.json` para configuración específica:

```json
// apps/website/vercel.json
{
  "buildCommand": "pnpm --filter website build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "astro"
}
```

```json
// apps/dashboard/vercel.json
{
  "buildCommand": "pnpm --filter dashboard build",
  "framework": "nextjs"
}
```

---

## Deploy automático desde GitHub

El deploy automático se activa al hacer push a `main`. Configuración en Vercel dashboard:

- **Branch de producción:** `main`
- **Preview branches:** cualquier PR → genera URL de preview automáticamente
- **Build & Development Settings:** configurar el Root Directory a `apps/website` o `apps/dashboard` según el proyecto

---

## Debugging de builds fallidos

### Estrategia

1. Correr `vercel logs <url>` para ver el error exacto
2. Reproducir localmente: `pnpm --filter website build` o `pnpm --filter dashboard build`
3. Si es error de variables de entorno: `vercel env ls` para verificar que existan
4. Si es error de tipos: activar `typescript-auditor-agent`
5. Si es error de dependencias: verificar `pnpm-lock.yaml` y correr `pnpm install --frozen-lockfile`

### Errores frecuentes en Vercel

**`Error: Command "pnpm build" exited with 1`**
→ Build falló — ver logs completos con `vercel logs`

**`Error: Cannot find module`**
→ Dependencia no instalada o path alias mal configurado
→ Verificar que `pnpm-workspace.yaml` incluya el package

**`Error: Environment variable not found`**
→ Variable no configurada en Vercel
→ Agregar con `vercel env add`

**Build timeout (> 45 minutos)**
→ Turbo cache no está funcionando
→ Verificar configuración de caché en `vercel.json`

---

## Checklist pre-deploy a producción

Antes de correr `vercel --prod`, verificar:

- [ ] `pnpm build` pasa localmente sin errores
- [ ] `pnpm typecheck` sin errores de TypeScript
- [ ] `pnpm lint` sin errores
- [ ] Variables de entorno configuradas en Vercel (`vercel env ls`)
- [ ] No hay secretos hardcodeados en el código
- [ ] Se revisó el diff de cambios — nada inesperado

---

## Buenas prácticas Habitta

- **Nunca hacer deploy a producción directamente** sin pasar el checklist
- **Usar preview deployments** para revisar cambios antes de mergear a main
- **El website es prioridad** — si hay un bug en producción del website, hacer rollback inmediato
- **No rotar keys en producción** sin coordinar con el equipo — puede tumbar el website
- **Mantener `pnpm-lock.yaml` commiteado** — garantiza builds reproducibles en Vercel
