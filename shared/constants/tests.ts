export const ANSWER_LETTERS = ['A', 'B', 'C'] as const
/// Every test is this many random questions from the bank, like the DGT exam.
export const QUESTIONS_PER_TEST = 30
/// The DGT exam lasts 30 minutes.
export const TEST_DURATION_SECONDS = 30 * 60
/// The timer turns red at or below this.
export const TEST_WARNING_SECONDS = 5 * 60
/// The DGT pass mark: three mistakes or fewer.
export const MAX_MISTAKES_TO_PASS = 3
