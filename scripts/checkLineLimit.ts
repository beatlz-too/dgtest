/// Enforces the hard rule: no `.ts` or `.vue` file under `app/`, `server/`, `shared/` or `scripts/`
/// is longer than 150 lines. Exits non-zero and lists every offender, longest first.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const LIMIT = 150
const ROOTS = ['app', 'server', 'shared', 'scripts']
const EXTENSIONS = ['.ts', '.vue']

function walk({ dir }: { dir: string }): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return walk({ dir: path })
    return EXTENSIONS.some(extension => path.endsWith(extension)) ? [path] : []
  })
}

const offenders = ROOTS.filter(root => existsSync(root))
  .flatMap(root => walk({ dir: root }))
  .map(path => ({ path, lines: readFileSync(path, 'utf8').split('\n').length - 1 }))
  .filter(({ lines }) => lines > LIMIT)
  .sort((a, b) => b.lines - a.lines)

for (const { path, lines } of offenders) console.error(`${path}: ${lines} lines (limit ${LIMIT})`)
if (offenders.length > 0) process.exit(1)
