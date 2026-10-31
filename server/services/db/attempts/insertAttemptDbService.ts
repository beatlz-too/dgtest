import type { Attempt } from '#shared/types/attempts'
import { openDatabase } from '../openDatabase'
import { SLOT_COLUMNS, slotValues } from './attemptRow'

const COLUMNS = ['id', 'user_id', ...SLOT_COLUMNS, 'is_completed', 'total_answered', 'total_errors', 'created_at']
const SQL = `INSERT INTO tests (${COLUMNS.join(', ')}) VALUES (${COLUMNS.map(() => '?').join(', ')})`

export function insertAttemptDbService({ dbPath, attempt }: { dbPath: string, attempt: Attempt }): { id: string } {
  const { db } = openDatabase({ path: dbPath })
  db.prepare(SQL).run(
    attempt.id,
    attempt.userId,
    ...slotValues({ attempt }).values,
    attempt.isCompleted ? 1 : 0,
    attempt.totalAnswered,
    attempt.totalErrors,
    attempt.createdAt,
  )
  return { id: attempt.id }
}
