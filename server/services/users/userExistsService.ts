import { findUserDbService } from '../db/users/findUserDbService'

export function userExistsService({ dbPath, userId }: { dbPath: string, userId: string }): { exists: boolean } {
  return { exists: findUserDbService({ dbPath, id: userId }).user !== undefined }
}
