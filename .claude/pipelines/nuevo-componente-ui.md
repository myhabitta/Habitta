# Pipeline: nuevo-componente-ui

## Cuándo usarlo

Cuando se necesite crear un nuevo componente en packages/ui
que será usado tanto en website como en dashboard.

## Tarea para el orquestador

Ejecuta los siguientes agentes en este orden exacto.

---

## Paso 1 — ui-components-agent

**Qué hace:** Crea el componente en packages/ui/src/NombreComponente.tsx.
Props tipadas con interface en el mismo archivo.
Agnóstico de lógica de negocio, solo recibe props.
Lo exporta desde packages/ui/src/index.ts.

Skills que usa:

- frontend-design
- tailwind-best-practices
- ts-strict-skill

Resultado esperado: componente creado, exportado y accesible desde @habitta/ui.

---

## Paso 2 — design-animation-agent

**Qué hace:** Si el componente necesita estados visuales (hover, focus, active)
o animaciones, los aplica respetando el design system de Habitta.
Usa tokens del tema: bg-surface, text-ink, text-brand-primary, etc.

Skills que usa:

- motion
- frontend-design
- tailwind-best-practices

Resultado esperado: estados visuales aplicados correctamente con los tokens del tema.

---

## Paso 3 — typescript-auditor-agent

**Qué hace:** Valida que las props estén correctamente tipadas con interface,
que no haya any, y que el componente exporte sus tipos si es necesario.

Skills que usa:

- ts-strict-skill
- typescript-best-practices

Resultado esperado: tipos correctos y exportados desde el componente.

---

## Paso 4 — linter-formatter-agent

**Qué hace:** Formatea el componente y valida imports.

Skills que usa:

- eslint-prettier
- prettier-skill

Resultado esperado: componente listo para ser importado en cualquier app.

---

## Notas

- Un componente por archivo, siempre.
- Archivo en PascalCase: NombreComponente.tsx
- Nunca importar @supabase/supabase-js dentro de packages/ui.
- Nunca importar lógica de negocio de Habitta dentro de packages/ui.
- Componentes actuales: Button, Card, Container, Section, Badge, Modal
