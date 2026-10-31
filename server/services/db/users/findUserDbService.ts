import { openDatabase } from '../openDatabase'

export function findUserDbService({ dbPath, id }: {
  dbPath: string
  id: string
}): { user: { id: string, createdAt: string } | undefined } {
  const { db } = openDatabase({ path: dbPath })
  const row = db.prepare('SELECT id, created_at FROM users WHERE id = ?').get(id) as
    { id: string, created_at: string } | undefined
  return { user: row && { id: row.id, createdAt: row.created_at } }
}
