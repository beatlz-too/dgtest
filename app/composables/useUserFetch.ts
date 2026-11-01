/// A client-side GET on a user-scoped endpoint, sending the stored user id.
/// `deep` makes in-place edits of the data reactive (Nuxt's default is a shallow ref).
import { USER_ID_HEADER } from '#shared/constants/users'

/// Untyped by route: Nuxt's per-route typing of `$fetch` blows the type checker's stack on a variable url.
const fetchJson = $fetch as unknown as <T>(url: string, options: Record<string, unknown>) => Promise<T>

export function useUserFetch<T>({ url, query, deep = false }: { url: string, query?: Record<string, unknown>, deep?: boolean }) {
  const { ensureUserId } = useUserId()
  return useAsyncData<T>(
    `${url}:${JSON.stringify(query ?? {})}`,
    async () => fetchJson<T>(url, { query, headers: { [USER_ID_HEADER]: await ensureUserId() } }),
    { server: false, deep },
  )
}
