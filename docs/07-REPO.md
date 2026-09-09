# 07 — REPO

> Folder tree, naming, where each kind of file goes, what is never committed, the scripts each app exposes, deploy and rollback, and the two operational drills (backup restore, hookify).

## 1. Tree

```
sanalys/
  CLAUDE.md · KICKOFF.md · README.md · .gitignore · pnpm-workspace.yaml · package.json · tsconfig.base.json
  .github/workflows/
    ci.yml                  build + typecheck + lint + frozen install, on every push
    backup.yml              daily encrypted pg_dump → R2
  .claude/                  hookify.*.local.md (per machine, git-ignored)
  docs/                     this package (00–08, 10, 11)
  brandign-sanalys/         2 GB of source identity files — git-ignored, reference only; folder name kept as received
  sistema-interno/          the inherited HTML system — kept read-only in the repo until launch as the parity reference; deleted in unit 25
  packages/
    brand/                  tokens.css · fonts/ (Roboto Flex; Borna when licensed) · tailwind.preset.ts · assets/ (SVG logo variants, favicon, pattern)
    db/                     drizzle.config.ts · src/schema/*.ts (one file per table group) · src/queries/ (app) · src/web-queries/ (public, narrow) · src/format.ts · migrations/ · seeds/ · scripts/ (import-firestore.ts, restore-drill.md)
  web/                      Next.js 16 — public site
    src/app/                (pages) · src/components/ · src/actions/ · src/lib/env.ts · public/img/placeholder/
  sistema/                  Next.js 16 — internal system
    src/app/(auth)/sign-in · src/app/(app)/… one folder per screen · src/dal/ (guard.ts + one module per table group) · src/actions/ · src/components/ · src/pdf/ (ported pdf-master templates) · src/lib/env.ts
```

## 2. Conventions

- **Files**: `kebab-case.ts(x)`; components `PascalCase` inside `kebab-case` folders; one Server Action per file in `actions/`; DAL modules named after the table group (`dal/caja.ts`).
- **Imports**: apps import `@sanalys/db` and `@sanalys/brand` only; never each other.
- **Env**: through `src/lib/env.ts` (`@t3-oss/env-nextjs`); no inline `process.env`.
- **Money and time**: `Decimal` and `Date` in UTC in code; formatting only in `packages/db/src/format.ts` and UI components.
- **Spanish literals**: UI strings, WhatsApp templates, PDF texts and validation messages are copied from `docs/08-REGLAS-SISTEMA.md` verbatim, kept in `sistema/src/i18n/es.ts` (one file) so parity can be diffed.
- **Branches**: `main` deploys production for both projects; one branch per work unit `wu-NN-short-name`; PR into `main`; preview deploys per branch on both Vercel projects.
- **Commits**: Conventional style `feat(caja): …`, `fix(agenda): …`, `chore(db): …`; R-class in the PR body.
- **PR template**: What it does · What it does NOT do · Risk class `R0–R3` · Spec reference (`docs/…` section and the WU number) · Files outside the declared list (must be empty or justified) · How to verify · Migration/rollback · Screenshots mobile + desktop for UI.
- **Review**: diff vs. the unit's declared file list first, then `preflight/06` §3 checklist; any file outside the list is a FAIL; two FAIL cycles max, the third rewrites the plan.

## 3. Never committed

`brandign-sanalys/` · `.env*` · `.claude/*.local.md` · `node_modules/` · build output · any dump, export, CSV or PDF containing patient data · any screenshot with real patient data · `.env.example` (banned).

## 4. Scripts (names the build must create; run from the repo root)

| Command | Does |
|---|---|
| `pnpm dev --filter web` / `--filter sistema` | Dev server for one app against a Neon **dev branch** |
| `pnpm build` | Builds both apps (CI) |
| `pnpm typecheck` · `pnpm lint` | Blocking gates |
| `pnpm db:generate` · `pnpm db:migrate` | Drizzle migration files → apply with the direct connection string (manual against prod, after a green deploy) |
| `pnpm db:seed` | Seeds `config` defaults, `salas` and the 8 Drips catalogue |
| `pnpm db:import-firestore <backup.json>` | Unit 24 only |
| `pnpm test` | The named critical tests (`docs/11-ROADMAP.md`) — 3 blocking |

## 5. Environments, deploy, rollback

| Env | Where | DB |
|---|---|---|
| Local | `pnpm dev` | Neon branch `dev` |
| Preview | Vercel preview per branch, both projects | Neon branch per PR (free plan branch limit — verify; fall back to `dev`) |
| Production | Vercel `main`, both projects | Neon `main` |

Rollback: Vercel → project → Deployments → "Promote to production" on the previous deployment; verified once in unit 1 and the steps written here with a screenshot. Schema rollback: migrations are forward-only; a bad migration gets a new migration.

Vercel per-project settings to write down at unit 1: root directory (`web` / `sistema`), Ignored Build Step command (`git diff --quiet HEAD^ HEAD -- ./ ../packages/`), env var names, domains, framework preset.

## 6. Backup and restore drill

- `backup.yml` runs daily 03:30 AR: `pg_dump --format=custom` with `DATABASE_URL_DIRECT` → `age -r $BACKUP_AGE_PUBLIC_KEY` → `aws s3 cp` to the private R2 bucket `sanalys-backups/YYYY/MM/DD.dump.age`. Lifecycle: keep 30 daily, 12 monthly.
- Restore drill (`packages/db/scripts/restore-drill.md`): create a Neon branch → `age -d` with the private key from the client's password manager → `pg_restore` → compare row counts per table with production → delete the branch → record date and counts in `docs/10-MEMORY.md`. Runs before launch and quarterly. A backup that was never restored does not count.

## 7. Hookify rules

Copied to `.claude/` from the architect workspace (block `.env.example`, block recursive delete, warn on sensitive files and skills dir). They are per working directory and git-ignored; a fresh clone re-copies them from `~/Desktop/Arquitecto-software/.claude/`.

## 8. Handover on the last day

Repository transferred to a GitHub organisation the client owns; Mateo removed as owner after the client's admin is confirmed working; every credential rotated and reloaded by the client; access confirmed at zero in writing; no copy of patient data kept.
