// GET /api/attempt?id=<attempt id> — one of the calling user's tests, to take or to review.
import { createError, defineEventHandler, getHeader, getQuery } from 'h3'
import { USER_ID_HEADER } from '#shared/constants/users'
import { loadConfig } from '../config'
import { getAttempt } from '../handlers/attempts/getAttempt'

export default defineEventHandler((event) => {
  const userId = getHeader(event, USER_ID_HEADER)
  if (!userId) throw createError({ statusCode: 401, message: `${USER_ID_HEADER} header required` })
  const id = getQuery(event).id
  if (typeof id !== 'string' || !id) throw createError({ statusCode: 400, message: 'id required' })

  const { dbPath } = loadConfig({ event })
  const result = getAttempt({ dbPath, userId, id })
  if (result.status === 'not_found') throw createError({ statusCode: 404, message: 'test not found' })
  return result.view
})
