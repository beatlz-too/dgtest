---
name: endpoint
description: >
  Creates an endpoint in dgtest's layered architecture (`server/api/`, `server/routes/`,
  `server/tasks/`) — the only place allowed to know a wire format. "Endpoint" means any way something
  outside talks to the project, not just HTTP: an API route, a webhook, a WebSocket, an MCP tool
  call, a CLI invocation, a scheduled task. Invoke when asked for a new endpoint, route or channel
  event, or when deciding how a payload becomes a plain object for a handler.
---

# Creating an Endpoint

An endpoint is the **only** place in the codebase allowed to know a wire format. It receives data
from a channel or protocol, normalises it, hands it to a handler, and turns the handler's plain
result back into whatever that channel expects.

## What counts as an endpoint

**Everything that carries a request across the boundary into the project.** Nitro's file routing
decides where most of them live:

| Entry | Lives in | Looks like |
|-------|----------|------------|
| An API route (what `app/` calls) | `server/api/<domain>/` | `orders/index.post.ts` → `POST /api/orders` |
| A non-`/api` route, a webhook | `server/routes/<channel>/` | `webhooks/stripe.post.ts` |
| A WebSocket | `server/routes/<channel>/` | `ws/orders.ts` with `defineWebSocketHandler` |
| A scheduled / one-off task | `server/tasks/<domain>/` | `orders/expire.ts` with `defineTask` |
| An MCP tool, a CLI command | `server/endpoints/<channel>/` | `mcp/placeOrderTool.ts`, mounted by one route or script |

Two things follow, and they are the whole point:

- **Adding a channel adds files here and changes nothing underneath.** If wiring MCP makes you edit
  a handler, the endpoint kept something it should have normalised away.
- **Outbound is not an endpoint.** Calling a third-party API is a *service* — it is the project
  reaching out, not something reaching in. Direction decides the layer.

**May import:** `server/handlers/`, `server/config.ts`, `#shared/*`, `h3` and its own channel's
library. Never `server/services/`, never `server/services/db/`.

---

## Rules

- **Calls handlers. Never services, never DB services.** If you find yourself importing from
  `server/services/`, stop — the logic you are about to inline belongs in a handler.
- **Contains no business logic.** Branching on *transport* state (missing field, bad auth, wrong
  content type) is the endpoint's job; branching on domain state is not.
- **Owns five things and only five:** parsing the incoming payload, authorising the caller,
  reading config (`loadConfig({ event })`), invoking a handler, rendering the reply.
- **Passes a plain object down.** The handler never receives an `H3Event` or any library type.
- **It is its own composition root.** Nitro has no `index.ts`; the endpoint file is where config
  meets the handler. Nothing imports an endpoint.
- **Default export, because Nitro demands it** (`export default defineEventHandler(...)`). The one
  exception to named exports.
- One endpoint per event or route. Two routes are two files, even when they share a handler.

## Shape

```ts
// server/api/orders/index.post.ts → POST /api/orders
import { createError, defineEventHandler, readBody } from 'h3'
import { loadConfig } from '../../config'
import { placeOrder } from '../../handlers/orders/placeOrder'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ itemId?: unknown; quantity?: unknown }>(event).catch(() => undefined)
  if (typeof body?.itemId !== 'string') throw createError({ statusCode: 400, message: 'itemId must be a string' })
  if (typeof body.quantity !== 'number') throw createError({ statusCode: 400, message: 'quantity must be a number' })

  const { paymentsKey } = loadConfig({ event })
  const result = await placeOrder({ itemId: body.itemId, quantity: body.quantity, paymentsKey })
  if (result.status === 'out_of_stock') throw createError({ statusCode: 409, message: 'out of stock' })

  return { orderId: result.orderId }
})
```

The handler got a string and a number, not an event. That is what makes the MCP version of this
file a copy with a different first and last paragraph, and no new handler at all.

## Conventions that hold in every layer

- **No `.ts` or `.vue` file over 150 lines.** Split by responsibility.
- **Objects in, objects out**, even at one field.
- **Take inputs, return outputs.** Only `server/config.ts` calls `useRuntimeConfig`.
- **Only when the user asks for tests** (`AGENTS.md`, Tests): a test lives beside its subject,
  `bun:test` + `node:assert/strict`.
- **Never `extends`.** Composition over inheritance.

## Checklist

- [ ] Lives under `server/api/`, `server/routes/`, `server/tasks/` or `server/endpoints/<channel>/`
- [ ] Imports nothing from `server/services/`
- [ ] Passes primitives and plain objects to the handler, not library types
- [ ] Contains no decision the domain would care about
- [ ] Reads config through `loadConfig({ event })`, never `useRuntimeConfig` directly
- [ ] Only if tests were asked for: has a `.test.ts` beside it that fakes the handler
