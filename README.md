# Sanalys

Two surfaces, one repository, one Postgres database.

- `web/` — the public site (`sanalys.com.ar`): treatments, online booking, news, contact.
- `sistema/` — the clinic's internal system (`sistema.sanalys.com.ar`), rebuilt from the
  inherited HTML/Firestore system with its behaviour reproduced verbatim.

Everything about this build was decided before the first line of code. **Read the docs, do not
re-decide them.**

## Where things are written down

| File | What it holds |
|---|---|
| `CLAUDE.md` | How work is done here: read order, session protocol, non-negotiables |
| `KICKOFF.md` | The whole project expanded in one file |
| `docs/00-BRIEF.md` … `docs/08-REGLAS-SISTEMA.md` | Scope, architecture, stack, data, interface, design, security, repo, inherited rules |
| `docs/09-WORKLOG.md` | Where the build is (section 1) and what every chat did (section 2) |
| `docs/10-MEMORY.md` | Decisions `D-`, gotchas `G-`, debt `TD-`, open questions `OQ-` |
| `docs/11-ROADMAP.md` | The 25 work units, each with its declared file list |

`sistema-interno/` is the inherited system, kept read-only as the parity reference until launch.
`brandign-sanalys/` is 2 GB of identity source files, git-ignored, never edited, never renamed.

## Requirements

Node `>=22.16.0` and pnpm `12.3.4`. corepack 0.32 (bundled with Node 22) cannot launch pnpm 12,
so install it directly:

```
npm install --global pnpm@12.3.4
```

## Commands

| Command | Does |
|---|---|
| `pnpm install --frozen-lockfile` | Install exactly what the lockfile says |
| `pnpm --filter web dev` / `--filter sistema dev` | Dev server for one app (pnpm 12 wants `--filter` before the script, see G-022) |
| `pnpm build` | Builds both apps |
| `pnpm typecheck` · `pnpm lint` · `pnpm test` | The blocking gates |

`pnpm db:generate`, `db:migrate`, `db:seed` and the critical tests arrive with WU-02.

## Environment

Variables are read only through `src/lib/env.ts` in each app; the names are fixed by
`docs/06-SEGURIDAD.md` section 6. Values live in the Vercel env store and, locally, in an
untracked `.env.local` per app. **There is no `.env.example` in this repository, by decision.**

## Conventions

`kebab-case` files, `PascalCase` components, one Server Action per file, apps import only
`@sanalys/db` and `@sanalys/brand`. One work unit per branch `wu-NN-short-name`, one PR into
`main`. Full list in `docs/07-REPO.md`.
