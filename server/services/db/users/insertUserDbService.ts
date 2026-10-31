import { openDatabase } from '../openDatabase'

export function insertUserDbService({ dbPath, id, createdAt }: {
  dbPath: string
  id: string
  createdAt: string
}): { id: string } {
  const { db } = openDatabase({ path: dbPath })
  db.prepare('INSERT INTO users (id, created_at) VALUES (?, ?)').run(id, createdAt)
  return { id }
}
