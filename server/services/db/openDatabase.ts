/// Owns the SQLite connection: opens one per file path, creates the schema on first open.
/// Uses Node's built-in `node:sqlite`, so there is no driver dependency.
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { QUESTIONS_PER_TEST } from '#shared/constants/tests'

/// `q1`…`q30`: one JSON `AttemptSlot` per question of the test.
const QUESTION_COLUMNS = Array.from({ length: QUESTIONS_PER_TEST }, (_, index) => `q${index + 1} TEXT NOT NULL`)

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS tests (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    ${QUESTION_COLUMNS.join(',\n    ')},
    is_completed INTEGER NOT NULL,
    total_answered INTEGER NOT NULL,
    total_errors INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    elapsed_seconds INTEGER NOT NULL DEFAULT 0,
    resumed_at TEXT
  );
  CREATE INDEX IF NOT EXISTS tests_user ON tests (user_id, created_at);
`

/// The old `tests` table held one finished test per row (`test_id`, `answers`). Drop it, data and all.
const DROP_LEGACY_TESTS = `
  DROP INDEX IF EXISTS tests_user_test;
  DROP TABLE tests;
`

/// Timer columns added after release: each one is added to a `tests` table that predates it.
const TIMER_COLUMNS = {
  elapsed_seconds: 'INTEGER NOT NULL DEFAULT 0',
  resumed_at: 'TEXT',
}

function addTimerColumns({ db }: { db: DatabaseSync }): void {
  for (const [name, definition] of Object.entries(TIMER_COLUMNS)) {
    const exists = db.prepare('SELECT 1 FROM pragma_table_info(\'tests\') WHERE name = ?').get(name)
    if (!exists) db.exec(`ALTER TABLE tests ADD COLUMN ${name} ${definition}`)
  }
}

const connections = new Map<string, DatabaseSync>()

export function openDatabase({ path }: { path: string }): { db: DatabaseSync } {
  const existing = connections.get(path)
  if (existing) return { db: existing }

  mkdirSync(dirname(path), { recursive: true })
  const db = new DatabaseSync(path)
  const legacy = db.prepare('SELECT 1 FROM pragma_table_info(\'tests\') WHERE name = \'test_id\'').get()
  if (legacy) db.exec(DROP_LEGACY_TESTS)
  db.exec(SCHEMA)
  addTimerColumns({ db })
  connections.set(path, db)
  return { db }
}
