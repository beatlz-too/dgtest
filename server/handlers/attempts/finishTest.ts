import { TEST_DURATION_SECONDS } from '#shared/constants/tests'
import { closeAttemptService } from '../../services/attempts/closeAttemptService'
import { findAttemptService } from '../../services/attempts/findAttemptService'
import { saveAttemptService } from '../../services/attempts/saveAttemptService'

/// The browser's clock may run a little ahead of the server's.
const CLOCK_SKEW_MS = 10_000

/// Closes a test whose 30 minutes are up. Before that, a test only completes by answering all of it.
export function finishTest({ dbPath, userId, id, now = new Date() }: {
  dbPath: string
  userId: string
  id: string
  now?: Date
}): { status: 'finished' | 'already_completed' | 'time_left' | 'not_found' } {
  const { attempt } = findAttemptService({ dbPath, id, userId })
  if (!attempt) return { status: 'not_found' }
  if (attempt.isCompleted) return { status: 'already_completed' }
  const endsAt = Date.parse(attempt.createdAt) + TEST_DURATION_SECONDS * 1000 - CLOCK_SKEW_MS
  if (now.getTime() < endsAt) return { status: 'time_left' }

  saveAttemptService({ dbPath, attempt: closeAttemptService({ attempt }).attempt })
  return { status: 'finished' }
}
