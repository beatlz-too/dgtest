/// A client-side GET on a user-scoped endpoint, sending the stored user id.
import { USER_ID_HEADER } from '#shared/constants/users'

/// Untyped by route: Nuxt's per-route typing of `$fetch` blows the type checker's stack on a variable url.
const fetchJson = $fetch as unknown as <T>(url: string, options: Record<string, unknown>) => Promise<T>

export function useUserFetch<T>({ url, query }: { url: string, query?: Record<string, unknown> }) {
  const { ensureUserId } = useUserId()
  return useAsyncData<T>(
    `${url}:${JSON.stringify(query ?? {})}`,
    async () => fetchJson<T>(url, { query, headers: { [USER_ID_HEADER]: await ensureUserId() } }),
    { server: false },
  )
}
