import type { Attempt } from '#shared/types/attempts'

/// The attempt completed as it stands: every blank question counts as an error, as in the DGT exam.
export function closeAttemptService({ attempt }: { attempt: Attempt }): { attempt: Attempt } {
  const blanks = attempt.slots.filter(slot => !slot.answer).length
  return { attempt: { ...attempt, isCompleted: true, totalErrors: attempt.totalErrors + blanks } }
}
