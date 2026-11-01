import type { Attempt, AttemptQuestion, AttemptView } from '#shared/types/attempts'
import { buildExplanationSearchService } from '../questions/buildExplanationSearchService'
import { findQuestionService } from '../questions/findQuestionService'

/// The attempt as the browser may see it: a question's right answer only once it is answered,
/// or once the whole test is completed.
export function buildAttemptViewService({ attempt }: { attempt: Attempt }): { view: AttemptView } {
  const questions = attempt.slots.map((slot): AttemptQuestion => {
    const { correctAnswer, explanation, ...question } = findQuestionService({ id: slot.question }).question!
    const reveal = attempt.isCompleted || slot.answer !== undefined
    if (!reveal) return { ...question, answer: slot.answer }
    const { url: explanationUrl } = buildExplanationSearchService({ question })
    return { ...question, answer: slot.answer, correctAnswer, explanationUrl, explanation }
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
