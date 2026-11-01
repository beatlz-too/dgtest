import type { Attempt } from '#shared/types/attempts'
import { elapsedSecondsService } from './elapsedSecondsService'

/// The attempt with its clock stopped: the running stretch folded into `elapsedSeconds`.
export function pauseAttemptService({ attempt, now }: { attempt: Attempt, now: Date }): { attempt: Attempt } {
  const { elapsedSeconds } = elapsedSecondsService({ attempt, now })
  return { attempt: { ...attempt, elapsedSeconds, resumedAt: undefined } }
}
