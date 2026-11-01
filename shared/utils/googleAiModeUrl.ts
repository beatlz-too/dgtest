import { GOOGLE_AI_MODE_UDM, GOOGLE_SEARCH_URL } from '#shared/constants/google'

export function googleAiModeUrl(query: string): string {
  const params = new URLSearchParams({ q: query, udm: GOOGLE_AI_MODE_UDM })
  return `${GOOGLE_SEARCH_URL}?${params}`
}
