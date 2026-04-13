# Pipeline: auditoria-monorepo

## Cuándo usarlo

Health check completo del monorepo Habitta.
Correr periódicamente (quincenal o mensual), antes de un lanzamiento importante,
o cuando se siente que el código acumuló deuda técnica.

## Tarea para el orquestador

Ejecuta los siguientes agentes. Algunos pueden correr en paralelo (indicado).
Genera un reporte consolidado de hallazgos al final.

---

## Paso 1 — typescript-auditor-agent

**Qué hace:** Auditoría completa de TypeScript en todo el monorepo.
Busca: uso de any, tipos faltantes en props, tipos no sincronizados con Supabase,
tsconfig sin strict:true, imports desde rutas relativas largas en vez de aliases.

Comando:

```bash
pnpm -r exec tsc --noEmit
```

Skills que usa:

- ts-strict-skill
- typescript-best-practices

Resultado esperado: reporte de problemas de tipos ordenados por severidad.

---

## Paso 2 — linter-formatter-agent (puede correr en paralelo con paso 1)

**Qué hace:** Auditoría de calidad de código en todo el monorepo.
Busca: errores ESLint, imports desordenados, código muerto, variables sin usar,
archivos sin formatear con Prettier.

Comandos:

```bash
pnpm lint
pnpm format:check
```

Skills que usa:

- eslint-prettier
- prettier-skill

Resultado esperado: reporte de issues de calidad con conteo por app/package.

---

## Paso 3 — website-builder-agent

**Qué hace:** Auditoría de rendimiento y buenas prácticas del website.
Revisa: imágenes sin optimizar, componentes React donde debería haber .astro,
React Islands con client:load cuando client:visible sería mejor,
Web Vitals y oportunidades de mejora de LCP/CLS/FID.

Skills que usa:

- vercel-react-best-practices
- web-design-guidelines
- astro

Resultado esperado: reporte de performance del website con quick wins identificados.

---

## Paso 4 — deploy-guard-agent

**Qué hace:** Verifica el estado de build y tests del monorepo completo.
Confirma que ambas apps (website y dashboard) compilan sin errores ni warnings.

Comandos:

```bash
pnpm test
pnpm build
```

Skills que usa:

- build-check

Resultado esperado: estado de salud de build y tests con lista de fallos si los hay.

---

## Paso 5 — backend-supabase-agent

**Qué hace:** Auditoría de la capa de datos.
Revisa: queries sin índices, políticas RLS faltantes o incorrectas,
tipos en packages/types/ desincronizados con el schema real de Supabase,
queries lentas o N+1 queries en el código.

Skills que usa:

- supabase-postgres-best-practices
- schema-design-skill
- supabase-database

Resultado esperado: reporte de salud de la base de datos y queries.

---

## Notas

- Los pasos 1 y 2 pueden ejecutarse en paralelo ya que son independientes.
- Este pipeline produce reportes, no hace cambios automáticamente.
- Para cada hallazgo crítico, activar el pipeline o agente especializado correspondiente.
- Guardar el reporte en docs/ para comparar contra auditorías futuras.
- Frecuencia recomendada: cada 2 semanas o antes de un sprint de lanzamiento.
