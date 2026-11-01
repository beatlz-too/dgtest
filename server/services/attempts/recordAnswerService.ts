import type { Attempt } from '#shared/types/attempts'
import type { AnswerLetter, Question } from '#shared/types/tests'

/// The attempt with `letter` written into slot `index` and the counters moved on.
export function recordAnswerService({ attempt, index, question, letter }: {
  attempt: Attempt
  index: number
  question: Question
  letter: AnswerLetter
}): { attempt: Attempt, isCorrect: boolean } {
  const isCorrect = letter === question.correctAnswer
  const totalAnswered = attempt.totalAnswered + 1
  return {
    isCorrect,
    attempt: {
      ...attempt,
      slots: attempt.slots.map((slot, at) => (at === index ? { ...slot, answer: letter } : slot)),
      totalAnswered,
      totalErrors: attempt.totalErrors + (isCorrect ? 0 : 1),
    },
  }
}
