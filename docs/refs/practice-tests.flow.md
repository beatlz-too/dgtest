# Practice Tests — Flow

> **Execution reference.** The order a practice session happens in, and why that order. For what it
> is made of, see `practice-tests.ref.md`.

Identify the browser → start a test → answer → time up → review.

---

## Identify the browser

```mermaid
sequenceDiagram
  autonumber
  participant L as layout<br>app/layouts/default.vue · test.vue
  participant C as useUserId<br>app/composables/useUserId.ts
  participant E as create-user<br>server/api/create-user.get.ts
  participant S as createUserService<br>server/services/users/createUserService.ts
  L->>C: page mounted
  C->>C: id in localStorage? → done
  C->>E: GET /api/create-user
  E->>S: createUser handler
  S-->>E: { userId }
  E-->>C: store in localStorage
```

This runs on every mount but creates a user only once. Concurrent callers share one request, so a
page that also needs the id never creates a second user.

---

## Start a test

```mermaid
sequenceDiagram
  autonumber
  participant P as /test<br>app/pages/test/index.vue
  participant E as start-test<br>server/api/start-test.post.ts
  participant H as startTest<br>server/handlers/attempts/startTest.ts
  participant Q as pickRandomQuestionsService<br>server/services/questions/
  participant C as createAttemptService<br>server/services/attempts/
  P->>E: POST with x-user-id
  E->>H: userId
  H->>Q: 30 distinct random questions
  H->>C: insert row, q1…q30 unanswered
  H-->>E: { attemptId }
  E-->>P: replace with /test/:attemptId/1
```

The row exists before the first question shows, so its `created_at` is the start of the clock. A
refresh or a different device sees the same time left. If the server answers 401 (it forgot the
user), the page gets a fresh id and starts once more.

---

## Answer

```mermaid
sequenceDiagram
  autonumber
  participant P as question page<br>app/pages/test/[id]/[question].vue
  participant U as useTestAttempt<br>app/composables/useTestAttempt.ts
  participant E as test-answer<br>server/api/test-answer.post.ts
  participant H as answerQuestion<br>server/handlers/attempts/answerQuestion.ts
  participant R as recordAnswerService<br>server/services/attempts/
  P->>U: GET /api/attempt on load
  P->>U: click an answer
  U->>E: { attemptId, position, letter }
  E->>H: already answered or completed? → 409
  H->>R: write slot, count answered/errors
  H-->>E: isCorrect, correctAnswer, counters
  E-->>P: paint green/red, update n/30 and errors
```

The page loads the test fresh on every question, so counters and earlier picks always come from
the row. Answering the 30th question completes the test in the same write. Then the right button
becomes "See result".

---

## Time up

```mermaid
sequenceDiagram
  autonumber
  participant P as question page<br>app/pages/test/[id]/[question].vue
  participant E as finish-test<br>server/api/finish-test.post.ts
  participant H as finishTest<br>server/handlers/attempts/finishTest.ts
  P->>E: timer hits 0:00
  E->>H: 30 min since created_at? (10 s slack for clock drift)
  H->>H: blanks → errors, completed
  E-->>P: go to /my-tests/:attemptId
```

The server checks the time itself, so a test can't be closed early. A test left open past its time
stays incomplete until reopened from "Started tests". The page then sees 0:00 and closes it.

---

## Review

```mermaid
sequenceDiagram
  autonumber
  participant P as my-tests pages<br>app/pages/my-tests/*.vue
  participant E as my-tests · attempt<br>server/api/*.get.ts
  participant H as listMyTests · getAttempt<br>server/handlers/attempts/
  P->>E: GET with x-user-id
  E->>H: userId (, attemptId)
  H-->>E: completed tests / one test, every answer revealed
  E-->>P: cards / review
```

Review uses the same `GET /api/attempt` as the test page. Once a test is completed it returns every
right answer.
