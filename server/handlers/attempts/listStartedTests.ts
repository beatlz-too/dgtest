import type { StartedAttemptSummary } from '#shared/types/attempts'
import { listStartedAttemptsService } from '../../services/attempts/listStartedAttemptsService'

export function listStartedTests({ dbPath, userId }: { dbPath: string, userId: string }): { tests: StartedAttemptSummary[] } {
  return { tests: listStartedAttemptsService({ dbPath, userId }).attempts }
}
