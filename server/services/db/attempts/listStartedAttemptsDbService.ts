import type { Attempt } from '#shared/types/attempts'
import { openDatabase } from '../openDatabase'
import { attemptFromRow, type AttemptRow } from './attemptRow'

/// One user's rows not completed yet, newest first.
export function listStartedAttemptsDbService({ dbPath, userId }: {
  dbPath: string
  userId: string
}): { attempts: Attempt[] } {
  const { db } = openDatabase({ path: dbPath })
  const rows = db.prepare(
    'SELECT * FROM tests WHERE user_id = ? AND is_completed = 0 ORDER BY created_at DESC',
  ).all(userId) as AttemptRow[]
  return { attempts: rows.map(row => attemptFromRow({ row }).attempt) }
}
