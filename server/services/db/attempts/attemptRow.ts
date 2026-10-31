/// The `tests` table row, and how it maps to and from an `Attempt`. Private to the attempts DB services.
import { QUESTIONS_PER_TEST } from '#shared/constants/tests'
import type { Attempt } from '#shared/types/attempts'

/// `q1`…`q30`, in test order.
export const SLOT_COLUMNS = Array.from({ length: QUESTIONS_PER_TEST }, (_, index) => `q${index + 1}`)

export type AttemptRow = Record<string, string | number> & {
  id: string
  user_id: string
  is_completed: number
  total_answered: number
  total_errors: number
  created_at: string
}

export function attemptFromRow({ row }: { row: AttemptRow }): { attempt: Attempt } {
  return {
    attempt: {
      id: row.id,
      userId: row.user_id,
      slots: SLOT_COLUMNS.map(column => JSON.parse(String(row[column]))),
      isCompleted: row.is_completed === 1,
      totalAnswered: row.total_answered,
      totalErrors: row.total_errors,
      createdAt: row.created_at,
    },
  }
}

/// The values of every slot column, in `SLOT_COLUMNS` order.
export function slotValues({ attempt }: { attempt: Attempt }): { values: string[] } {
  return { values: attempt.slots.map(slot => JSON.stringify(slot)) }
}
