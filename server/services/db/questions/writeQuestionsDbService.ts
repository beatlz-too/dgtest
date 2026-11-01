/// Overwrites the question bank's JSON source file with `questions`.
import { writeFileSync } from 'node:fs'
import type { Question } from '#shared/types/tests'

export function writeQuestionsDbService({ path, questions }: { path: string, questions: Question[] }): void {
  writeFileSync(path, `${JSON.stringify(questions, null, 2)}\n`)
}
