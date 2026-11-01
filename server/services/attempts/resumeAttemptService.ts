import type { Attempt } from '#shared/types/attempts'

/// The attempt with its clock running from `now`. Already running: unchanged.
export function resumeAttemptService({ attempt, now }: { attempt: Attempt, now: Date }): { attempt: Attempt } {
  return { attempt: { ...attempt, resumedAt: attempt.resumedAt ?? now.toISOString() } }
}
