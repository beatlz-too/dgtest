import type { Question } from '#shared/types/tests'
import { googleAiModeUrl } from '#shared/utils/googleAiModeUrl'

export function buildExplanationSearchService({ question }: {
  question: Pick<Question, 'text' | 'answers'>
}): { url: string } {
  const answers = question.answers.map(answer => `${answer.letter}) ${answer.text}`).join('\n')
  const query = `Cual es la respuesta correcta a esta pregunta?\n\n${question.text}\n\n${answers}\n\nIncluye una explicacion\n`
  return { url: googleAiModeUrl(query) }
}
