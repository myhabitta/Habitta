# Pipeline: subir-cambios-repo

## Cuándo usarlo

Antes de hacer git push a cualquier rama.
Este pipeline garantiza que nada roto llega al repositorio.

## Tarea para el orquestador

Ejecuta los siguientes agentes en este orden exacto.
Si algún paso falla, detener el pipeline y notificar antes de continuar.

---

## Paso 1 — typescript-auditor-agent

**Qué hace:** Corre `tsc --noEmit` en todo el monorepo.
Verifica que no haya errores de TypeScript sin corregir.

Comando:

```bash
pnpm -r exec tsc --noEmit
```

Skills que usa:

- ts-strict-skill
- typescript-best-practices

Resultado esperado: cero errores de TypeScript. Si hay errores, detener.

---

## Paso 2 — linter-formatter-agent

**Qué hace:** Corre `pnpm lint` y `pnpm format:check` en todo el monorepo.
Verifica formato y cero warnings de ESLint.

Comandos:

```bash
pnpm lint
pnpm format:check
```

Skills que usa:

- eslint-prettier
- prettier-skill

Resultado esperado: cero errores de lint. Si hay errores, detener.

---

## Paso 3 — deploy-guard-agent

**Qué hace:** Corre `pnpm test` para verificar que todos los tests pasen.
Corre `pnpm build` para verificar que ambas apps compilan sin errores.
Verifica que no haya variables de entorno sensibles expuestas.

Comandos:

```bash
pnpm test
pnpm build
```

Skills que usa:

- build-check

Resultado esperado: tests en verde, build exitoso, sin secretos expuestos.

---

## Notas

- Este pipeline debe correr SIEMPRE antes de un push a main.
- Para ramas de desarrollo puede omitirse el paso 3 si es trabajo WIP.
- Formato de commits convencional:
  ```
  feat(website): agrega página de proyecto more-bello
  fix(dashboard): corrige query de leads
  chore(types): sincroniza tipos con nueva migración
  refactor(ui): extrae componente Card a packages/ui
  ```
- Nunca usar --no-verify para saltarse los hooks.
- La SUPABASE_SERVICE_ROLE_KEY nunca debe aparecer en el diff.
