import { randomUUID } from 'node:crypto'
import { insertUserDbService } from '../db/users/insertUserDbService'

export function createUserService({ dbPath, newId = randomUUID, now = () => new Date() }: {
  dbPath: string
  newId?: () => string
  now?: () => Date
}): { userId: string } {
  const { id } = insertUserDbService({ dbPath, id: newId(), createdAt: now().toISOString() })
  return { userId: id }
}
