# Tooling — Configuración de herramientas

Configuración base de TypeScript, Prettier y ESLint para todo el monorepo.

---

## TypeScript

**Archivo:** `tsconfig.base.json` en la raíz

Todas las apps y paquetes extienden este archivo base:

```json
// En cada app/package:
{ "extends": "../../tsconfig.base.json" }
```

Configuración destacada:

- `strict: true` — obligatorio en todo el proyecto
- `target: ES2022` — sintaxis moderna
- `module: ESNext` — imports nativos
- No usar `any` — usar `unknown` si el tipo es incierto

---

## Prettier

**Archivo:** `.prettierrc` en la raíz (aplica a todo el monorepo)

Plugins instalados:

- `prettier-plugin-astro` → formatea archivos `.astro` del website
- `prettier-plugin-tailwindcss` → ordena clases de Tailwind automáticamente

Configuración:

- Comillas simples
- Punto y coma al final
- 100 caracteres por línea
- Trailing comma en ES5

```bash
pnpm format           # Formatea todo
pnpm format:check     # Verifica sin escribir (útil en CI)
```

---

## ESLint

**Archivo:** `.eslintrc.js` en la raíz

Tiene overrides por contexto:

- `apps/dashboard/**` → reglas de React + Next.js
- `apps/website/**/*.astro` → parser de Astro
- `packages/**` → reglas más estrictas (no console.log)

Reglas clave:

- `@typescript-eslint/no-explicit-any: error` → prohibido usar `any`
- `import/order` → imports ordenados automáticamente
- `@typescript-eslint/consistent-type-imports` → siempre `import type` para tipos

---

## Variables de entorno

Cada app tiene su `.env.example` como referencia:

**Website:**

```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
```

**Dashboard:**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   ← NUNCA exponer al cliente
```
