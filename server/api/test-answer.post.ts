// POST /api/test-answer { attemptId, position, letter } — records one answer, says if it was right.
import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { ANSWER_LETTERS } from '#shared/constants/tests'
import { USER_ID_HEADER } from '#shared/constants/users'
import type { AnswerLetter } from '#shared/types/tests'
import { loadConfig } from '../config'
import { answerQuestion } from '../handlers/attempts/answerQuestion'

export default defineEventHandler(async (event) => {
  const userId = getHeader(event, USER_ID_HEADER)
  if (!userId) throw createError({ statusCode: 401, message: `${USER_ID_HEADER} header required` })
  const body = await readBody<{ attemptId?: unknown, position?: unknown, letter?: unknown }>(event).catch(() => undefined)
  if (typeof body?.attemptId !== 'string') throw createError({ statusCode: 400, message: 'attemptId must be a string' })
  if (!Number.isInteger(body.position)) throw createError({ statusCode: 400, message: 'position must be an integer' })
  if (!ANSWER_LETTERS.includes(body.letter as AnswerLetter)) throw createError({ statusCode: 400, message: 'letter must be A, B or C' })

  const { dbPath } = loadConfig({ event })
  const { status, ...result } = answerQuestion({
    dbPath,
    userId,
    id: body.attemptId,
    position: body.position as number,
    letter: body.letter as AnswerLetter,
  })
  if (status === 'not_found') throw createError({ statusCode: 404, message: 'question not found' })
  if (status === 'already_answered') throw createError({ statusCode: 409, message: 'question already answered' })
  if (status === 'completed') throw createError({ statusCode: 409, message: 'test already completed' })
  return result
})
