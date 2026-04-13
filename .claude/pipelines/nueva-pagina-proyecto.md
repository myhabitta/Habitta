# Pipeline: nueva-pagina-proyecto

## Cuándo usarlo

Cuando se necesite crear una nueva página de proyecto inmobiliario
en el website público. Ruta: /proyectos/[slug]

## Tarea para el orquestador

Ejecuta los siguientes agentes en este orden exacto.
Espera que cada uno termine antes de pasar al siguiente.

---

## Paso 1 — backend-supabase-agent

**Qué hace:** Verifica que el proyecto existe en la base de datos
y obtiene sus datos (nombre, slug, descripción, paquetes disponibles).

Skills que usa:

- supabase-database
- schema-design-skill

Resultado esperado: datos del proyecto confirmados y disponibles.

---

## Paso 2 — website-builder-agent

**Qué hace:** Crea la página .astro en apps/website/src/pages/proyectos/[slug]/index.astro
con los datos del proyecto. Usa BaseLayout. Aplica HTML semántico y SEO completo
(meta title, meta description, og:image, schema JSON-LD de RealEstateListing).

Skills que usa:

- astro
- seo-plan
- seo-schema
- tailwind-best-practices
- frontend-design
- ts-strict-skill

Resultado esperado: página .astro creada con SEO completo y diseño base.

---

## Paso 3 — design-animation-agent

**Qué hace:** Agrega animaciones de entrada a las secciones principales
de la página (hero, galería, cards de paquetes).

Skills que usa:

- motion
- frontend-design
- tailwind-best-practices

Resultado esperado: animaciones aplicadas, sin afectar el HTML semántico.

---

## Paso 4 — typescript-auditor-agent

**Qué hace:** Valida que todos los tipos usados en la página sean correctos,
que no haya uso de any, y que los tipos vengan de @habitta/types.

Skills que usa:

- ts-strict-skill
- typescript-best-practices

Resultado esperado: cero errores de TypeScript en la página creada.

---

## Paso 5 — linter-formatter-agent

**Qué hace:** Corre ESLint y Prettier sobre el archivo creado.
Verifica el orden correcto de imports.

Skills que usa:

- eslint-prettier
- prettier-skill

Resultado esperado: código formateado y sin warnings de linting.

---

## Notas

- Si el paso 1 falla (proyecto no existe en BD), detener el pipeline
  y notificar al usuario antes de continuar.
- El slug de la página debe coincidir exactamente con el slug en BD.
- Ejemplo de ruta: /proyectos/bello-antioquia
