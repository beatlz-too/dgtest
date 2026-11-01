// POST /api/question-explanation { questionId, explanation } — saves a question's explanation to the bank.
import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { USER_ID_HEADER } from '#shared/constants/users'
import { loadConfig } from '../config'
import { addExplanation } from '../handlers/questions/addExplanation'

export default defineEventHandler(async (event) => {
  const userId = getHeader(event, USER_ID_HEADER)
  if (!userId) throw createError({ statusCode: 401, message: `${USER_ID_HEADER} header required` })
  const body = await readBody<{ questionId?: unknown, explanation?: unknown }>(event).catch(() => undefined)
  if (!Number.isInteger(body?.questionId)) throw createError({ statusCode: 400, message: 'questionId must be an integer' })
  const explanation = typeof body!.explanation === 'string' ? body!.explanation.trim() : ''
  if (!explanation) throw createError({ statusCode: 400, message: 'explanation must be a non-empty string' })

  const { questionsPath } = loadConfig({ event })
  const result = addExplanation({ questionsPath, id: body!.questionId as number, explanation })
  if (result.status === 'not_found') throw createError({ statusCode: 404, message: 'question not found' })
  return { explanation: result.explanation }
})
