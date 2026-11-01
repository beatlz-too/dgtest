import type { Question } from '#shared/types/tests'
import { QUESTION_BANK } from '../../assets/questionBank'
import { writeQuestionsDbService } from '../db/questions/writeQuestionsDbService'

/// Sets a bank question's explanation, in memory and in the bank's source file.
export function setExplanationService({ questionsPath, question, explanation }: {
  questionsPath: string
  question: Question
  explanation: string
}): { question: Question } {
  question.explanation = explanation
  writeQuestionsDbService({ path: questionsPath, questions: QUESTION_BANK })
  return { question }
}
