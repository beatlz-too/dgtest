/// The only file that calls `useRuntimeConfig`. Endpoints call `loadConfig({ event })` and pass
/// what they need to handlers as arguments; nothing below an endpoint reads config.
///
/// Adding a key: declare it in `nuxt.config.ts` `runtimeConfig`, list `NUXT_<KEY>=` in
/// `.env.example`, add it to `Config` and map it here.
import type { H3Event } from 'h3'

export type Config = {
  dbPath: string
}

export function loadConfig({ event }: { event: H3Event }): Config {
  const config = useRuntimeConfig(event)
  return { dbPath: config.dbPath }
}
