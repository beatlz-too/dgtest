import type { Attempt } from '#shared/types/attempts'

/// Seconds the test page has been open: the paused total plus the running stretch, if any.
export function elapsedSecondsService({ attempt, now }: { attempt: Attempt, now: Date }): { elapsedSeconds: number } {
  const running = attempt.resumedAt ? (now.getTime() - Date.parse(attempt.resumedAt)) / 1000 : 0
  return { elapsedSeconds: attempt.elapsedSeconds + Math.max(0, Math.floor(running)) }
}
