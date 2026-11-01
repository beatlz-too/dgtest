import { TEST_DURATION_SECONDS } from '#shared/constants/tests'
import { elapsedSecondsService } from '../../services/attempts/elapsedSecondsService'
import { findAttemptService } from '../../services/attempts/findAttemptService'
import { resumeAttemptService } from '../../services/attempts/resumeAttemptService'
import { saveAttemptService } from '../../services/attempts/saveAttemptService'

/// Starts a test's clock again as its page opens, and says how much time is left.
export function resumeTest({ dbPath, userId, id, now = new Date() }: {
  dbPath: string
  userId: string
  id: string
  now?: Date
}): { status: 'resumed', secondsLeft: number } | { status: 'completed' } | { status: 'not_found' } {
  const { attempt: found } = findAttemptService({ dbPath, id, userId })
  if (!found) return { status: 'not_found' }
  if (found.isCompleted) return { status: 'completed' }

  const { attempt } = saveAttemptService({ dbPath, attempt: resumeAttemptService({ attempt: found, now }).attempt })
  const { elapsedSeconds } = elapsedSecondsService({ attempt, now })
  return { status: 'resumed', secondsLeft: Math.max(0, TEST_DURATION_SECONDS - elapsedSeconds) }
}
