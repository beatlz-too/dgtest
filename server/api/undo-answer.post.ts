// POST /api/undo-answer { attemptId, position } — blanks a wrong answer again, for misclicks.
import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { USER_ID_HEADER } from '#shared/constants/users'
import { loadConfig } from '../config'
import { undoAnswer } from '../handlers/attempts/undoAnswer'

export default defineEventHandler(async (event) => {
  const userId = getHeader(event, USER_ID_HEADER)
  if (!userId) throw createError({ statusCode: 401, message: `${USER_ID_HEADER} header required` })
  const body = await readBody<{ attemptId?: unknown, position?: unknown }>(event).catch(() => undefined)
  if (typeof body?.attemptId !== 'string') throw createError({ statusCode: 400, message: 'attemptId must be a string' })
  if (!Number.isInteger(body.position)) throw createError({ statusCode: 400, message: 'position must be an integer' })

  const { dbPath } = loadConfig({ event })
  const { status, ...counters } = undoAnswer({ dbPath, userId, id: body.attemptId, position: body.position as number })
  if (status === 'not_found') throw createError({ statusCode: 404, message: 'question not found' })
  if (status === 'completed') throw createError({ statusCode: 409, message: 'test already completed' })
  if (status === 'not_wrong') throw createError({ statusCode: 409, message: 'only a wrong answer can be undone' })
  return counters
})
