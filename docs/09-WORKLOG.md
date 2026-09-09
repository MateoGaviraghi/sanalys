# 09 — WORKLOG

> The memory that survives between chats. Every build chat **reads §1 first** and **appends one entry to §2 before ending**. Never rewrite an old entry; correct it with a new one. Decisions, gotchas and open questions do not go here — they go to `docs/10-MEMORY.md`; this file records *what happened*, *where we are* and *what comes next*.

## 1. STATE (overwrite this block, nothing else)

| Field | Value |
|---|---|
| Current unit | WU-01a · Repo and tooling — **done** |
| Status | Workspace, both app scaffolds, flat ESLint, empty Vitest suite and CI. Five gates green locally **and on GitHub Actions** (run 34350246293, 43 s, commit `0aed06f`). `main` pushed to `origin`. |
| Last chat | 2026-09-09 · WU-01a (this repository) |
| Waiting on Mateo | Step-by-step approval before each action · pick the next unit (WU-02 is the only unblocked one) |
| Waiting on the client | `docs/00-BRIEF.md` §8 — all rows `PENDIENTE`. CI-05 (account ownership) blocks WU-01b |
| Next action | WU-02 · Database. WU-01b (Vercel projects, previews, rollback, TD-005) stays blocked on CI-05 |
| Do not touch | `sistema-interno/` (parity reference) · `brandign-sanalys/` (source material) · any decision `D-001`–`D-013` |

## 2. Entries (append-only, newest at the bottom)

### 2026-09-09 · Architecture package
- **Unit:** none (pre-build).
- **Done:** audit of the inherited system; identity extracted from the PDF; decisions D-001–D-013; rules extracted to `docs/08-REGLAS-SISTEMA.md`; page inventory; stack pinned; 25 work units ordered; `CLAUDE.md`, `KICKOFF.md`, `docs/00–11` written; `.gitignore` and hookify rules copied.
- **Failed / skipped:** no pricing (`GATE P`) by Mateo's decision; no structural mockups (`GATE S` replaced, D-010).
- **Open for the client:** the 9 code contradictions (CI-01), signature (CI-02), journey (CI-03), real data (CI-04), account ownership (CI-05), counsel (CI-07), Borna licence, NAP, matrículas, photos, copy.
- **Next:** WU-01.

### 2026-09-09 · WU-01a · Repo and tooling
- **Plan stated:** workspace + both Next 16 scaffolds + CI + empty Vitest suite, exact versions from `docs/02-STACK.md`, env names from `docs/06-SEGURIDAD.md` §6 · **GO-AHEAD:** yes (Mateo, 2026-09-09; the 8 extra files were already in the WU-01a list, Vitest 4.1.11 named, unit split into 01a/01b approved)
- **Built:** `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig.base.json`, `eslint.config.mjs`, `vitest.config.ts`, `.github/workflows/ci.yml`, `README.md`, `packages/db/package.json`, `packages/brand/package.json`, and for each of `web/` and `sistema/`: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `next-env.d.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/lib/env.ts` · **Outside the list:** none
- **Versions:** every pin in `docs/02-STACK.md` resolved unchanged on the registry on 2026-09-09 (next 16.3.4, react 19.2.8, typescript 5.9.3, tailwindcss 4.3.3, zod 4.5.4, @t3-oss/env-nextjs 0.13.11, vitest 4.1.11, eslint 10.10.0, eslint-config-next 16.3.4, pnpm 12.3.4). No re-pinning was needed. Types not pinned in the docs: `@types/node` 22.20.1 (Node 22 line, not 26), `@types/react` 19.2.18, `@types/react-dom` 19.2.7.
- **Parity check (sistema/ only):** not applicable — no system screen exists yet; `sistema-interno/` untouched.
- **Design check (web/ only):** not applicable — no design token, font, colour or motion ships in this unit; `src/app/globals.css` is the single line `@import "tailwindcss";`.
- **Tests:** `pnpm test` green with an empty suite (`passWithNoTests`). The four critical tests start at WU-02.
- **Gates:** `pnpm install --frozen-lockfile` · `pnpm typecheck` · `pnpm lint` (0 errors, 0 warnings) · `pnpm test` · `pnpm build` (both apps, static `/` and `/_not-found`) — all green locally. **Not verified on a CI runner**: nothing has been pushed.
- **Secret grep (`S1-06`):** vacuous today — no provider secret exists yet in this environment and no `.env*` file is present. It becomes a real gate at WU-01b/WU-02.
- **Failed / cut:** WU-01b (Vercel projects, preview deploys, rollback drill, TD-005 free-plan limits) not started — blocked on CI-05. `corepack` cannot run the pinned pnpm (G-020), so pnpm 12.3.4 was installed and used directly.
- **Appended to 10-MEMORY:** G-020, G-021, G-022, G-023, G-024, TD-006
- **Next:** WU-02 · Database.

### 2026-09-09 · WU-01a · follow-up (push and command fix)
- **Done:** `docs/07-REPO.md` §4 and `CLAUDE.md` corrected to `pnpm --filter <app> dev` (G-022); commits `40460b8` and `0aed06f` pushed to `origin/main`; CI ran once and was green in 43 s (install --frozen-lockfile, typecheck, lint, test, build).
- **Open:** GitHub annotation — `actions/checkout@v4` and `actions/setup-node@v4` target the deprecated Node 20 and are forced onto Node 24. Bump to `@v5` is a two-line change to `.github/workflows/ci.yml`, not made yet.
- **Next:** WU-02 · Database.

<!-- Template for every chat — copy, fill, append:

### YYYY-MM-DD · WU-NN · <name>
- **Plan stated:** <one line> · **GO-AHEAD:** yes/no (who, when)
- **Built:** <files, in the declared list> · **Outside the list:** none | <file — why, one-line import/type change>
- **Parity check (sistema/ only):** rules §N.x verified one by one; deviations: none | <list with CI-01 answer applied>
- **Design check (web/ only):** stance decisions + motion inventory + budgets respected; screenshots mobile/desktop attached to the PR
- **Tests:** <critical test name> green/red
- **Failed / cut:** <what and why>
- **Appended to 10-MEMORY:** D-/G-/TD-/OQ- ids or "nothing"
- **Next:** <the next unit or the fix pass>
-->
