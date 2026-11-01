import type { AnswerResult } from '#shared/types/attempts'
import type { AnswerLetter } from '#shared/types/tests'
import { findAttemptService } from '../../services/attempts/findAttemptService'
import { recordAnswerService } from '../../services/attempts/recordAnswerService'
import { saveAttemptService } from '../../services/attempts/saveAttemptService'
import { buildExplanationSearchService } from '../../services/questions/buildExplanationSearchService'
import { findQuestionService } from '../../services/questions/findQuestionService'

/// Records the user's pick for question `position` (1-based) and reveals whether it was right.
/// A question is answered once; a completed test takes no more answers.
export function answerQuestion({ dbPath, userId, id, position, letter }: {
  dbPath: string
  userId: string
  id: string
  position: number
  letter: AnswerLetter
}):
  | ({ status: 'answered' } & AnswerResult)
  | { status: 'not_found' }
  | { status: 'already_answered' }
  | { status: 'completed' } {
  const { attempt } = findAttemptService({ dbPath, id, userId })
  const slot = attempt?.slots[position - 1]
  if (!attempt || !slot) return { status: 'not_found' }
  if (attempt.isCompleted) return { status: 'completed' }
  if (slot.answer) return { status: 'already_answered' }

  const { question } = findQuestionService({ id: slot.question })
  const recorded = recordAnswerService({ attempt, index: position - 1, question: question!, letter })
  const { attempt: saved } = saveAttemptService({ dbPath, attempt: recorded.attempt })
  const { url: explanationUrl } = buildExplanationSearchService({ question: question! })
  return {
    status: 'answered',
    isCorrect: recorded.isCorrect,
    correctAnswer: question!.correctAnswer,
    explanationUrl,
    explanation: question!.explanation,
    isCompleted: saved.isCompleted,
    totalAnswered: saved.totalAnswered,
    totalErrors: saved.totalErrors,
  }
}
