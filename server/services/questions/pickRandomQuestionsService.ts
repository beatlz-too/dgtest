import type { Question } from '#shared/types/tests'
import { QUESTION_BANK } from '../../assets/questionBank'

/// `count` distinct questions in random order (partial Fisher–Yates).
export function pickRandomQuestionsService({ count, random = Math.random }: {
  count: number
  random?: () => number
}): { questions: Question[] } {
  const pool = [...QUESTION_BANK]
  for (let index = 0; index < count; index++) {
    const swap = index + Math.floor(random() * (pool.length - index))
    ;[pool[index], pool[swap]] = [pool[swap]!, pool[index]!]
  }
  return { questions: pool.slice(0, count) }
}
