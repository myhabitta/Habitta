---
name: prettier-skill
description: Prettier formatting configuration and rules for the Habitta monorepo. Use when setting up Prettier, fixing formatting errors, configuring .prettierrc, handling Astro file formatting, or running format checks across the monorepo.
license: MIT
metadata:
  authors: 'Habitta Team'
  version: '1.0.0'
---

# Prettier — Habitta Monorepo

Guía de configuración y uso de Prettier en el monorepo Habitta.

---

## Comandos

```bash
# Formatear todo el monorepo
pnpm format

# Verificar formato sin modificar archivos (CI)
pnpm format:check

# Formatear un archivo específico
npx prettier --write apps/website/src/components/Hero.astro

# Formatear solo un directorio
npx prettier --write apps/website/src/
npx prettier --write packages/ui/src/
```

Scope de archivos formateados: `**/*.{ts,tsx,astro,json,md}`

---

## Configuración `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

### Reglas clave

| Regla           | Valor   | Por qué                                    |
| --------------- | ------- | ------------------------------------------ |
| `semi`          | `true`  | Punto y coma siempre                       |
| `singleQuote`   | `true`  | Comillas simples en JS/TS                  |
| `tabWidth`      | `2`     | 2 espacios                                 |
| `trailingComma` | `"es5"` | Coma final en objetos y arrays multi-línea |
| `printWidth`    | `100`   | Líneas hasta 100 caracteres                |

---

## Plugin para Astro

El plugin `prettier-plugin-astro` es obligatorio para formatear archivos `.astro`.

```bash
# Instalar en el monorepo raíz o en el website
pnpm add -D prettier prettier-plugin-astro
```

Sin este plugin, Prettier no sabe parsear el frontmatter `---` de Astro y falla.

---

## `.prettierignore`

```
node_modules/
dist/
.next/
.astro/
pnpm-lock.yaml
*.min.js
```

---

## Integración con ESLint

Prettier y ESLint coexisten sin conflicto en Habitta:

- **ESLint** → reglas de calidad de código (tipos, imports, etc.)
- **Prettier** → formato visual (spacing, comillas, etc.)

No usar `eslint-plugin-prettier` — correr cada herramienta por separado evita conflictos.

```bash
# Orden correcto antes de commit:
pnpm lint          # ESLint primero
pnpm format        # Prettier después
```

---

## Errores comunes

### Error: archivo `.astro` no formateado

```
[error] No parser could be inferred for file: src/components/Hero.astro
```

**Solución:** instalar `prettier-plugin-astro` y agregarlo al `.prettierrc`.

### Error: conflicto entre comillas

```
Replace `"texto"` with `'texto'`
```

**Solución:** el archivo usa comillas dobles. Correr `pnpm format` para que Prettier las normalice a simples.

### Error: línea demasiado larga

```
Replace ... with ...  (printWidth: 100)
```

**Solución:** romper la línea manualmente o dejar que `pnpm format` lo haga automáticamente.

### Error en CI — formato incorrecto

```bash
# El check falla en CI:
pnpm format:check

# Correr localmente para ver qué archivos fallan:
npx prettier --check "**/*.{ts,tsx,astro,json,md}"

# Aplicar y commitear:
pnpm format
git add -A
git commit -m "style: apply prettier formatting"
```
