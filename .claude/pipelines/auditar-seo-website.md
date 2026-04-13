# Pipeline: auditar-seo-website

## Cuándo usarlo

Cuando se necesite auditar el SEO del website público:
antes de un lanzamiento, después de agregar varias páginas nuevas,
o cuando el tráfico orgánico cae o no crece como se espera.

## Tarea para el orquestador

Ejecuta los siguientes agentes en este orden exacto.
Este pipeline es de análisis — produce un reporte de hallazgos y recomendaciones.
No modifica código por defecto; solo si el usuario lo aprueba después del reporte.

---

## Paso 1 — website-builder-agent

**Qué hace:** Auditoría técnica SEO completa del website.
Revisa meta tags, schema JSON-LD, sitemap, robots.txt, canonical URLs,
estructura de headings (H1/H2/H3), og:image, y rendimiento de carga.

Skills que usa:

- seo-audit
- seo-schema
- astro

Resultado esperado: reporte técnico con lista de issues ordenados por impacto.

---

## Paso 2 — website-builder-agent

**Qué hace:** Auditoría de contenido y calidad E-E-A-T.
Evalúa thin content, legibilidad, densidad de keywords, y si el contenido
de cada página responde claramente a la intención de búsqueda del usuario.

Skills que usa:

- seo-content
- seo-plan

Resultado esperado: reporte de calidad de contenido por página con recomendaciones.

---

## Paso 3 — website-builder-agent

**Qué hace:** Optimización para AI Search (Google AI Overviews, ChatGPT, Perplexity).
Evalúa si Habitta aparece como fuente citada en búsquedas de IA sobre proyectos
inmobiliarios en Colombia, y qué ajustes hacer para mejorar visibilidad.

Skills que usa:

- seo-geo
- seo-schema

Resultado esperado: reporte de visibilidad en AI search con acciones concretas.

---

## Paso 4 — website-builder-agent (solo si hay fixes inmediatos)

**Qué hace:** Aplica correcciones de alta prioridad identificadas en pasos anteriores:
meta tags faltantes, schema JSON-LD incorrecto, headings mal estructurados.
Solo actúa si el usuario aprueba los hallazgos del reporte.

Skills que usa:

- seo-schema
- astro
- tailwind-best-practices
- ts-strict-skill

Resultado esperado: issues críticos corregidos en el código.

---

## Notas

- Correr este pipeline completo 1 vez al mes o antes de cada lanzamiento importante.
- El paso 4 es opcional y requiere aprobación explícita del usuario.
- Las páginas con mayor prioridad de auditar: /, /proyectos, /proyectos/[slug]
- Si se detectan problemas de contenido, activar manualmente el diseño-animacion pipeline
  para mejorar la experiencia visual que impacta el bounce rate.
