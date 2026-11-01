import { randomUUID } from 'node:crypto'
import type { Attempt } from '#shared/types/attempts'
import { insertAttemptDbService } from '../db/attempts/insertAttemptDbService'

/// Stores a fresh, unanswered test over the given questions.
export function createAttemptService({ dbPath, userId, questionIds, newId = randomUUID, now = () => new Date() }: {
  dbPath: string
  userId: string
  questionIds: number[]
  newId?: () => string
  now?: () => Date
}): { attempt: Attempt } {
  const attempt: Attempt = {
    id: newId(),
    userId,
    slots: questionIds.map(question => ({ question })),
    isCompleted: false,
    totalAnswered: 0,
    totalErrors: 0,
    createdAt: now().toISOString(),
    elapsedSeconds: 0,
  }
  insertAttemptDbService({ dbPath, attempt })
  return { attempt }
}
