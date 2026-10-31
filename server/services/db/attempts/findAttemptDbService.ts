import type { Attempt } from '#shared/types/attempts'
import { openDatabase } from '../openDatabase'
import { attemptFromRow, type AttemptRow } from './attemptRow'

/// A row only when it belongs to `userId`.
export function findAttemptDbService({ dbPath, id, userId }: {
  dbPath: string
  id: string
  userId: string
}): { attempt: Attempt | undefined } {
  const { db } = openDatabase({ path: dbPath })
  const row = db.prepare('SELECT * FROM tests WHERE id = ? AND user_id = ?').get(id, userId) as AttemptRow | undefined
  return { attempt: row && attemptFromRow({ row }).attempt }
}
