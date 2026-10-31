import { QUESTIONS_PER_TEST } from '#shared/constants/tests'
import { createAttemptService } from '../../services/attempts/createAttemptService'
import { pickRandomQuestionsService } from '../../services/questions/pickRandomQuestionsService'
import { userExistsService } from '../../services/users/userExistsService'

/// A new test: 30 random questions from the bank, stored unanswered for the user.
export function startTest({ dbPath, userId }: { dbPath: string, userId: string }):
  { status: 'started', attemptId: string } | { status: 'user_not_found' } {
  if (!userExistsService({ dbPath, userId }).exists) return { status: 'user_not_found' }
  const { questions } = pickRandomQuestionsService({ count: QUESTIONS_PER_TEST })
  const { attempt } = createAttemptService({ dbPath, userId, questionIds: questions.map(question => question.id) })
  return { status: 'started', attemptId: attempt.id }
}
