import type { Attempt, AttemptQuestion, AttemptView } from '#shared/types/attempts'
import { findQuestionService } from '../questions/findQuestionService'

/// The attempt as the browser may see it: a question's right answer only once it is answered,
/// or once the whole test is completed.
export function buildAttemptViewService({ attempt }: { attempt: Attempt }): { view: AttemptView } {
  const questions = attempt.slots.map((slot): AttemptQuestion => {
    const { correctAnswer, ...question } = findQuestionService({ id: slot.question }).question!
    const reveal = attempt.isCompleted || slot.answer !== undefined
    return { ...question, answer: slot.answer, correctAnswer: reveal ? correctAnswer : undefined }
  })
  return {
    view: {
      id: attempt.id,
      startedAt: attempt.createdAt,
      isCompleted: attempt.isCompleted,
      totalAnswered: attempt.totalAnswered,
      totalErrors: attempt.totalErrors,
      questions,
    },
  }
}
