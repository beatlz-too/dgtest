# dgtest — Agent Rules

TODO: describe in one paragraph what this project is and does.

**This project is independent.** It shares conventions with other repos by the author, and nothing
else: it imports nothing from them and assumes no checkout of them exists.

---

## Stack

Deliberately small. **Adding a dependency is a decision to raise with the user, not a default.**

| Concern | Choice | Notes |
|---------|--------|-------|
| Package manager | **bun** | `bun install`, `bun add`. `package.json` is the only manifest. |
| Framework | **Nuxt 4** | Vue 3 in `app/`, Nitro server in `server/`, shared code in `shared/`. |
| Language | **TypeScript**, strict | `bun run check` runs `nuxt typecheck` (vue-tsc). |
| UI | **Neo-Brutalism UI** + **Tailwind v4** | Copy-paste snippets from neo-brutalism-ui-library.vercel.app, ported to `app/components/ui/`. Tailwind via `@tailwindcss/vite`. |
| Lint / format | **@nuxt/eslint** | Stylistic: no semicolons, single quotes. `bun run fmt` = `eslint --fix`. |
| Tests | **`bun test`** + `node:assert/strict` | Written and run only when the user asks (below). |
| Database | **SQLite** via Node's built-in `node:sqlite` | No driver dependency. File at `NUXT_DB_PATH` (default `.data/dgtest.sqlite`); connection owned by `server/services/db/openDatabase.ts`. |
| i18n | **@nuxtjs/i18n** | UI text in `i18n/locales/` (EN base, ES). DGT test content is never translated. |

```
bun install          # deps (runs nuxt prepare)
bun run dev          # nuxt dev, http://localhost:3000
bun run build        # nuxt build → .output/
bun run check        # nuxt typecheck
bun run lint         # eslint + the 150-line limit
bun run fmt          # eslint --fix
bun run test         # bun test
```

Config comes from `runtimeConfig` in `nuxt.config.ts`, overridden at runtime by `NUXT_*` env vars,
and is read in `server/config.ts` and nowhere else. `.env` is gitignored and may hold live
credentials — **never commit it, never echo a secret into logs, chat, or a commit message.** Every
variable is listed, without a value, in `.env.example`.

---

## Find the docs before you do anything (HARD RULE)

**Every prompt starts at `docs/refs/docs-directory.doc.json`**: every doc as
`{ pipeline, type, path, description }`. Match the prompt to a `pipeline`, then open only those
entries. **Never open a file in `docs/refs/` to find out what is in it.** If no pipeline matches,
say so and ask whether the topic should be documented. A change that makes an entry untrue, or adds
a doc, updates the directory in the same commit.

**Invoke the `docs` skill before writing or changing any doc.** It holds the full standard; in
short:

| Suffix | Purpose |
|--------|---------|
| `.ref.md` | What a system **is** — data shape, file ownership, invariants, contracts |
| `.flow.md` | How data **moves** — execution order, timing, process and network boundaries |
| `.doc.md` | How-to for a repeatable task, or the rationale behind a standard |

- **Feature level only.** A doc exists when understanding means tracing several files; one file's
  worth is a `///` comment in that file.
- **The split is strict.** A `.ref.md` never explains order or timing; a `.flow.md` never restates
  shapes or ownership. Each opens with a callout naming its counterpart.
- **Diagrams** live in `.flow.md`, one mermaid diagram per phase, phases separated by `---`:
  `sequenceDiagram` with `autonumber` across a process or network boundary, `flowchart TD` inside
  one process. `<br>` never `\n`, entry and exit as rounded nodes, every node names its file, and
  prose says why the order matters rather than restating the diagram.
- **A `.ref.md` ends with numbered Key rules / Invariants**, each with its reason.
- **Hygiene.** A changed contract updates the ref; a changed path updates the flow; a new
  multi-file feature gets docs registered in the directory. A bug fix that changes neither needs
  nothing.

---

## Layered architecture (HARD RULE)

**`docs/refs/code-architecture.doc.md` and the skills in `.agents/skills/` are binding.** Invoke a
skill before writing any source file: `architecture` when the layer is in question, otherwise the
layer's own — `ui`, `endpoint`, `handler`, `service`, `db-service`, `util`, `constant`, `type`.

| Layer | Location | Job |
|-------|----------|-----|
| UI | `app/` | Pages and components; a client of `/api` like any other |
| Endpoint | `server/api/`, `server/routes/`, `server/tasks/` | Receive anything from outside — HTTP, WS, MCP, CLI, a webhook, a task — and reply on it |
| Handler | `server/handlers/<domain>/` | Decide what happens; orchestrate services |
| Service | `server/services/<domain>/` | Do one thing, for anybody — including every outbound call |
| DB service | `server/services/db/<domain>/` | All CRUD, and nothing else |
| Util | `shared/utils/` | Pure helpers |
| Constant / Type | `shared/constants/`, `shared/types/` | Values and shapes |

The four rules violated most:

- **An endpoint never imports a service** — it calls a handler, even a pass-through one.
- **A handler never touches storage** and never imports `services/db/`.
- **Only endpoints import a transport library** (`h3`, an MCP SDK, a WS library).
- **`app/` never imports `server/`.** It reaches the server through `/api`; `shared/` is the only
  code both sides see.

There is no `index.ts`: Nitro's file routing is the composition root, so each endpoint file wires
`loadConfig({ event })` into its handler. Project code is imported explicitly (`#shared/...`,
relative inside `server/`) even where Nuxt would auto-import it.

---

## Principles (HARD RULES)

- **No `.ts` or `.vue` file longer than 150 lines.** `bun run lint` fails on one. Split by
  responsibility.
- **Composition over inheritance.** No `extends` without a one-sentence justification (usually "the
  framework demands it"). No abstract bases, no template methods, no `super` chains. Do not reach
  for a class where a function and a type would do.
- **Single responsibility.** One module, one reason to change. If its name needs "and", split it.
- **Reusability and composition.** A module never knows who calls it. Take inputs, return outputs:
  keys, `fetch`, clocks and registries arrive as arguments. Objects in, objects out —
  `myService({ propOne })` returning `{ result }`. Named exports only, one per file — except the
  default exports Nuxt demands (`nuxt.config.ts`, route/task files, `.vue`). Write for the
  *second* caller.

---

## Tests (HARD RULE)

**Do not write or run tests unless the user specifically asks for them.** This applies across the
whole project, and it overrides every skill and doc that says a file "has a `.test.ts` beside it".
With no such request, add no `.test.ts` file, change no existing test, and do not run
`bun run test`. When a change breaks one, say so rather than fixing it unasked. `bun run check` and
`bun run lint` are not tests and still run.

When tests are asked for, they follow the convention: `foo.ts` → `foo.test.ts` beside it,
`bun:test` and `node:assert/strict`, no network. The first test adds `@types/bun` (ask first).

---

## Git (HARD RULE)

**The global `git` skill is binding.** Read it before any git operation.

- **Never commit on `main`. Never push to `main`.** Check the branch first.
- **Commit messages:** `ActionEmoji Topic(Subtopic) : imperative verb brief description` — e.g.
  `🌟 Services(payments) : charge a reserved order`.
- **Branches:** `feat/`, `fix/`, `hotfix/`, `release/`, `chore/`, `docs/`.
- **Never rewrite published history** unless the user explicitly asks.

---

## Shared agent assets

Canonical skills live in `.agents/skills/`; `.claude/skills/*` are symlinks to them. `CLAUDE.md`
points here and holds no independent rules — the two must never contradict each other.
