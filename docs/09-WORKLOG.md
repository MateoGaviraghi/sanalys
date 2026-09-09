# 09 — WORKLOG

> The memory that survives between chats. Every build chat **reads §1 first** and **appends one entry to §2 before ending**. Never rewrite an old entry; correct it with a new one. Decisions, gotchas and open questions do not go here — they go to `docs/10-MEMORY.md`; this file records *what happened*, *where we are* and *what comes next*.

## 1. STATE (overwrite this block, nothing else)

| Field | Value |
|---|---|
| Current unit | WU-03 · Brand package — **done** |
| Status | `@sanalys/brand` live: `tokens.css` (docs/05 §2 verbatim + Tailwind mapping + `highlight` / `type-display` / `ground-*` utilities + inherited `--sys-*`), Roboto Flex self-hosted with a metric-matched Arial fallback, 11 SVG assets traced from the PDF, `tailwind.preset.ts`, README. Both apps import it and render a sample page; build, typecheck, lint and test green; CLS 0 on four views. `docs/05` §3 closed (D-015). Borna stays out until CI-08 (D-016). Committed and pushed; CI status in the entry below. |
| Last chat | 2026-09-09 · WU-03 |
| Waiting on Mateo | **Rotate the `sanalys_owner` password** (carried from WU-02) · move the age private key off the Desktop into the password manager (carried) · pick the next unit · say whether `docs/05` §2.2 gets the one-line amendment that points to D-016 (G-033) |
| Waiting on the client | `docs/00-BRIEF.md` §8, all `PENDIENTE`. CI-05 blocks WU-01b. **CI-08 (Borna web licence — atipo, pay what you want)** blocks Borna in the brand package. OQ-13 (salas and session timeout) blocks the booking calendar of WU-08 |
| Next action | WU-04 · Design (client approves look and structure in writing), or WU-01b when CI-05 arrives |
| Do not touch | `sistema-interno/` (parity reference) · `brandign-sanalys/` (source material) · any decision `D-001`–`D-016` |

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

### 2026-09-09 · WU-02 · Database
- **Plan stated:** the unit was cut into seven steps, each approved separately by Mateo · **GO-AHEAD:** yes (Mateo, 2026-09-09, step by step)
- **Built:** `packages/db/` — `drizzle.config.ts`, `tsconfig.json`, `src/schema/*.ts` (12 files, 28 tables), `src/format.ts`, `src/queries/*`, `src/web-queries/*`, `migrations/0001_init.sql` (+ `meta/`), `seeds/*.ts`, `scripts/apply-migration.mjs`, `scripts/restore-drill.md`, `tests/sillon.test.ts`; `.github/workflows/backup.yml`; root and package scripts for `db:generate`, `db:migrate`, `db:seed`.
- **Outside the declared list:** `packages/db/tsconfig.json`, `scripts/apply-migration.mjs`, `tests/sillon.test.ts`, `migrations/meta/*`, and edits to the root and package `package.json` and `vitest.config.ts` — every one named to Mateo and approved before writing.
- **Database:** Neon project `sanalys` (`polished-dawn-31392247`), Sao Paulo, Postgres 17, on Mateo's org (D-014). 28 tables owned by `sanalys_migrate`, 1 view, 24 triggers, 1 EXCLUDE, 21 FKs, 49 indexes, 2 extensions, 13 `config` keys and the 8 Drips. `deudas` deliberately absent (OQ-08); no `salas` seeded (OQ-13).
- **Critical test 1:** green. Two concurrent bookings of one chair, exactly one enters; the second chair stays free; a cancelled booking frees its chair. It skips itself without a database, so CI stays green.
- **Backup:** `backup.yml` ran end to end (46 s); `daily/2026/09/09.dump.age`, 83 262 bytes, encrypted, in R2. Lifecycle rules applied: 30 days for `daily/`, 365 for `monthly/`. **Restore drill done the same day and passed** — details in `docs/10-MEMORY.md`.
- **What running it for real found:** four defects invisible on paper. G-030 (Postgres 16 grants the creator ADMIN but not SET, so the ownership transfer needs `WITH SET TRUE`), **G-031 (every role created from the Neon console is a member of `neon_superuser`: a console-created `sanalys_web` could read `pacientes` and `sanalys_app` could edit signed consents — every grant in the migration was decorative until all three roles were recreated by the migration)**, G-032 (`pg_dump` could not read the bookkeeping schema), plus `pg_dump` 16 refusing a 17 server on the runner.
- **Failed / cut:** nothing cut. The database was wiped and re-applied three times to keep it identical to the file.
- **Appended to 10-MEMORY:** G-026 to G-032, TD-006, OQ-12, OQ-13, D-014, and the restore drill record.
- **Next:** WU-03 · Brand package. WU-01b (Vercel) stays blocked on CI-05.

### 2026-09-09 · WU-03 · Brand package
- **Plan stated:** the unit cut into six steps (toolchain, tokens + fonts + preset, SVG assets, README + docs/05 §3, sample pages + gates + screenshots, close), each approved separately · **GO-AHEAD:** yes (Mateo, 2026-09-09, step by step; three questions answered before it: install pnpm 12.3.4 globally — yes; display weights — the ones the branding folder uses (D-016); `tailwind.preset.ts` as a typed token export — yes)
- **Built:** `packages/brand/tokens.css`, `packages/brand/tailwind.preset.ts`, `packages/brand/fonts/{fonts.css, roboto-flex-latin-opsz.woff2, OFL.txt}`, `packages/brand/assets/` (11 SVG: `isotype-*`, `logo-horizontal-*`, `logo-stacked-*` × verde/fluo/blanco, `favicon.svg`, `pattern-tile.svg`), `packages/brand/README.md` · **Outside the list:** `packages/brand/package.json` (exports, typecheck) and `packages/brand/tsconfig.json` (new) — workspace wiring; `web/package.json`, `sistema/package.json`, `pnpm-lock.yaml` — `@sanalys/brand: workspace:*`; `web/src/app/{globals.css,page.tsx}`, `sistema/src/app/{globals.css,page.tsx}` — the sample pages the unit's Done asks for; `docs/05-DISENO.md` §3 — the `{{PENDIENTE}}` it asks to close. Every one named in the plan and approved before writing.
- **Sources read:** identity PDF, all 40 pages (colour values p.16, typography p.18, slogan p.12–14, lockups p.5/8/11, pattern p.20, Drip labels p.28); the OKLCH values of docs/05 §2.1 recomputed from the PDF hex values and found identical; the seven documented contrasts recomputed and found identical; Fontsource 5.3.0 checked on the registry (OFL-1.1, published 2026-07-19); Borna's OTF name table read (atipo, 2023, four weights, no Light).
- **Parity check (sistema/ only):** the `--sys-*` block copies `theme.css` literally (glass .03, borders .06/.1/.12, `--fluo-dim` .08, modal `#0f2d27`, radii 18/20/10/6, shadow `0 16px 40px rgba(0,0,0,.4)`, sidebar 72 px, badge and turno-state colours from docs/08). Deviation from the doc, not from the code: G-034 (cards are 18 px in the code, "20 px" in docs/05).
- **Design check (web/ only):** tokens exactly as docs/05 §2 (values, names, scale endpoints, radii, durations, easing); three grounds + gris + highlighter implemented as `ground-*` / `highlight`; no motion added (none in this unit's inventory); screenshots at 1440 and 375 for both apps sent to Mateo as files (not committed). CLS measured 0 on the four views in production mode; Roboto Flex loaded with the size-adjusted fallback; no horizontal scroll at 375.
- **Tests:** no critical test belongs to this unit; `pnpm test` green (3 passing, from WU-02).
- **Gates:** `pnpm install --frozen-lockfile` · `pnpm build` (both apps static) · `pnpm typecheck` (now four packages) · `pnpm lint` (0/0) · `pnpm test` — green locally. Secret grep of `.next/static`: nothing to find (no secret exists in this unit).
- **Found while building:** the global pnpm had drifted back to 9.15.4 (G-035); Borna has no Light and the PDF pairs Regular + Bold (G-033 → D-016); the inherited cards are 18 px, not 20 (G-034); the PDF highlighter box overlaps the previous line at the 0.95 headline leading, fixed with a font-independent box and left for WU-04 to settle (G-036); what Next 16 + Turbopack + Tailwind 4 accept from a workspace package (G-037); Edge headless clamps its window to ~500 px, so the 375 px screenshots were taken through the DevTools protocol with device-metrics emulation (scratch script, not in the repo).
- **Failed / cut:** nothing cut. Borna not wired (CI-08 pending, by design). Font preload `<link>` is left to WU-05/WU-12, whose declared lists own the root layouts. A `.claude/launch.json` (web 3000 / sistema 3001 with `next start`) was used for the previews and deleted afterwards to keep the tree at the declared list; add it to `docs/07-REPO.md` if wanted.
- **Appended to 10-MEMORY:** D-015, D-016, G-033, G-034, G-035, G-036, G-037
- **Next:** WU-04 · Design. WU-01b (Vercel) stays blocked on CI-05. When CI-08 arrives, D-016 lists the four edits that bring Borna in.

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
