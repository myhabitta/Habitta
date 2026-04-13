# Documentación de Pipelines — Habitta

Los pipelines son flujos de trabajo predefinidos que orquestan múltiples agentes en secuencia
para completar tareas recurrentes del proyecto. Cada pipeline define qué agentes activar,
en qué orden, qué skills usar y cuál es el resultado esperado de cada paso.

**Última validación:** 2026-03-11 — todos los skills y agentes referenciados verificados contra el sistema real.

---

## Cómo usar un pipeline

Indica a Claude el pipeline que quieres usar:

```
Usa el pipeline nueva-pagina-proyecto para crear /proyectos/medellin-laureles
```

Claude activará los agentes en el orden definido, esperando que cada uno termine
antes de pasar al siguiente. Si un paso falla, el pipeline se detiene y notifica.

---

## Pipelines disponibles (11 en total)

### Construcción de features

| Pipeline                                            | Archivo                      | Cuándo usarlo                                               |
| --------------------------------------------------- | ---------------------------- | ----------------------------------------------------------- |
| [Nueva página de proyecto](#nueva-pagina-proyecto)  | `nueva-pagina-proyecto.md`   | Crear `/proyectos/[slug]` en el website                     |
| [Nueva página de paquete](#nueva-pagina-paquete)    | `nueva-pagina-paquete.md`    | Crear `/proyectos/[slug]/[package]` en el website           |
| [Nuevo componente UI](#nuevo-componente-ui)         | `nuevo-componente-ui.md`     | Crear componente en `packages/ui`                           |
| [Nueva sección dashboard](#nueva-seccion-dashboard) | `nueva-seccion-dashboard.md` | Crear página/sección en `apps/dashboard`                    |
| [Nueva query en database](#nueva-query-database)    | `nueva-query-database.md`    | Agregar función de query a `@habitta/database` sin migración |
| [Proteger ruta con auth](#proteger-ruta-auth)       | `proteger-ruta-auth.md`      | Auth y protección de rutas del dashboard                    |

### Base de datos

| Pipeline                                              | Archivo                       | Cuándo usarlo                          |
| ----------------------------------------------------- | ----------------------------- | -------------------------------------- |
| [Nueva migración Supabase](#nueva-migracion-supabase) | `nueva-migracion-supabase.md` | Modificar schema (tabla, columna, RLS) |

### Calidad y deploy

| Pipeline                                      | Archivo                 | Cuándo usarlo                                  |
| --------------------------------------------- | ----------------------- | ---------------------------------------------- |
| [Subir cambios al repo](#subir-cambios-repo)  | `subir-cambios-repo.md` | Validar antes de cualquier git push            |
| [Deploy a producción](#deploy-produccion)     | `deploy-produccion.md`  | Deploy completo a Vercel con validación previa |
| [Auditoría del monorepo](#auditoria-monorepo) | `auditoria-monorepo.md` | Health check completo periódico                |

### SEO

| Pipeline                                          | Archivo                  | Cuándo usarlo                                      |
| ------------------------------------------------- | ------------------------ | -------------------------------------------------- |
| [Auditoría SEO del website](#auditar-seo-website) | `auditar-seo-website.md` | Auditar SEO técnico, contenido y visibilidad en AI |

---

## Detalle de cada pipeline

### nueva-pagina-proyecto

**Ruta:** `/proyectos/[slug]`
**Caso de uso:** Lanzar una nueva página pública para un proyecto inmobiliario.

| Paso | Agente                     | Skills                                                                                 | Resultado                                                  |
| ---- | -------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1    | `backend-supabase-agent`   | supabase-database, schema-design-skill                                                 | Datos del proyecto confirmados desde BD                    |
| 2    | `website-builder-agent`    | astro, seo-plan, seo-schema, tailwind-best-practices, frontend-design, ts-strict-skill | Página .astro con SEO completo (RealEstateListing JSON-LD) |
| 3    | `design-animation-agent`   | motion, frontend-design, tailwind-best-practices                                       | Animaciones de entrada en hero y cards                     |
| 4    | `typescript-auditor-agent` | ts-strict-skill, typescript-best-practices                                             | Cero errores TypeScript                                    |
| 5    | `linter-formatter-agent`   | eslint-prettier, prettier-skill                                                        | Código limpio y formateado                                 |

**Nota crítica:** Si el paso 1 falla (proyecto no existe en BD), el pipeline se detiene.

---

### nueva-pagina-paquete

**Ruta:** `/proyectos/[slug]/[package]`
**Caso de uso:** Crear la página de un paquete de acabados con formulario de lead.

| Paso | Agente                     | Skills                                                                                 | Resultado                                                |
| ---- | -------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1    | `backend-supabase-agent`   | supabase-database, schema-design-skill                                                 | Datos del paquete confirmados desde BD                   |
| 2    | `website-builder-agent`    | astro, seo-plan, seo-schema, tailwind-best-practices, frontend-design, ts-strict-skill | Página con galería, precio COP y formulario React Island |
| 3    | `design-animation-agent`   | motion, frontend-design, tailwind-best-practices                                       | Animaciones en galería y microinteracciones              |
| 4    | `typescript-auditor-agent` | ts-strict-skill, typescript-best-practices                                             | Tipos del formulario y createLead() validados            |
| 5    | `linter-formatter-agent`   | eslint-prettier, prettier-skill                                                        | Código listo para commit                                 |

**Nota crítica:** Formulario = React Island. Precio = `formatPrice()` de `@habitta/utils`. Lead = `createLead()` de `@habitta/database`.

---

### nuevo-componente-ui

**Ruta:** `packages/ui/src/NombreComponente.tsx`
**Caso de uso:** Crear un componente reutilizable entre website y dashboard.

| Paso | Agente                     | Skills                                                    | Resultado                                        |
| ---- | -------------------------- | --------------------------------------------------------- | ------------------------------------------------ |
| 1    | `ui-components-agent`      | frontend-design, tailwind-best-practices, ts-strict-skill | Componente creado y exportado desde `@habitta/ui` |
| 2    | `design-animation-agent`   | motion, frontend-design, tailwind-best-practices          | Estados hover/focus/active con tokens del tema   |
| 3    | `typescript-auditor-agent` | ts-strict-skill, typescript-best-practices                | Props tipadas con interface y exportadas         |
| 4    | `linter-formatter-agent`   | eslint-prettier, prettier-skill                           | Componente listo para cualquier app              |

**Nota crítica:** Nunca importar Supabase ni lógica de negocio dentro de `packages/ui`.

---

### nueva-seccion-dashboard

**Ruta:** `apps/dashboard/app/dashboard/[seccion]/page.tsx`
**Caso de uso:** Crear una nueva sección de gestión interna (leads, clients, projects).

| Paso | Agente                              | Skills                                                                       | Resultado                                       |
| ---- | ----------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| 1    | `backend-supabase-agent`            | supabase-database, schema-design-skill, supabase-postgres-best-practices     | Queries listas en `@habitta/database`            |
| 2    | `dashboard-builder-agent`           | next-best-practices, nextjs-shadcn, tailwind-best-practices, ts-strict-skill | Página funcional con shadcn/ui y auth protegida |
| 3    | `charts-metrics-agent` _(opcional)_ | nextjs-shadcn, ts-strict-skill                                               | Gráficas y métricas implementadas               |
| 4    | `typescript-auditor-agent`          | ts-strict-skill, typescript-best-practices                                   | Cero errores TypeScript                         |
| 5    | `linter-formatter-agent`            | eslint-prettier, prettier-skill                                              | Código consistente                              |

**Nota crítica:** `SUPABASE_SERVICE_ROLE_KEY` solo en Server Actions. Paso 3 es opcional si no hay visualizaciones.

---

### nueva-query-database

**Ruta:** `packages/database/src/queries/[entidad].ts`
**Caso de uso:** Agregar función de query sin cambiar el schema de BD.

| Paso | Agente                     | Skills                                                               | Resultado                                                 |
| ---- | -------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| 1    | `backend-supabase-agent`   | supabase-database, supabase-postgres-best-practices, ts-strict-skill | Query creada, tipada y exportada desde `@habitta/database` |
| 2    | `typescript-auditor-agent` | ts-strict-skill, typescript-best-practices                           | Tipos de retorno correctos y consistentes con schema      |
| 3    | `linter-formatter-agent`   | eslint-prettier, prettier-skill                                      | Código limpio listo para consumir                         |

**Nota crítica:** Si la query necesita un campo nuevo en BD → usar `nueva-migracion-supabase` en su lugar.

---

### proteger-ruta-auth

**Caso de uso:** Auth y protección de rutas del dashboard con Supabase Auth.

| Paso | Agente                     | Skills                                                             | Resultado                                              |
| ---- | -------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| 1    | `backend-supabase-agent`   | supabase-auth, schema-design-skill                                 | Auth configurado en Supabase con RLS correctas         |
| 2    | `dashboard-builder-agent`  | next-best-practices, nextjs-shadcn, supabase-auth, ts-strict-skill | Middleware + redirect a /login si no hay sesión        |
| 3    | `typescript-auditor-agent` | ts-strict-skill, typescript-best-practices                         | Tipos de sesión/user correctos, sin secretos expuestos |
| 4    | `linter-formatter-agent`   | eslint-prettier, prettier-skill                                    | Código de auth limpio                                  |

**Nota crítica:** Todas las rutas `/dashboard/*` requieren sesión. `SERVICE_ROLE_KEY` solo server-side.

---

### nueva-migracion-supabase

**Ruta:** `supabase/migrations/timestamp_descripcion.sql`
**Caso de uso:** Modificar el schema: nueva tabla, columna, relación o política RLS.

| Paso | Agente                     | Skills                                                                   | Resultado                                       |
| ---- | -------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------- |
| 1    | `backend-supabase-agent`   | schema-design-skill, supabase-database, supabase-postgres-best-practices | Archivo .sql de migración creado y aplicado     |
| 2    | `typescript-auditor-agent` | ts-strict-skill, typescript-best-practices                               | Tipos en `packages/types/` sincronizados con BD |
| 3    | `linter-formatter-agent`   | prettier-skill, eslint-prettier                                          | Archivos de tipos formateados                   |

**Nota crítica:** Nunca editar tablas en producción directamente. Siempre: `supabase migration new nombre`.

---

### subir-cambios-repo

**Caso de uso:** Validar que todo está en orden antes de un `git push`.

| Paso | Agente                     | Skills                                     | Resultado                                   |
| ---- | -------------------------- | ------------------------------------------ | ------------------------------------------- |
| 1    | `typescript-auditor-agent` | ts-strict-skill, typescript-best-practices | Cero errores TypeScript en el monorepo      |
| 2    | `linter-formatter-agent`   | eslint-prettier, prettier-skill            | Cero errores de lint y formato              |
| 3    | `deploy-guard-agent`       | build-check                                | Tests en verde, build exitoso, sin secretos |

**Nota crítica:** Obligatorio antes de push a `main`. Nunca usar `--no-verify`.

---

### deploy-produccion

**Caso de uso:** Deploy completo a producción en Vercel con validación previa.

| Paso | Agente                     | Skills                                     | Resultado                                        |
| ---- | -------------------------- | ------------------------------------------ | ------------------------------------------------ |
| 1    | `typescript-auditor-agent` | ts-strict-skill, typescript-best-practices | Cero errores TypeScript → STOP si falla          |
| 2    | `linter-formatter-agent`   | eslint-prettier, prettier-skill            | Cero errores de lint → STOP si falla             |
| 3    | `deploy-guard-agent`       | build-check                                | Tests verdes + build exitoso → STOP si falla     |
| 4    | `deploy-guard-agent`       | vercel                                     | Deploy ejecutado en Vercel con URL de producción |
| 5    | `deploy-guard-agent`       | vercel                                     | Verificación post-deploy de páginas críticas     |

**Nota crítica:** Si cualquier paso 1-3 falla, NO continuar con el deploy. Usar `vercel rollback` si post-deploy falla.

---

### auditoria-monorepo

**Caso de uso:** Health check completo del codebase (quincenal o antes de lanzamientos).

| Paso           | Agente                     | Skills                                                                   | Resultado                                             |
| -------------- | -------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------- |
| 1              | `typescript-auditor-agent` | ts-strict-skill, typescript-best-practices                               | Reporte de problemas de tipos por severidad           |
| 2 _(paralelo)_ | `linter-formatter-agent`   | eslint-prettier, prettier-skill                                          | Reporte de issues de calidad de código                |
| 3              | `website-builder-agent`    | vercel-react-best-practices, web-design-guidelines, astro                | Reporte de performance y buenas prácticas del website |
| 4              | `deploy-guard-agent`       | build-check                                                              | Estado de build y tests del monorepo                  |
| 5              | `backend-supabase-agent`   | supabase-postgres-best-practices, schema-design-skill, supabase-database | Reporte de salud de BD y queries                      |

**Nota crítica:** Solo produce reportes, no modifica código. Pasos 1 y 2 pueden correr en paralelo.

---

### auditar-seo-website

**Caso de uso:** Auditar SEO del website antes de un lanzamiento o cuando el tráfico no crece.

| Paso           | Agente                  | Skills                                                      | Resultado                                                         |
| -------------- | ----------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| 1              | `website-builder-agent` | seo-audit, seo-schema, astro                                | Reporte técnico SEO con issues por impacto                        |
| 2              | `website-builder-agent` | seo-content, seo-plan                                       | Reporte de calidad de contenido y E-E-A-T                         |
| 3              | `website-builder-agent` | seo-geo, seo-schema                                         | Reporte de visibilidad en AI search (Google, ChatGPT, Perplexity) |
| 4 _(opcional)_ | `website-builder-agent` | seo-schema, astro, tailwind-best-practices, ts-strict-skill | Correcciones críticas aplicadas (requiere aprobación)             |

**Nota crítica:** Paso 4 es opcional y requiere aprobación del usuario. Correr mensualmente.

---

## Mapa de skills por pipeline

| Skill                              | Pipelines que lo usan                                                                                                                    |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `astro`                            | nueva-pagina-proyecto, nueva-pagina-paquete, auditar-seo-website, auditoria-monorepo                                                     |
| `build-check`                      | subir-cambios-repo, deploy-produccion, auditoria-monorepo                                                                                |
| `eslint-prettier`                  | todos los pipelines                                                                                                                      |
| `frontend-design`                  | nueva-pagina-proyecto, nueva-pagina-paquete, nuevo-componente-ui                                                                         |
| `motion`                           | nueva-pagina-proyecto, nueva-pagina-paquete, nuevo-componente-ui                                                                         |
| `next-best-practices`              | nueva-seccion-dashboard, proteger-ruta-auth                                                                                              |
| `nextjs-shadcn`                    | nueva-seccion-dashboard, proteger-ruta-auth                                                                                              |
| `prettier-skill`                   | todos los pipelines                                                                                                                      |
| `schema-design-skill`              | nueva-pagina-proyecto, nueva-pagina-paquete, nueva-seccion-dashboard, nueva-migracion-supabase, proteger-ruta-auth, auditoria-monorepo   |
| `seo-audit`                        | auditar-seo-website                                                                                                                      |
| `seo-content`                      | auditar-seo-website                                                                                                                      |
| `seo-geo`                          | auditar-seo-website                                                                                                                      |
| `seo-plan`                         | nueva-pagina-proyecto, nueva-pagina-paquete, auditar-seo-website                                                                         |
| `seo-schema`                       | nueva-pagina-proyecto, nueva-pagina-paquete, auditar-seo-website                                                                         |
| `supabase-auth`                    | proteger-ruta-auth                                                                                                                       |
| `supabase-database`                | nueva-pagina-proyecto, nueva-pagina-paquete, nueva-seccion-dashboard, nueva-migracion-supabase, nueva-query-database, auditoria-monorepo |
| `supabase-postgres-best-practices` | nueva-seccion-dashboard, nueva-migracion-supabase, nueva-query-database, auditoria-monorepo                                              |
| `tailwind-best-practices`          | nueva-pagina-proyecto, nueva-pagina-paquete, nuevo-componente-ui, nueva-seccion-dashboard                                                |
| `ts-strict-skill`                  | todos los pipelines                                                                                                                      |
| `typescript-best-practices`        | todos los pipelines                                                                                                                      |
| `vercel`                           | deploy-produccion                                                                                                                        |
| `vercel-react-best-practices`      | auditoria-monorepo                                                                                                                       |
| `web-design-guidelines`            | auditoria-monorepo                                                                                                                       |

---

## Agentes del sistema

| Agente                     | Dominio                               | Skills base obligatorios (CLAUDE.md)                                     |
| -------------------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| `website-builder-agent`    | Website público (Astro)               | astro, frontend-design, tailwind-best-practices, ts-strict-skill         |
| `dashboard-builder-agent`  | Dashboard interno (Next.js)           | next-best-practices, nextjs-shadcn, ts-strict-skill                      |
| `ui-components-agent`      | Componentes compartidos (packages/ui) | frontend-design, tailwind-best-practices, ts-strict-skill                |
| `design-animation-agent`   | Animaciones y diseño visual           | motion, frontend-design, tailwind-best-practices                         |
| `backend-supabase-agent`   | Base de datos, queries, schema        | supabase-database, schema-design-skill, supabase-postgres-best-practices |
| `typescript-auditor-agent` | TypeScript estricto                   | ts-strict-skill, typescript-best-practices                               |
| `linter-formatter-agent`   | ESLint y Prettier                     | eslint-prettier, prettier-skill                                          |
| `deploy-guard-agent`       | Build, tests y deploy                 | build-check, vercel                                                      |
| `charts-metrics-agent`     | Gráficas y métricas (dashboard)       | nextjs-shadcn, ts-strict-skill                                           |

---

## Flujos de delegación entre agentes

```
website-builder ──necesita query compleja──→ backend-supabase
website-builder ──componente reutilizable──→ ui-components
website-builder ──animación compleja──────→ design-animation

dashboard-builder ──necesita query compleja──→ backend-supabase
dashboard-builder ──visualización de datos──→ charts-metrics
dashboard-builder ──componente reutilizable──→ ui-components

backend-supabase ──tipos regenerados/errores──→ typescript-auditor

charts-metrics ──necesita query de métricas──→ backend-supabase
charts-metrics ──errores de tipos en datos──→ typescript-auditor

linter-formatter ──errores de tipos complejos──→ typescript-auditor
deploy-guard ────────TypeScript falla──────→ typescript-auditor
deploy-guard ───────────lint falla─────────→ linter-formatter
```

---

## Tareas mapeadas por pipeline

### nueva-pagina-proyecto

- "Crea la página del proyecto more-bello"
- "Agrega /proyectos/laureles-medellin al website"
- "Necesito la página pública de un nuevo proyecto inmobiliario"

### nueva-pagina-paquete

- "Crea la página del paquete premium de bello-antioquia"
- "Agrega /proyectos/[slug]/paquete-estandar con formulario de contacto"
- "El cliente quiere ver los acabados del paquete básico online"

### nuevo-componente-ui

- "Crea un componente Testimonial para usar en website y dashboard"
- "Necesito un Badge con variantes para los estados de un lead"
- "Agrega un componente ImageGallery a packages/ui"

### nueva-seccion-dashboard

- "Crea la vista de gestión de clientes en el dashboard"
- "Agrega una sección de proyectos con tabla y filtros"
- "Necesito ver y gestionar los leads desde el dashboard"

### nueva-query-database

- "Agrega getLeadsByProject(projectSlug) al database package"
- "Necesito una query que traiga los leads de esta semana"
- "Crea la función updateLeadStatus en @habitta/database"

### proteger-ruta-auth

- "Protege la ruta /dashboard/admin con autenticación"
- "Implementa el login para el equipo de Habitta"
- "Configura Supabase Auth para el dashboard"

### nueva-migracion-supabase

- "Agrega el campo 'presupuesto' a la tabla leads"
- "Crea la tabla de notificaciones con RLS"
- "Modifica la relación entre projects y packages"

### subir-cambios-repo

- "Quiero hacer push de estos cambios"
- "Valida que todo está bien antes del commit"
- "Prepara el código para subir a main"

### deploy-produccion

- "Haz deploy del website a producción"
- "Sube los cambios del dashboard a Vercel"
- "Deploy completo del monorepo"

### auditoria-monorepo

- "Revisa el estado del código del proyecto"
- "Auditoria de deuda técnica"
- "Health check antes del próximo sprint"

### auditar-seo-website

- "Audita el SEO del website"
- "Por qué no estamos rankeando en Google"
- "Revisa los meta tags y schema de las páginas de proyectos"
- "Optimiza el website para AI search"
