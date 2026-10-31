// GET /api/create-user — registers a new anonymous user and returns its id.
import { defineEventHandler } from 'h3'
import { loadConfig } from '../config'
import { createUser } from '../handlers/users/createUser'

export default defineEventHandler((event) => {
  const { dbPath } = loadConfig({ event })
  return createUser({ dbPath })
})
