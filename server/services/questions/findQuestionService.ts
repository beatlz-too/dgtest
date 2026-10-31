import type { Question } from '#shared/types/tests'
import { QUESTION_BANK } from '../../assets/questionBank'

const BY_ID = new Map(QUESTION_BANK.map(question => [question.id, question]))

export function findQuestionService({ id }: { id: number }): { question: Question | undefined } {
  return { question: BY_ID.get(id) }
}
