import type { Attempt } from '#shared/types/attempts'
import { openDatabase } from '../openDatabase'
import { SLOT_COLUMNS, slotValues } from './attemptRow'

const SQL = `UPDATE tests SET ${SLOT_COLUMNS.map(column => `${column} = ?`).join(', ')},
  is_completed = ?, total_answered = ?, total_errors = ? WHERE id = ?`

/// Writes every slot and counter of an existing row.
export function updateAttemptDbService({ dbPath, attempt }: { dbPath: string, attempt: Attempt }): { id: string } {
  const { db } = openDatabase({ path: dbPath })
  db.prepare(SQL).run(
    ...slotValues({ attempt }).values,
    attempt.isCompleted ? 1 : 0,
    attempt.totalAnswered,
    attempt.totalErrors,
    attempt.id,
  )
  return { id: attempt.id }
}
