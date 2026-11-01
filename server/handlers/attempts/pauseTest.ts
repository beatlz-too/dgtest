import { findAttemptService } from '../../services/attempts/findAttemptService'
import { pauseAttemptService } from '../../services/attempts/pauseAttemptService'
import { saveAttemptService } from '../../services/attempts/saveAttemptService'

/// Stops a test's clock while its page is closed. Completed or already paused: nothing to do.
export function pauseTest({ dbPath, userId, id, now = new Date() }: {
  dbPath: string
  userId: string
  id: string
  now?: Date
}): { status: 'paused' | 'not_found' } {
  const { attempt } = findAttemptService({ dbPath, id, userId })
  if (!attempt) return { status: 'not_found' }
  if (attempt.isCompleted || !attempt.resumedAt) return { status: 'paused' }

  saveAttemptService({ dbPath, attempt: pauseAttemptService({ attempt, now }).attempt })
  return { status: 'paused' }
}
