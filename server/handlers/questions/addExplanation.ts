import { findQuestionService } from '../../services/questions/findQuestionService'
import { setExplanationService } from '../../services/questions/setExplanationService'

/// Stores the explanation for bank question `id`, replacing any earlier one.
export function addExplanation({ questionsPath, id, explanation }: {
  questionsPath: string
  id: number
  explanation: string
}): { status: 'saved', explanation: string } | { status: 'not_found' } {
  const { question } = findQuestionService({ id })
  if (!question) return { status: 'not_found' }
  setExplanationService({ questionsPath, question, explanation })
  return { status: 'saved', explanation }
}
