import type { Attempt } from '#shared/types/attempts'
import { updateAttemptDbService } from '../db/attempts/updateAttemptDbService'

export function saveAttemptService({ dbPath, attempt }: { dbPath: string, attempt: Attempt }): { attempt: Attempt } {
  updateAttemptDbService({ dbPath, attempt })
  return { attempt }
}
