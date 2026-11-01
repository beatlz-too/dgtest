import type { AttemptCounters } from '#shared/types/attempts'
import { clearAnswerService } from '../../services/attempts/clearAnswerService'
import { findAttemptService } from '../../services/attempts/findAttemptService'
import { saveAttemptService } from '../../services/attempts/saveAttemptService'
import { findQuestionService } from '../../services/questions/findQuestionService'

/// Blanks question `position` (1-based) again, for misclicks. Only a wrong answer on an open test
/// can be undone.
export function undoAnswer({ dbPath, userId, id, position }: {
  dbPath: string
  userId: string
  id: string
  position: number
}):
  | ({ status: 'undone' } & AttemptCounters)
  | { status: 'not_found' }
  | { status: 'completed' }
  | { status: 'not_wrong' } {
  const { attempt } = findAttemptService({ dbPath, id, userId })
  const slot = attempt?.slots[position - 1]
  if (!attempt || !slot) return { status: 'not_found' }
  if (attempt.isCompleted) return { status: 'completed' }
  const { question } = findQuestionService({ id: slot.question })
  if (!slot.answer || slot.answer === question!.correctAnswer) return { status: 'not_wrong' }

  const cleared = clearAnswerService({ attempt, index: position - 1 })
  const { attempt: saved } = saveAttemptService({ dbPath, attempt: cleared.attempt })
  return {
    status: 'undone',
    isCompleted: saved.isCompleted,
    totalAnswered: saved.totalAnswered,
    totalErrors: saved.totalErrors,
  }
}
