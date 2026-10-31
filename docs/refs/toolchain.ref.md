# Toolchain — Reference

> **Design reference.** What dgtest is built and checked with: who installs, who builds, where
> configuration comes from, and the gates every change passes. There is no `.flow.md`: each command
> is one tool invoked once, with nothing to sequence.

---

## Overview

**bun manages packages and runs scripts; Nuxt builds and serves.** Nuxt 4 compiles `app/` with Vite
for the browser and `server/` with Nitro for the server; `shared/` is compiled into both.

| Concern | Tool | Where it is set |
|---------|------|-----------------|
| Installing dependencies | bun | `package.json`, `bun.lock` |
| Dev server, build, typecheck | Nuxt (`nuxt` CLI) | `nuxt.config.ts`, generated `.nuxt/tsconfig.*.json` |
| Styling | Tailwind v4 via `@tailwindcss/vite` | `nuxt.config.ts` (`vite.plugins`), `app/assets/css/main.css` |
| UI primitives | Neo-Brutalism UI snippets, copied | `app/components/ui/` |
| Lint and format | `@nuxt/eslint` (flat config, stylistic) | `nuxt.config.ts` (`eslint.config`), `eslint.config.mjs` |
| The 150-line limit | a bun script | `scripts/checkLineLimit.ts` |
| Environment | Nuxt `runtimeConfig` + `NUXT_*` vars | `nuxt.config.ts`, `.env` (gitignored), `.env.example` |

---

## Files

| File | Owns |
|------|------|
| `package.json` | The one dependency manifest, and the scripts every command goes through |
| `bun.lock` | Exact versions; committed |
| `nuxt.config.ts` | Modules, Tailwind plugin, global CSS, `runtimeConfig` keys, stylistic rules |
| `eslint.config.mjs` | Extends the config `@nuxt/eslint` generates into `.nuxt/` |
| `tsconfig.json` | References the four tsconfigs Nuxt generates (app, server, shared, node) |
| `scripts/checkLineLimit.ts` | Failing on any `.ts`/`.vue` file under `app/`, `server/`, `shared/`, `scripts/` over 150 lines |
| `server/config.ts` | The only caller of `useRuntimeConfig` |
| `.env.example` | Every variable dgtest reads, with no values |

---

## Commands

All run through `bun run`.

| Command | Runs | Fails when |
|---------|------|-----------|
| `bun install` | bun, then `nuxt prepare` (postinstall) | — |
| `bun run dev` | `nuxt dev` on `http://localhost:3000` (`PORT` overrides) | — |
| `bun run build` | `nuxt build` → `.output/` | a build error |
| `bun run preview` | `nuxt preview` of `.output/` | — |
| `bun run check` | `nuxt typecheck` (vue-tsc over app, server, shared) | a type error |
| `bun run lint` | `eslint .`, then `scripts/checkLineLimit.ts` | a lint rule, or a file over 150 lines |
| `bun run fmt` | `eslint . --fix` | — (rewrites in place) |
| `bun run test` | `bun test` | a test fails |

Formatting is ESLint Stylistic, configured in `nuxt.config.ts`: no semicolons, single quotes.
There is no Prettier.

---

## Tests

Tests are written and run **only when the user asks** (`AGENTS.md`, Tests). When they are:

`foo.ts` → `foo.test.ts`, beside it. `test` from `bun:test` for cases and `node:assert/strict` for
assertions, so no test library beyond `@types/bun`. Tests never touch the network: every service
takes `fetchImpl`, and a test hands it a function returning a `Response`.

---

## Environment

`.env` may hold live keys and is gitignored; `.env.example` lists the names. Nuxt loads `.env` in
`dev`, `build` and `preview`; in production the host sets the variables. A key is declared in
`nuxt.config.ts` `runtimeConfig` (server-only) or `runtimeConfig.public` (shipped to the browser),
and overridden by `NUXT_<KEY>` / `NUXT_PUBLIC_<KEY>` — uppercase, because that is Nuxt's mapping.

A missing key switches off what needs it rather than stopping the project.

---

## Key rules / Invariants

1. **One manifest.** Dependencies change through `bun add` and nowhere else.
2. **No `.ts` or `.vue` file over 150 lines.** `bun run lint` is the gate, not review.
3. **Only `server/config.ts` calls `useRuntimeConfig`** on the server. Everything else takes values
   as arguments, which is what lets a test run with no `.env` at all.
4. **Secrets never go in `runtimeConfig.public`.** It is serialised into every page.
5. **No UI component package.** Neo-Brutalism UI is copied markup on Tailwind; adding a component
   library is a decision for the user.
