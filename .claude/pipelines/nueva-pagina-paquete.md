# Pipeline: nueva-pagina-paquete

## Cuándo usarlo

Cuando se necesite crear la página de un paquete de acabados específico.
Ruta: /proyectos/[slug]/[package]

## Principio de este pipeline

**Construir UI y conectar datos son tareas separadas.**
La página se construye primero con datos dummy o Content Collections.
La conexión con Supabase es una tarea posterior e independiente.
No se necesita backend funcionando para tener una página lista y visual.

## Tarea para el orquestador

Ejecuta los siguientes agentes en este orden exacto.

---

## Paso 1 — website-builder-agent

**Qué hace:** Crea la página .astro en /proyectos/[slug]/[package].astro.
Usa datos dummy o un Content Collection local (.md / .json en src/content/).
No depende de Supabase para construir ni renderizar la página.

Estructura de datos que usa (dummy o colección local):

```typescript
// Ejemplo de shape esperada — puede venir de Content Collection o props
{
  nombre: "Paquete Premium",
  precio: 45000000,
  descripcion: "Acabados de alta gama...",
  caracteristicas: ["Piso porcelanato", "Cocina integral", "..."],
  imagenes: ["/assets/paquete-premium-1.jpg", "..."]
}
```

Incluye: galería de acabados, precio formateado en COP con formatPrice() de @habitta/utils,
descripción, formulario de contacto (React Island) con estado local (no conectado a BD aún).
SEO completo con schema de Product en JSON-LD usando los datos dummy.

Skills que usa:

- astro
- seo-plan
- seo-schema
- tailwind-best-practices
- frontend-design
- ts-strict-skill

Resultado esperado: página visualmente completa, navegable y con SEO.
Los datos son dummy o de colección local. El formulario tiene UI pero aún no persiste leads.

---

## Paso 2 — design-animation-agent

**Qué hace:** Aplica animaciones a la galería de imágenes y
microinteracciones al formulario de contacto.

Skills que usa:

- motion
- frontend-design
- tailwind-best-practices

Resultado esperado: experiencia visual pulida, independiente de la fuente de datos.

---

## Paso 3 — typescript-auditor-agent

**Qué hace:** Valida que los tipos de los datos (aunque sean dummy) estén
correctamente definidos y vengan de @habitta/types.
Prepara los tipos para que cuando llegue la conexión real con Supabase,
el contrato de datos ya esté definido.

Skills que usa:

- ts-strict-skill
- typescript-best-practices

Resultado esperado: tipos definidos y listos para la futura conexión con BD.

---

## Paso 4 — linter-formatter-agent

**Qué hace:** Formatea y valida el código generado.

Skills que usa:

- eslint-prettier
- prettier-skill

Resultado esperado: código limpio listo para commit.

---

## Paso 5 (posterior, separado) — conectar datos reales

**Cuándo:** Solo cuando la UI esté aprobada y se quiera conectar con Supabase.

Activar por separado:

- Pipeline `nueva-query-database` → para crear getPackageBySlug() en @habitta/database
- O pipeline `nueva-migracion-supabase` → si el schema necesita cambios primero
- Luego llamar `backend-supabase-agent` para reemplazar los datos dummy por la query real

---

## Notas

- El formulario de contacto es React Island (.tsx con client:load), no componente .astro.
- El precio siempre se formatea con formatPrice() de @habitta/utils, incluso con datos dummy.
- createLead() de @habitta/database se conecta en el paso 5, no antes.
- Ejemplo de ruta: /proyectos/bello-antioquia/paquete-premium
- Si los datos del paquete son estáticos y no cambian frecuentemente → Content Collections
  es la solución permanente, no solo temporal. No siempre es necesario conectar Supabase.
