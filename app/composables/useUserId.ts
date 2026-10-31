/// The anonymous user id kept in local storage, created on the server the first time it is needed.
const STORAGE_KEY = 'dgtest:userId'
let pending: Promise<string> | undefined

export function useUserId() {
  function ensureUserId(): Promise<string> {
    pending ??= (async () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return stored
      const { userId } = await $fetch('/api/create-user')
      localStorage.setItem(STORAGE_KEY, userId)
      return userId
    })()
    pending.catch(() => (pending = undefined))
    return pending
  }

  /// Drops an id the server no longer knows, so the next `ensureUserId` creates a fresh one.
  function forgetUserId(): void {
    localStorage.removeItem(STORAGE_KEY)
    pending = undefined
  }

  return { ensureUserId, forgetUserId }
}
