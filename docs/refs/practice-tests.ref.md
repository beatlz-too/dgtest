# Practice Tests — Reference

> **Design reference.** What the DGT practice feature is made of: the question bank, the anonymous
> user, the stored tests, the API, the pages. For the order it happens in, see
> `practice-tests.flow.md`.

## Overview

Anonymous, mobile-first practice of real DGT magazine questions. A browser gets a uuid on first
visit. Each test is 30 random questions, one per page, against a 30-minute clock. Each answer is
saved and graded on the spot. Test content is Spanish and never translated; UI text is i18n
(EN base, ES).

## Data

| Thing | Where | Shape |
|-------|-------|-------|
| Question bank (766; only `explanation` is ever written) | `server/assets/questions.json`, typed by `server/assets/questionBank.ts` | `Question` in `shared/types/tests.ts` |
| Users | SQLite `users` | `id` (uuid), `created_at` |
| Tests taken | SQLite `tests` | `Attempt` in `shared/types/attempts.ts` |
| User id | browser localStorage `dgtest:userId` | uuid |

The bank is the DGT magazine tests flattened into one array, with duplicates and malformed
questions removed. Question `id`s are positions in that file.

`tests` columns: `id`, `user_id` → `users`, `q1`…`q30`, `is_completed`, `total_answered`,
`total_errors`, `created_at`, `elapsed_seconds`, `resumed_at`. Each `qN` is a JSON `AttemptSlot`: `{ question, answer? }`, holding
the bank id and the user's letter. `elapsed_seconds` is the time the test page was open up to the last
pause; `resumed_at` is set while it is open (NULL = paused). Both are added to an older table on open.
An older `tests` table (one row per finished test, with
`test_id`) gets dropped when the database opens (`server/services/db/openDatabase.ts`).

## API

Every route except `create-user` takes header `x-user-id`. A test that belongs to another user
returns 404.

| Route | In | Out |
|-------|----|-----|
| `GET /api/create-user` | — | `{ userId }` |
| `POST /api/start-test` | — | `{ attemptId }`; 401 unknown user |
| `GET /api/attempt` | `id` | `AttemptView`; 404 unknown |
| `POST /api/test-answer` | `{ attemptId, position (1–30), letter }` | `AnswerResult`; 409 already answered or test completed |
| `POST /api/undo-answer` | `{ attemptId, position (1–30) }` | `AttemptCounters`, slot blank again; 409 answer not wrong or test completed |
| `POST /api/resume-test` | `{ attemptId }` | `{ secondsLeft }`, clock running; 409 completed |
| `POST /api/pause-test` | `{ attemptId }` | `{ isPaused: true }`, clock stopped |
| `POST /api/finish-test` | `{ attemptId }` | `AttemptCounters`, blanks counted as errors; 409 while questions are blank and time is left |
| `POST /api/question-explanation` | `{ questionId, explanation }` | `{ explanation }`, written to the bank file; 404 unknown question |
| `GET /api/my-tests` | — | `AttemptSummary[]`: completed tests, newest first |
| `GET /api/started-tests` | — | `StartedAttemptSummary[]`: tests not completed yet, newest first, with the first unanswered question |

## Pages

| Route | Page |
|-------|------|
| `/` | Landing, CTA to `/test` |
| `/test` | Starts a test, redirects to its question 1 |
| `/test/:attemptId/:question` | One question. Top right: answered/30, errors, timer (red ≤ 5:00). Undo under the answers when the pick was wrong. Below `sm`, a fixed footer holds previous · errors · timer · next instead of the top-right bar. Previous/next; on question 30, next becomes "Finish" (enabled once all 30 are answered — answering never auto-completes, so undo still works). "See result" once completed. The clock runs only while this page is open |
| `/my-tests` | "Started tests" (when any): one card per unfinished test, Continue opens its first unanswered question. Then a grid: "Try a new test" card and one card per completed test (green ≤ 3 errors, else red) |
| `/my-tests/:attemptId` | Review of a completed test |

`/test/**` and `/my-tests/**` render client-side only (`routeRules`), because they need the user id
from localStorage.

## Configuration

`NUXT_DB_PATH`: the SQLite file, default `.data/dgtest.sqlite`. `NUXT_QUESTIONS_PATH`: the bank's
JSON source, rewritten on each saved explanation, default `server/assets/questions.json`. Driver is Node's built-in
`node:sqlite`.

## Key rules / Invariants

1. **A right answer is revealed only once the question is answered, or the test is completed.**
   Answers can't be read from the network tab ahead of time.
2. **A question is answered once, except a wrong one may be undone.** Undo exists for misclicks:
   it blanks the slot and takes the error back, only while the test is open. A right answer is
   final. Trade-off: after an undo the user has already seen the right letter.
3. **A test completes when the user presses Finish (all 30 answered), or when its 30 minutes are
   up.** Answering the 30th never auto-completes, so its undo still works. Only time with the test
   page open counts. The server refuses to close it earlier.
4. **A blank answer is an error once time runs out.** Same as the DGT exam.
5. **Pass is ≤ 3 errors** (`MAX_MISTAKES_TO_PASS`).
6. **Every test is kept.** My tests lists every started and every completed test, not just the latest one.
7. **Test content is never translated.** The DGT examines in Spanish only.
