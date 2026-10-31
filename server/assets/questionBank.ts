/// The DGT question bank: real magazine questions, flattened and de-duplicated. Read-only.
/// Content stays in Spanish: the DGT only examines in Spanish.
import type { Question } from '#shared/types/tests'
import questions from './questions.json'

export const QUESTION_BANK = questions as Question[]
