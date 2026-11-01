// POST /api/finish-test { attemptId } — closes a test whose time is up; blanks count as errors.
import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { USER_ID_HEADER } from '#shared/constants/users'
import { loadConfig } from '../config'
import { finishTest } from '../handlers/attempts/finishTest'

export default defineEventHandler(async (event) => {
  const userId = getHeader(event, USER_ID_HEADER)
  if (!userId) throw createError({ statusCode: 401, message: `${USER_ID_HEADER} header required` })
  const body = await readBody<{ attemptId?: unknown }>(event).catch(() => undefined)
  if (typeof body?.attemptId !== 'string') throw createError({ statusCode: 400, message: 'attemptId must be a string' })

  const { dbPath } = loadConfig({ event })
  const { status, ...counters } = finishTest({ dbPath, userId, id: body.attemptId })
  if (status === 'not_found') throw createError({ statusCode: 404, message: 'test not found' })
  if (status === 'time_left') throw createError({ statusCode: 409, message: 'time is not up yet' })
  return counters
})
