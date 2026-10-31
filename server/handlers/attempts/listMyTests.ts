import type { AttemptSummary } from '#shared/types/attempts'
import { listCompletedAttemptsService } from '../../services/attempts/listCompletedAttemptsService'

export function listMyTests({ dbPath, userId }: { dbPath: string, userId: string }): { tests: AttemptSummary[] } {
  return { tests: listCompletedAttemptsService({ dbPath, userId }).attempts }
}
