// GET /api/started-tests — the calling user's tests not completed yet, newest first.
import { createError, defineEventHandler, getHeader } from 'h3'
import { USER_ID_HEADER } from '#shared/constants/users'
import { loadConfig } from '../config'
import { listStartedTests } from '../handlers/attempts/listStartedTests'

export default defineEventHandler((event) => {
  const userId = getHeader(event, USER_ID_HEADER)
  if (!userId) throw createError({ statusCode: 401, message: `${USER_ID_HEADER} header required` })

  const { dbPath } = loadConfig({ event })
  return listStartedTests({ dbPath, userId }).tests
})
