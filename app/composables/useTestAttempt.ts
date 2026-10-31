/// One test being taken: its questions and counters from the server, answering, and closing on timeout.
import type { AnswerResult, AttemptView } from '#shared/types/attempts'
import type { AnswerLetter } from '#shared/types/tests'

export async function useTestAttempt({ attemptId }: { attemptId: string }) {
  const { post } = useUserPost()
  const { data: view, error } = await useUserFetch<AttemptView>({ url: '/api/attempt', query: { id: attemptId } })
  const choosing = ref(false)

  async function choose({ position, letter }: { position: number, letter: AnswerLetter }): Promise<void> {
    const question = view.value?.questions[position - 1]
    if (!view.value || !question || question.answer || choosing.value) return
    choosing.value = true
    try {
      const { isCorrect: _, correctAnswer, ...counters } = await post<AnswerResult>({
        url: '/api/test-answer',
        body: { attemptId, position, letter },
      })
      Object.assign(question, { answer: letter, correctAnswer })
      Object.assign(view.value, counters)
    }
    finally {
      choosing.value = false
    }
  }

  /// Only accepted once the 30 minutes are up.
  async function finish(): Promise<void> {
    await post({ url: '/api/finish-test', body: { attemptId } })
    if (view.value) view.value.isCompleted = true
  }

  return { view, error, choosing, choose, finish }
}
