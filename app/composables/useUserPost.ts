/// A POST on a user-scoped endpoint, sending the stored user id. A 401 means the server forgot the
/// user: get a fresh id and send once more.
import { USER_ID_HEADER } from '#shared/constants/users'

/// Untyped by route: Nuxt's per-route typing of `$fetch` blows the type checker's stack on a variable url.
const fetchJson = $fetch as unknown as <T>(url: string, options: Record<string, unknown>) => Promise<T>

export function useUserPost() {
  const { ensureUserId, forgetUserId } = useUserId()

  const send = async <T>(url: string, body: Record<string, unknown>) =>
    fetchJson<T>(url, { method: 'POST', body, headers: { [USER_ID_HEADER]: await ensureUserId() } })

  async function post<T>({ url, body = {} }: { url: string, body?: Record<string, unknown> }): Promise<T> {
    return send<T>(url, body).catch((error) => {
      if (error?.statusCode !== 401) throw error
      forgetUserId()
      return send<T>(url, body)
    })
  }

  return { post }
}
