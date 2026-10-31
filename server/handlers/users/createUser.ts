import { createUserService } from '../../services/users/createUserService'

export function createUser({ dbPath }: { dbPath: string }): { userId: string } {
  return createUserService({ dbPath })
}
