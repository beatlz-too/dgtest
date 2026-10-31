import type { StartedAttemptSummary } from '#shared/types/attempts'
import { listStartedAttemptsDbService } from '../db/attempts/listStartedAttemptsDbService'

export function listStartedAttemptsService({ dbPath, userId }: {
  dbPath: string
  userId: string
}): { attempts: StartedAttemptSummary[] } {
  const { attempts } = listStartedAttemptsDbService({ dbPath, userId })
  return {
    attempts: attempts.map(attempt => ({
      id: attempt.id,
      createdAt: attempt.createdAt,
      totalAnswered: attempt.totalAnswered,
      totalErrors: attempt.totalErrors,
      nextPosition: attempt.slots.findIndex(slot => !slot.answer) + 1,
    })),
  }
}
