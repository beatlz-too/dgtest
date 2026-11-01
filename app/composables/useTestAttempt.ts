/// One test being taken: its questions and counters from the server, answering, its clock, and
/// undoing a misclick, closing on timeout.
import { USER_ID_HEADER } from '#shared/constants/users'
import type { AnswerResult, AttemptCounters, AttemptView } from '#shared/types/attempts'
import type { AnswerLetter } from '#shared/types/tests'

export async function useTestAttempt({ attemptId }: { attemptId: string }) {
  const { post } = useUserPost()
  const { ensureUserId } = useUserId()
  const { data: view, error } = await useUserFetch<AttemptView>({ url: '/api/attempt', query: { id: attemptId }, deep: true })
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

  /// Blanks a wrong answer again, for misclicks.
  async function undo({ position }: { position: number }): Promise<void> {
    const question = view.value?.questions[position - 1]
    if (!view.value || !question?.answer || choosing.value) return
    choosing.value = true
    try {
      const counters = await post<AttemptCounters>({ url: '/api/undo-answer', body: { attemptId, position } })
      delete question.answer
      delete question.correctAnswer
      Object.assign(view.value, counters)
    }
    finally {
      choosing.value = false
    }
  }

  /// Starts the clock on the server; returns the seconds left. 0 when there is nothing to run.
  async function resume(): Promise<number> {
    if (!view.value || view.value.isCompleted) return 0
    const { secondsLeft } = await post<{ secondsLeft: number }>({ url: '/api/resume-test', body: { attemptId } })
    return secondsLeft
  }

  /// Stops the clock on the server. `keepalive` lets the request outlive a closing tab.
  function pause(): void {
    if (!view.value || view.value.isCompleted) return
    void ensureUserId().then(userId => fetch('/api/pause-test', {
      method: 'POST',
      keepalive: true,
      headers: { 'content-type': 'application/json', [USER_ID_HEADER]: userId },
      body: JSON.stringify({ attemptId }),
    }))
  }

  /// Only accepted once the 30 minutes are up. Brings back the final counters, blanks as errors.
  async function finish(): Promise<void> {
    const counters = await post<AttemptCounters>({ url: '/api/finish-test', body: { attemptId } })
    if (view.value) Object.assign(view.value, counters)
  }

  return { view, error, choosing, choose, undo, resume, pause, finish }
}
