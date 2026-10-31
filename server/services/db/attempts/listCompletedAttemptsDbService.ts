import type { AttemptSummary } from '#shared/types/attempts'
import { openDatabase } from '../openDatabase'

/// One user's completed rows, newest first.
export function listCompletedAttemptsDbService({ dbPath, userId }: {
  dbPath: string
  userId: string
}): { attempts: AttemptSummary[] } {
  const { db } = openDatabase({ path: dbPath })
  const rows = db.prepare(
    'SELECT id, created_at, total_errors FROM tests WHERE user_id = ? AND is_completed = 1 ORDER BY created_at DESC',
  ).all(userId) as { id: string, created_at: string, total_errors: number }[]
  return { attempts: rows.map(row => ({ id: row.id, createdAt: row.created_at, totalErrors: row.total_errors })) }
}
