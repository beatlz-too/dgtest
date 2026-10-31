---
name: ui
description: >
  Creates UI in dgtest's `app/` directory — pages, layouts, components, composables — styled with
  Neo-Brutalism UI (copy-paste Tailwind snippets from neo-brutalism-ui-library.vercel.app). Invoke
  before writing any `.vue` file or `app/` composable, when porting a Neo-Brutalism snippet, or when
  deciding how the UI gets data from the server.
---

# Creating UI

`app/` is **one more client of the HTTP endpoints**, no different from an MCP tool or a CLI. It
renders and calls `/api`. It never decides anything the domain cares about.

| Kind | Location | Name |
|------|----------|------|
| Page (a route) | `app/pages/` | file routing: `orders/[id].vue` |
| Layout | `app/layouts/` | `default.vue` |
| Primitive (Neo-Brutalism) | `app/components/ui/` | `Nb<Thing>.vue` — `NbButton.vue`, `NbInput.vue` |
| Domain component | `app/components/<domain>/` | `OrderSummary.vue` → `<OrdersOrderSummary>` |
| Composable (data, state) | `app/composables/` | `use<Thing>.ts` — `useOrders.ts` |

**May import:** `app/`, `#shared/utils`, `#shared/constants`, `#shared/types`, `vue`, `#app`.
**Never `server/`** — not a handler, not a type under `server/`. A shape both sides need goes in
`shared/types/`.

---

## Rules

- **Data only through `/api`.** `useFetch('/api/orders')` or `$fetch`, wrapped in a composable when
  more than one component needs it. A page that computes a business rule is a handler that ended up
  in the browser — move it to `server/handlers/`.
- **Pages compose, components render.** A page wires composables to components; a component takes
  props and emits events and fetches nothing.
- **Primitives know no domain.** `NbButton` has variants and slots, never an `order` prop.
- **Composables are the UI's services:** one job, objects in, objects out, no DOM.
- **`<script setup lang="ts">`**, typed `defineProps<{...}>()`, typed `defineEmits`.
- **No `.vue` file over 150 lines.** A long template is two components.
- **Public config only.** The browser may read `useRuntimeConfig().public` in one composable
  (`app/composables/usePublicConfig.ts`), never a secret.

## Neo-Brutalism UI

The library is **copy-paste Tailwind HTML**, not a package — nothing to install beyond Tailwind v4.
Snippets use arbitrary values (`bg-[#A6FAFF]`, `shadow-[2px_2px_0px_rgba(0,0,0,1)]`,
`border-black border-2`).

Porting a snippet:

1. Copy the snippet's markup from the library site into `app/components/ui/Nb<Thing>.vue`.
2. `class=` stays as-is; repeated colours and shadows become tokens in `app/assets/css/main.css`
   (`@theme`) once a second primitive uses them.
3. Replace text with a `<slot />`; colour/size choices become a typed `variant` prop mapping to
   class strings.
4. Keep native attributes flowing through (`v-bind="$attrs"` is Vue's default on the root).

```vue
<script setup lang="ts">
const { variant = 'cyan' } = defineProps<{ variant?: 'cyan' | 'pink' }>()

const VARIANTS = {
  cyan: 'bg-[#A6FAFF] hover:bg-[#79F7FF] active:bg-[#00E1EF]',
  pink: 'bg-[#FFA6F6] hover:bg-[#fa8cef] active:bg-[#f774ea]',
} as const
</script>

<template>
  <button
    class="h-12 border-2 border-black p-2.5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
    :class="VARIANTS[variant]"
  >
    <slot />
  </button>
</template>
```

## Checklist

- [ ] Lives in the right `app/` folder, named per the table
- [ ] Imports nothing from `server/`
- [ ] Gets data only through `/api`
- [ ] Primitive styled from a Neo-Brutalism snippet, no domain prop
- [ ] Under 150 lines
