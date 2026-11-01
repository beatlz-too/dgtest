import type { Attempt } from '#shared/types/attempts'

/// The attempt with slot `index` blank again and its wrong answer taken off the counters.
export function clearAnswerService({ attempt, index }: { attempt: Attempt, index: number }): { attempt: Attempt } {
  return {
    attempt: {
      ...attempt,
      slots: attempt.slots.map((slot, at) => (at === index ? { question: slot.question } : slot)),
      totalAnswered: attempt.totalAnswered - 1,
      totalErrors: attempt.totalErrors - 1,
    },
  }
}
