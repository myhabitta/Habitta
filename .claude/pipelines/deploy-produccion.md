# Pipeline: deploy-produccion

## Cuándo usarlo

Cuando se necesite hacer deploy a producción en Vercel.
Aplica tanto para website como para dashboard.
Este pipeline garantiza que el código esté limpio ANTES de deployar.

## Tarea para el orquestador

Ejecuta los siguientes agentes en este orden exacto.
Si algún paso falla, DETENER INMEDIATAMENTE y no continuar con el deploy.

---

## Paso 1 — typescript-auditor-agent

**Qué hace:** Valida TypeScript en todo el monorepo antes de deployar.
Cero tolerancia a errores de tipos en producción.

Comando:

```bash
pnpm -r exec tsc --noEmit
```

Skills que usa:

- ts-strict-skill
- typescript-best-practices

Resultado esperado: cero errores TypeScript. Si falla → STOP.

---

## Paso 2 — linter-formatter-agent

**Qué hace:** Verifica que el código esté limpio de errores de lint y formato.

Comandos:

```bash
pnpm lint
pnpm format:check
```

Skills que usa:

- eslint-prettier
- prettier-skill

Resultado esperado: cero errores de lint. Si falla → STOP.

---

## Paso 3 — deploy-guard-agent

**Qué hace:** Corre tests y build completo del monorepo.
Verifica variables de entorno requeridas.
Verifica que SUPABASE_SERVICE_ROLE_KEY no esté expuesta en el cliente.

Comandos:

```bash
pnpm test
pnpm build
```

Skills que usa:

- build-check

Resultado esperado: tests en verde, build exitoso. Si falla → STOP.

---

## Paso 4 — deploy-guard-agent

**Qué hace:** Ejecuta el deploy a producción en Vercel.
Para website: `vercel --prod --filter website`
Para dashboard: `vercel --prod --filter dashboard`
Para ambas apps: ejecutar en secuencia.
Monitorea el deploy y verifica que no haya errores en los logs post-deploy.

Skills que usa:

- vercel

Resultado esperado: deploy exitoso en Vercel con URL de producción confirmada.

---

## Paso 5 — deploy-guard-agent (post-deploy)

**Qué hace:** Verificación post-deploy.
Abre la URL de producción y verifica que las páginas críticas respondan correctamente:

- Website: /, /proyectos, una página de proyecto
- Dashboard: /dashboard/leads

Skills que usa:

- vercel

Resultado esperado: sitio en producción funcionando correctamente.

---

## Notas

- Nunca hacer deploy directamente a main sin pasar por los pasos 1-3.
- Si el deploy falla en Vercel, usar `vercel rollback` inmediatamente.
- Variables de entorno requeridas en Vercel:
  - Website: PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY
  - Dashboard: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- Nunca commitear variables de entorno al repositorio.
