// GET /api/my-tests — the calling user's completed tests, newest first.
import { createError, defineEventHandler, getHeader } from 'h3'
import { USER_ID_HEADER } from '#shared/constants/users'
import { loadConfig } from '../config'
import { listMyTests } from '../handlers/attempts/listMyTests'

export default defineEventHandler((event) => {
  const userId = getHeader(event, USER_ID_HEADER)
  if (!userId) throw createError({ statusCode: 401, message: `${USER_ID_HEADER} header required` })

  const { dbPath } = loadConfig({ event })
  return listMyTests({ dbPath, userId }).tests
})
