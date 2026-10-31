import type { ANSWER_LETTERS } from '#shared/constants/tests'

export type AnswerLetter = (typeof ANSWER_LETTERS)[number]

export type Answer = {
  letter: AnswerLetter
  text: string
}

/// One question of the bank (`server/assets/questions.json`).
export type Question = {
  id: number
  text: string
  image: string
  answers: Answer[]
  correctAnswer: AnswerLetter
}

/// A question as shown to someone taking a test: the right answer removed.
export type PublicQuestion = Omit<Question, 'correctAnswer'>
