import { QUESTIONS_PER_TEST, TEST_DURATION_SECONDS } from '#shared/constants/tests'
import type { AttemptCounters } from '#shared/types/attempts'
import { closeAttemptService } from '../../services/attempts/closeAttemptService'
import { elapsedSecondsService } from '../../services/attempts/elapsedSecondsService'
import { findAttemptService } from '../../services/attempts/findAttemptService'
import { pauseAttemptService } from '../../services/attempts/pauseAttemptService'
import { saveAttemptService } from '../../services/attempts/saveAttemptService'

/// The browser's clock may run a little ahead of the server's.
const CLOCK_SKEW_SECONDS = 10

/// Closes a test that is fully answered or whose 30 minutes of open-page time are up.
export function finishTest({ dbPath, userId, id, now = new Date() }: {
  dbPath: string
  userId: string
  id: string
  now?: Date
}):
  | ({ status: 'finished' | 'already_completed' } & AttemptCounters)
  | { status: 'time_left' | 'not_found' } {
  const { attempt: found } = findAttemptService({ dbPath, id, userId })
  if (!found) return { status: 'not_found' }
  if (found.isCompleted) return { status: 'already_completed', ...counters({ attempt: found }) }
  const { elapsedSeconds } = elapsedSecondsService({ attempt: found, now })
  const isAllAnswered = found.totalAnswered === QUESTIONS_PER_TEST
  if (!isAllAnswered && elapsedSeconds < TEST_DURATION_SECONDS - CLOCK_SKEW_SECONDS) return { status: 'time_left' }

  const { attempt: paused } = pauseAttemptService({ attempt: found, now })
  const { attempt } = saveAttemptService({ dbPath, attempt: closeAttemptService({ attempt: paused }).attempt })
  return { status: 'finished', ...counters({ attempt }) }
}

function counters({ attempt }: { attempt: AttemptCounters }): AttemptCounters {
  return { isCompleted: attempt.isCompleted, totalAnswered: attempt.totalAnswered, totalErrors: attempt.totalErrors }
}
