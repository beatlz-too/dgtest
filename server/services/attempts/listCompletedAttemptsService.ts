import type { AttemptSummary } from '#shared/types/attempts'
import { listCompletedAttemptsDbService } from '../db/attempts/listCompletedAttemptsDbService'

export function listCompletedAttemptsService({ dbPath, userId }: { dbPath: string, userId: string }): { attempts: AttemptSummary[] } {
  return listCompletedAttemptsDbService({ dbPath, userId })
}
