import type { Attempt } from '#shared/types/attempts'
import { findAttemptDbService } from '../db/attempts/findAttemptDbService'

export function findAttemptService({ dbPath, id, userId }: {
  dbPath: string
  id: string
  userId: string
}): { attempt: Attempt | undefined } {
  return findAttemptDbService({ dbPath, id, userId })
}
