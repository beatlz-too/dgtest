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
| Question bank (766, read-only) | `server/assets/questions.json`, typed by `server/assets/questionBank.ts` | `Question` in `shared/types/tests.ts` |
| Users | SQLite `users` | `id` (uuid), `created_at` |
| Tests taken | SQLite `tests` | `Attempt` in `shared/types/attempts.ts` |
| User id | browser localStorage `dgtest:userId` | uuid |

The bank is the DGT magazine tests flattened into one array, with duplicates and malformed
questions removed. Question `id`s are positions in that file.

`tests` columns: `id`, `user_id` → `users`, `q1`…`q30`, `is_completed`, `total_answered`,
`total_errors`, `created_at`. Each `qN` is a JSON `AttemptSlot`: `{ question, answer? }`, holding
the bank id and the user's letter. An older `tests` table (one row per finished test, with
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
| `POST /api/finish-test` | `{ attemptId }` | `{ isCompleted: true }`; 409 while time is left |
| `GET /api/my-tests` | — | `AttemptSummary[]`: completed tests, newest first |
| `GET /api/started-tests` | — | `StartedAttemptSummary[]`: tests not completed yet, newest first, with the first unanswered question |

## Pages

| Route | Page |
|-------|------|
| `/` | Landing, CTA to `/test` |
| `/test` | Starts a test, redirects to its question 1 |
| `/test/:attemptId/:question` | One question. Top right: answered/30, errors, timer (red ≤ 5:00). Previous/next; "See result" once completed |
| `/my-tests` | "Started tests" (when any): one card per unfinished test, Continue opens its first unanswered question. Then a grid: "Try a new test" card and one card per completed test (green ≤ 3 errors, else red) |
| `/my-tests/:attemptId` | Review of a completed test |

`/test/**` and `/my-tests/**` render client-side only (`routeRules`), because they need the user id
from localStorage.

## Configuration

`NUXT_DB_PATH`: the SQLite file, default `.data/dgtest.sqlite`. Driver is Node's built-in
`node:sqlite`.

## Key rules / Invariants

1. **A right answer is revealed only once the question is answered, or the test is completed.**
   Answers can't be read from the network tab ahead of time.
2. **A question is answered once.** Otherwise the user could switch to the right letter after
   seeing it.
3. **A test completes when all 30 questions are answered, or when its 30 minutes are up.** The
   server refuses to close it earlier.
4. **A blank answer is an error once time runs out.** Same as the DGT exam.
5. **Pass is ≤ 3 errors** (`MAX_MISTAKES_TO_PASS`).
6. **Every test is kept.** My tests lists every started and every completed test, not just the latest one.
7. **Test content is never translated.** The DGT examines in Spanish only.
