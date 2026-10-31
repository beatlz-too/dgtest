import type { AttemptView } from '#shared/types/attempts'
import { buildAttemptViewService } from '../../services/attempts/buildAttemptViewService'
import { findAttemptService } from '../../services/attempts/findAttemptService'

export function getAttempt({ dbPath, userId, id }: { dbPath: string, userId: string, id: string }):
  { status: 'found', view: AttemptView } | { status: 'not_found' } {
  const { attempt } = findAttemptService({ dbPath, id, userId })
  if (!attempt) return { status: 'not_found' }
  return { status: 'found', view: buildAttemptViewService({ attempt }).view }
}
