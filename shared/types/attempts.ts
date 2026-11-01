import type { AnswerLetter, PublicQuestion } from '#shared/types/tests'

/// One question column of the `tests` table: which bank question sits there, and the user's pick.
export type AttemptSlot = {
  question: number
  answer?: AnswerLetter
}

export type AttemptCounters = {
  isCompleted: boolean
  totalAnswered: number
  totalErrors: number
}

/// One row of the `tests` table: a test a user started.
export type Attempt = AttemptCounters & {
  id: string
  userId: string
  slots: AttemptSlot[]
  createdAt: string
  /// Seconds the test page was open, up to the last pause.
  elapsedSeconds: number
  /// When the page last opened it; absent while paused.
  resumedAt?: string
}

/// A question inside a test. `correctAnswer` is present once answered, or once the test is completed.
export type AttemptQuestion = PublicQuestion & {
  answer?: AnswerLetter
  correctAnswer?: AnswerLetter
  /// Google AI Mode search explaining the question; present alongside `correctAnswer`.
  explanationUrl?: string
  explanation?: string
}

/// A test as the browser sees it, for taking it or reviewing it.
export type AttemptView = AttemptCounters & {
  id: string
  startedAt: string
  questions: AttemptQuestion[]
}

/// The reply to answering one question.
export type AnswerResult = AttemptCounters & {
  isCorrect: boolean
  correctAnswer: AnswerLetter
  explanationUrl: string
  explanation?: string
}

/// One card on My tests: a completed test.
export type AttemptSummary = {
  id: string
  createdAt: string
  totalErrors: number
}

/// One card under "Started tests": a test not completed yet.
export type StartedAttemptSummary = AttemptSummary & {
  totalAnswered: number
  /// The first unanswered question, 1-based.
  nextPosition: number
}
