// POST /api/start-test — starts a new test of 30 random questions for the calling user.
import { createError, defineEventHandler, getHeader } from 'h3'
import { USER_ID_HEADER } from '#shared/constants/users'
import { loadConfig } from '../config'
import { startTest } from '../handlers/attempts/startTest'

export default defineEventHandler((event) => {
  const userId = getHeader(event, USER_ID_HEADER)
  if (!userId) throw createError({ statusCode: 401, message: `${USER_ID_HEADER} header required` })

  const { dbPath } = loadConfig({ event })
  const result = startTest({ dbPath, userId })
  if (result.status === 'user_not_found') throw createError({ statusCode: 401, message: 'unknown user' })
  return { attemptId: result.attemptId }
})
