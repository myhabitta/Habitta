# Website — Visión general

Sitio público de Habitta orientado a compradores potenciales.

**Framework:** Astro + React Islands
**Puerto dev:** 4321
**Deploy:** Vercel

---

## ¿Qué hace?

Muestra el catálogo de proyectos y paquetes de acabados de Habitta, y captura leads a través de un formulario de contacto.

---

## Rutas principales

| Ruta                          | Qué muestra                                               |
| ----------------------------- | --------------------------------------------------------- |
| `/`                           | Landing principal                                         |
| `/proyectos`                  | Catálogo de proyectos disponibles                         |
| `/proyectos/[slug]`           | Detalle de un proyecto (ej: `/proyectos/bello-antioquia`) |
| `/proyectos/[slug]/[package]` | Detalle de un paquete con formulario de lead              |

---

## Prioridades técnicas

1. **SEO** — cada página tiene metadata, Open Graph y JSON-LD (Schema.org)
2. **Velocidad** — Astro genera HTML estático, mínimo JS al navegador
3. **Conversión** — el formulario de contacto debe ser claro y funcional

---

## Documentos relacionados

- `structure.md` → cómo está organizado el código _(por crear)_
- `seo.md` → estrategia SEO del website _(por crear)_
- `lead-form.md` → cómo funciona el formulario de captación _(por crear)_
