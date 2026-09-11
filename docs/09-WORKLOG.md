# 09 — WORKLOG

> The memory that survives between chats. Every build chat **reads §1 first** and **appends one entry to §2 before ending**. Never rewrite an old entry; correct it with a new one. Decisions, gotchas and open questions do not go here — they go to `docs/10-MEMORY.md`; this file records *what happened*, *where we are* and *what comes next*.

## 1. STATE (overwrite this block, nothing else)

| Field | Value |
|---|---|
| Current unit | WU-04 · Design — **in progress** (Home, built section by section on the real page) |
| Status | Home built section by section; method and motion bar are D-038. Hero approved by Mateo, including the entrance circle that opens instead of fading (D-042, approved on the real page on 2026-09-11) and the fixes of D-036, D-037, D-039, D-041. Section 2 done and approved: services as sticky stacking cards that open in place with a carousel (D-034), on a white ground, header taking each section's colour, grounds alternating blanco / verde (D-035). Pending from the original WU-04 plan: DripCard, Carousel, CtaBand, to be reconciled with this build. Nothing committed yet. |
| Last chat | 2026-09-11 · WU-04 (Home sections 1 and 2) |
| Waiting on Mateo | Say when to commit the WU-04 work (nothing committed yet, 23 paths dirty on `main`) · Rotate the `sanalys_owner` password (open since 2026-09-09) · Move the age private key off the Desktop into the password manager |
| Waiting on the client | `docs/00-BRIEF.md` §8, all `PENDIENTE`, batched in `docs/12-CLIENT-QUESTIONS.md` (WU-22b), except a question that hard-blocks a unit. CI-08 (Borna) blocks only Borna |
| Next action | Home section 3, on a verde ground, with the method of D-038 — or the commit first, if Mateo says so |
| Do not touch | `sistema-interno/` (parity reference) · `brandign-sanalys/` (source material) · any decision `D-001`–`D-042` |

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
- **Gates:** `pnpm install --frozen-lockfile` · `pnpm build` (both apps static) · `pnpm typecheck` (now four packages) · `pnpm lint` (0/0) · `pnpm test` — green locally and on CI (commit `2b4ccc4`, run 34413542838, success). Secret grep of `.next/static`: nothing to find (no secret exists in this unit).
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

### 2026-09-10 · WU-04 · Home hero — third direction: the wheel
- **Plan stated:** none as a table — Mateo sent the direction in writing ("olvidate de ruleta, de carrusel horizontal, de slider y de fade") and closed with "Mostrame primero cómo queda el hero con esto" · **GO-AHEAD:** that message
- **Built:** `web/src/components/DripWheel.tsx` (new), `web/src/components/Hero.tsx` (rewritten), `web/src/content/drips.ts` (rewritten, 8 Drips → 6, single `suero()` path helper) · **Deleted:** `web/src/components/DripTurntable.tsx`, `web/src/app/prototypes/` (7 files) · **Outside the list:** none
- **Decision:** D-023 — the arc on a wheel, with the three measured numbers (26° step, 1.6-viewport radius, fade tied to the column and not to the angle) and why each one is what it is.
- **Assets:** the six background-free SVGs Mateo referred to do not exist on this machine. Searched: the repo, `brandign-sanalys/sanalys sin comprimir/` in full (including the four extracted zips and both `.ai`/PDF masters), `Desktop` and `Downloads`. Zero `.svg` of a Drip. The hero therefore uses frame 0 of the D-022 renders — transparent, front-facing, and the most realistic image of all six that exists — behind one function so the swap is trivial.
- **Design check:** header per §10 as amended (logo left, links centred, CTA right); counter + hairline bar, no dots; key words in colour, no highlighter; §11 tells re-read against the screenshots.
- **Looked at (G-040):** 1440 resting · 1440 mid-arc at t = 0.30 / 0.55 / 0.80 · 375 resting · 375 mid-arc at t = 0.35 / 0.62 / 0.85 · server HTML checked directly (`curl`): Drip 01 is emitted at `rotate(10deg) … opacity:1`, the other five at `opacity:0` — the resting state does not depend on JavaScript.
- **Not verified:** `prefers-reduced-motion` (the Browser pane cannot emulate that media query — the code path snaps with no arc, but it has not been seen) · real pointer clicks on the arrows timed out in the pane because the window was not in front; the handler and the tween were exercised through a synthetic `click()` and both work.
- **Gates:** `pnpm --filter web typecheck` green. No `lint` script exists in `web/` yet.
- **Found:** G-045 (a grid item with `z-index: auto` makes no stacking context, so the bag passed in front of the H1), G-046 (`width: auto` + Tailwind's `img { max-width: 100% }` collapses an absolutely positioned box to 0 px), G-047 (a screenshot in the same batch can precede the paint).
- **Reported, not fixed:** `next dev` writes `web/AGENTS.md` and `web/CLAUDE.md` on every run. A future chat opening `web/` would read Next's generic agent rules as project instructions. The fix is one line, `agentRules: false` in `web/next.config.ts`, which is outside WU-04's declared file list.
- **Appended to 10-MEMORY:** D-023, G-045, G-046, G-047. **Amended `docs/05`:** §4 (flat still per Drip, turntable parked) and §10 (new "Hero wheel" block).
- **Next:** Mateo's verdict on the hero; then `DripCard.tsx`, `Carousel.tsx`, `CtaBand.tsx`.

### 2026-09-10 · WU-04 · Home hero — autoplay and the real bags
- **Asked for:** "borralos y dale autoplay", plus the folder `Downloads/sueros-sanalys` · **GO-AHEAD:** that message
- **Touched:** `web/src/components/Hero.tsx` (autoplay, pause control, the name now enters with its bag), `web/src/components/DripWheel.tsx` (new aspect ratio, snap-on-complete), `web/src/content/drips.ts` (`suero()` points at the new files), `web/src/components/SplitReveal.tsx` (one guard), `web/public/img/drips/` (12 new files + rewritten `SOURCES.md`, 296 deleted) · **Outside the list:** none
- **Decision:** D-024 — autoplay with its five brakes and the WCAG 2.2.2 pause control; the delivered artwork re-encoded.
- **The delivered SVGs were not vectors:** two base64 PNGs of 1070 x 1470 in an SVG wrapper, 945-1037 KB each. Decoded, recomposed with the mask as alpha, trimmed, put on one common 692 x 1476 canvas, re-encoded. **5.9 MB into 218 KB** for the six, same picture. The SVGs stay as the master; the conversion is documented in `web/public/img/drips/SOURCES.md` and is not a repo script — it is a one-time conversion of a delivered asset.
- **Deleted:** the 288 turntable frames and their WebP stills — 296 files, 7.0 MB. `tools/drips/` still regenerates them.
- **Fixed while looking:** the Drip's name changed in frame zero while the previous bag was still on screen, so for most of the transition the copy did not match the bag. It now fades in at 45 % of the step. Also a stale `gsap.set()` on an empty line set in `SplitReveal.tsx` that was warning on every load; the dev console is clean now.
- **Looked at (G-040):** 1440 resting · 1440 with the autoplay stepping 01 to 02 to 04 unaided, palette following · 1440 mid-transition (name correctly still hidden, outgoing bag on the arc) · 375 resting · 375 mid-arc with both bags on the curve, both vertical · pause button toggling to play.
- **Not verified:** `prefers-reduced-motion` (the pane cannot emulate the media query) · real pointer clicks (the pane times out when the window is not in front; the handlers were exercised synthetically).
- **Gates:** `pnpm --filter web typecheck` green. Dev server restarted clean, no build errors, no GSAP warnings.
- **Found:** G-048 — a hidden Browser pane throttles `requestAnimationFrame` while timers keep running, so GSAP tweens stop interpolating and the hero can be screenshotted with no bag at all. Not real, but a snap-to-target in `onComplete` went in as a safety net.
- **Next:** Mateo's verdict; then `DripCard.tsx`, `Carousel.tsx`, `CtaBand.tsx`.

### 2026-09-11 · WU-04 · Home hero — the transition as drawn, the label's palette, no autoplay
- **Asked for:** a marked-up screenshot, a hand drawing of the transition, and: 4 s ok / `agentRules` yes / patient names out / no autoplay / eyebrow stays / gris "ok, or find the combination that works" · **GO-AHEAD:** the answers to the plan's three questions
- **Touched:** `web/src/components/Hero.tsx`, `web/src/components/DripWheel.tsx`, `web/src/components/Nav.tsx`, `web/src/content/drips.ts`, `web/src/app/globals.css`, `web/next.config.ts`, `web/public/img/drips/` (12 files re-encoded) · deleted `web/AGENTS.md`, `web/CLAUDE.md` · **Outside the list:** `web/next.config.ts` (approved in chat)
- **Decision:** D-025 — supersedes D-023's counter-rotation and D-024's autoplay.
- **Patient names:** the `PACIENTE:` field was found per label by dominant row colour (brightness alone swallowed the whole label on the fluo ones) and the name span repainted row by row with the pill's own colour; `PACIENTE:` and the pill stay. A threshold-based erase left a readable ghost; the flat fill does not. Seam visible only at 3x zoom.
- **Found:** G-049 — `order-first` in a grid changes painting order; the circle covered the bag while the DOM said it was visible.
- **Looked at (G-040):** 1440 resting in verde (01), gris (02) and fluo (03), header following each; 1440 mid-arc (outgoing tilted 45°, passing behind the CTA). 375 resting (verde): bag centred, `‹ 1/6 ›` under it, headline on one line. **Radius corrected after looking:** at `max(42vw, 1.15 × bag height)` both bags were off screen at mid-step and the phone hero stood empty; now 0.8 × bag height, neighbours hidden by opacity (100 % to 50°, 0 at 85°). The 375 mid-arc frame could not be captured — the pane returns the previous frame after a DOM write — so it was checked on the element rectangles instead: at 45° the outgoing bag's box spans x −237 to 80 and the incoming 346 to 663 on a 375 viewport, both at full opacity.
- **Gates:** `pnpm --filter web typecheck` green, browser console clean, no `AGENTS.md` regenerated on `next dev`.
- **Next:** Mateo's verdict; 375 screenshots; then `DripCard.tsx`, `Carousel.tsx`, `CtaBand.tsx`.

### 2026-09-11 · WU-04 · Home hero — polish per /diseno (D-026)
- **Asked for:** GSAP fluid "like a premium site", headline on ONE line, 3D animated buttons, animated links, bag more centred, giant names readable in full, no white band on mobile, a real GSAP mobile menu. "These are /diseno rules." · **GO-AHEAD:** "GO-AHEAD, sí" (plan table, including `docs/PRODUCT.md`)
- **Skills used:** `/diseno` -> `impeccable` (polish, animate, brand register, init for PRODUCT.md), `motion-web-senior` (motion-language, recipes, performance, anti-patterns), `tailwindcss-mobile-first`, lib `animate`, lib `find-animation-opportunities`, `ui-ideas` (Magnetic Button, Flip Button).
- **Touched:** `web/src/components/Hero.tsx`, `web/src/components/DripWheel.tsx`, `web/src/components/Nav.tsx`, `web/src/components/BotonReserva.tsx` (new), `web/src/content/drips.ts`, `web/src/app/globals.css`, `docs/PRODUCT.md` (new) · **Outside the list:** none beyond the approved plan.
- **Decision:** D-026. Found: G-050 (SplitText mask hides headline overflow from `scrollWidth`), G-051 (`flex` in vertical writing mode glues words into one column).
- **Fixed while looking:** the giant name rendered as one glued column ("EscudoAntioxidante") and was cut at the section bottom; the headline was 5 px too wide at 1024 and cut at 375; the first bag did not paint on the first phone load with `decoding="async"` (the active bag is `sync` again).
- **Looked at (G-040):** 1440 resting (verde) and after a step (gris, header included), mid-flood frame; 1024 resting; 375 resting with the bag, headline on one line, 3D button; 375 menu open (circle fully open, links, button, focus on the first link, scroll locked). Element geometry checked by script where the pane returned stale frames.
- **Not verified:** hover states (the pane does not render `:hover` from a synthetic pointer); `prefers-reduced-motion` (the pane cannot emulate it); real-device frame rate.
- **Gates:** `pnpm --filter web typecheck` green; browser console without errors. `web/` has no `lint` script yet (`pnpm --filter web lint` reports none).
- **Next:** Mateo's verdict on the real page; then `DripCard.tsx`, `Carousel.tsx`, `CtaBand.tsx`.

### 2026-09-11 · WU-04 · Home hero — entrance, slower motion, layout fixes (D-027)
- **Asked for:** (screenshots from his Chrome at 1920) giant name must not skip a line; headline covered by the image, move the bag right; the page "bugs" on entry and nothing comes in fluid and synchronised; all GSAP slower on mobile and desktop.
- **Touched:** `web/src/components/Hero.tsx`, `web/src/components/SplitReveal.tsx`, `web/src/components/DripWheel.tsx`, `web/src/components/Nav.tsx`, `web/src/app/globals.css`; `web/src/app/layout.tsx` touched and restored (the head script was tried and removed, G-053) · **Outside the list:** none.
- **Decision:** D-027. Found: G-052 (pane emulation resolves svh against the real window), G-053 (head script to gate the entrance costs a hydration error).
- **Looked at (G-040):** 1920 resting: headline 648 px column not exceeded, bag starts at x 1224 with the headline ending at 948, giant name 88-442 inside the section; 1440 at 1 s into the entrance (bag arriving tilted through the wheel) and at the end; 375 resting (bag, one-line headline, single-column giant name) and menu open (X at 45°/-45°, circle fully open). After the entrance, 0 of 12 `[data-intro]` elements left hidden. Console: no errors on a fresh tab.
- **Not verified:** frame rate on a real phone; hover states and reduced motion (the pane renders neither).
- **Gates:** `pnpm --filter web typecheck` green.
- **Next:** Mateo's verdict in his own browser; then `DripCard.tsx`, `Carousel.tsx`, `CtaBand.tsx`.

### 2026-09-11 · WU-04 · Home hero — client's highlighter on "estar bien." (D-028)
- **Asked for:** the client wants the slogan as the identity sets it: "estar bien." bold on the highlighter box (photo of both versions, on fluo and on verde).
- **Touched:** `web/src/components/Hero.tsx`, `web/src/components/Highlight.tsx` (comment), `web/src/content/drips.ts` (`hlFondo` / `hlTexto` in each palette), `web/src/app/globals.css` (resting values) · **Outside the list:** none.
- **Decision:** D-028, amends docs/05 §1.1 for the hero headline only.
- **Looked at (G-040):** 1440 in verde, gris and fluo (box and text swap with the palette); text inside its column at 375, 1024 (430 px), 1440 (620 px) and 1920 (648 px), measured on the live page.
- **Gates:** `pnpm --filter web typecheck` green.
- **Next:** Mateo's and the client's verdict; then `DripCard.tsx`, `Carousel.tsx`, `CtaBand.tsx`.

### 2026-09-11 · WU-04 · Home hero — outgoing-bag flash and mobile flood stall (D-029)
- **Asked for:** two bugs. Desktop: during a step the leaving bag shows up for an instant at the bottom left. Phone: the colour flood reaches part of the screen, stalls, then the rest appears at once.
- **Touched:** `web/src/components/DripWheel.tsx`, `web/src/components/Hero.tsx` · **Outside the list:** none.
- **Root causes and fixes:** D-029 (React re-applying final styles over tween-owned values; per-layer flood radii). Found: G-055.
- **Checked:** by script on the live page, at 1440 and 375: the three flood layers share one centre on screen (header and page at the same point, hero offset by the 64 px header), and no runtime errors across steps. The pane does not advance WAAPI or rAF while it is not painting (G-048), so the timing itself has to be judged in a real browser.
- **Gates:** `pnpm --filter web typecheck` green.
- **Next:** Mateo checks both bugs in his Chrome, desktop and phone.

### 2026-09-11 · WU-04 · Home hero — colour flood on the compositor (D-030)
- **Asked for:** desktop fixed; on the phone the flood still stops part-way and then everything paints at once.
- **Touched:** `web/src/components/Hero.tsx`, `web/src/components/Nav.tsx` · **Outside the list:** none.
- **Decision:** D-030. Found: G-056.
- **Checked:** by script on the live page at 375: the three layers (page, header, hero) each hold one disc with the same diameter and the same centre on screen, animated as `scale(0) -> scale(1)`; no runtime errors. As before, the pane cannot show the timing (G-048): the phone has to be judged on a phone.
- **Gates:** `pnpm --filter web typecheck` green.
- **Next:** Mateo checks the flood on his phone.

### 2026-09-11 · WU-04 · Real-device check
- Mateo, on his phone: the colour flood now runs to the end without stalling (D-030 confirmed). Desktop outgoing-bag flash already confirmed fixed (D-029).
- **Next:** DripCard, Carousel, CtaBand; the hero work is still uncommitted.

### 2026-09-11 · WU-04 · Home hero — fixed value proposition, treatment name by the bag (D-031)
- **Asked for:** the treatment detail next to the bag; under the headline on the left, a fixed "who we are and what we came to solve". Mateo sent the client's positioning, voice rules and four real photos of the space.
- **Touched:** `web/src/components/Hero.tsx`; docs 14 (§9, client positioning), 00 (CR-01 partial), 10, 09 · **Outside the list:** none.
- **Copy:** only the client's words, tightened (docs/14-MARCA §9). Voice checked against their "hablamos así / no hablamos así".
- **Next:** Mateo's verdict on the page; the space photos need to be added as files before the "Espacio" section.

### 2026-09-11 · WU-04 · Home hero — value proposition as hook + points (D-032)
- **Asked for:** the left text had too many line breaks and a heading-like lead; bullets or something nicer to read, reduced to a hook.
- **Touched:** `web/src/components/Hero.tsx`; docs 14 (§9 usage line), 10, 09 · **Outside the list:** none.
- **Next:** Mateo's verdict; then the next Home section.

### 2026-09-11 · WU-04 · Home section 2 — services bento (D-033)
- **Asked for:** a section showing the services; Mateo chose Magic UI's Bento Grid; responsive, full width, fitting the screen on desktop and phone with a little air, playing with sizes · **GO-AHEAD:** "GO-AHEAD, sí"
- **Touched:** `web/src/components/Servicios.tsx` (new), `web/src/content/servicios.ts` (new), `web/src/app/page.tsx`, `web/src/app/globals.css` (link classes moved into `@layer components`); docs 10, 14, 09 · **Outside the list:** `globals.css`, to fix G-057.
- **Decision:** D-033. Found: G-057.
- **Looked at (G-040):** 1440: section exactly one screen (836 px under the 64 px header), four cards at 336 px each with 134 px of animated background and 202 px of text, no overlap; 375 checked by script and screenshot.
- **Gates:** `pnpm --filter web typecheck` green.
- **Next:** Mateo's verdict; then the next Home section. `/tratamientos/` still has to exist before launch.

### 2026-09-11 · WU-04 · Home section 2 — services as stacking cards (D-034)
- **Asked for:** replace the bento with Skiper16's sticky stacking cards rebuilt in GSAP; big on desktop and phone; an opaque band naming the service; opening a card enlarges it in place with the long description, "Reservar este servicio" and a photo carousel; a title that says these are the services · **GO-AHEAD:** "GO-AHEAD, sí"
- **Touched:** `web/src/components/Servicios.tsx` (rewritten), `web/src/content/servicios.ts` (rewritten), `web/src/lib/gsap.ts` (registers Flip, same gsap package, nothing installed); docs 10, 14, 09.
- **Decision:** D-034 (supersedes D-033). Found: G-058.
- **Looked at (G-040):** 1440: closed card 1267×666, open 1354×720 (photo left 677, panel right 677), stack scrub measured mid-way (first card at 0.93 and 45 % dark, second at 0.98), carousel went 01 → 02 in 6 s, Escape closes and restores the card size. 375: closed card 345×568, open 375×666 with the photo 240 px and the button at 674–722 inside the card's 746 bottom, the text scrolling inside the panel; the next card closed the open one by itself at 50 % of the viewport; focus returns to "Abrir"; no horizontal overflow; console clean. Reduced motion not emulated in the pane (code path only).
- **Gates:** `pnpm --filter web typecheck` green.
- **Next:** Mateo's verdict on the real page; then section 3 of the Home. `/tratamientos/` and real photos (CR-01) still pending.

### 2026-09-11 · WU-04 · Header colour per section, white services, header air, hero circle (D-035, D-036)
- **Asked for:** a header that reads as transparent by taking the colour of the section under it (it stayed grey over everything after Drip 02); services on white, then sections alternating verde / blanco; in the hero, the circle cut by the header on desktop and "Reservar turno" too close to the edge when the header compacts · **GO-AHEAD:** "1 color / 2 no / 3 GO-AHEAD, sí" (header in the section colour, no workflow)
- **Touched:** `web/src/components/Nav.tsx`, `web/src/components/Hero.tsx`, `web/src/components/Servicios.tsx`, `web/src/content/servicios.ts`, `web/src/app/globals.css` (`--head-h` 72, `--head-h-compact` 64: not in the plan table, needed for D-036); docs 05, 09, 10.
- **Decisions:** D-035, D-036. Found: G-059, G-060.
- **Looked at (G-040):** the Browser pane was hidden, so headless Chromium through Playwright (G-060), screenshots at 1440×900 and 375×812. Header 72 px with 12/12 px of air around the button, compact 64 with 8/8 (phone: 14/14 and 10/10 around the menu button). Circle 650 px at 1440 with 24 px under the header (341 px on the phone). Hero on Drip 02 → header rgb(98, 104, 110); services title and cards → white; back to the top → grey again with no inline variables left. Protocolos (verde band) opened with its button inside the card at both widths. Console clean.
- **Found, not fixed:** the brand renders of the bags in the Protocolos carousel still carry a handwritten patient name on the label (drip-01, hero-drips); Mateo decides whether to erase them like the hero bags.
- **Gates:** `pnpm --filter web typecheck` green.
- **Next:** Mateo's verdict; Home section 3 on verde.

### 2026-09-11 · WU-04 · Card scrollbar, hero entrance flash, halo timing (D-037)
- **Asked for:** remove the small grey bar that appeared when opening a services card; on reload the Drip name flashed in fluo under the bag, and the circle appeared well before everything else and too fast. Patient names on the renders: "no hace falta" · **GO-AHEAD:** bug fixes on approved work, asked for in the same message.
- **Touched:** `web/src/components/Servicios.tsx` (detail panel without a scrollbar, faded edge at every width), `web/src/components/Hero.tsx` (Drip name lines also hidden with opacity; halo at 0.50 s, 2.6 s `sine.inOut`); docs 09, 10.
- **Decision:** D-037. Found: G-061, G-062.
- **Looked at (G-040):** headless Chromium (G-060) at 1440 and 375, the entrance sampled from 30 to 3400 ms after `intro-listo`: Drip name at opacity 0 until 1.0 s and 0.8 at 1.34 s, caption crops empty before it rises; halo 6 % at 0.94 s, 50 % at 1.85 s, full at about 3.1 s; bag 19 % at 0.64 s. Detail panel reports `scrollbar-width: none` with the mask on. Console clean.
- **Gates:** `pnpm --filter web typecheck` green.
- **Next:** Mateo's verdict; Home section 3 on verde.

### 2026-09-11 · WU-04 · Close of the session — Home sections 1 and 2 (D-038)
- **Done in this chat:** the services section rebuilt as sticky stacking cards that open in place with a carousel (D-034); the header that takes the colour of each section, with grounds alternating blanco / verde (D-035); header 72 → 64 px with air around the booking button and a hero circle that no longer touches it (D-036); the card's scrollbar removed and the hero entrance fixed — no fluo flash, halo entering with the bag (D-037); and the working method and the motion bar written down (D-038).
- **Files:** `web/src/components/Servicios.tsx`, `web/src/components/Nav.tsx`, `web/src/components/Hero.tsx`, `web/src/content/servicios.ts`, `web/src/lib/gsap.ts`, `web/src/app/globals.css`; docs 05, 09, 10, 14.
- **Skills:** `web-distintiva`, `ui-ideas`, `motion-web-senior`, loaded at the start of the session.
- **Looked at (G-040):** 1440 and 375 for every change; headless Chromium once the Browser pane was hidden (G-060); screenshots sent to Mateo.
- **Gates:** `pnpm --filter web typecheck` green after each change. Nothing committed, on `main`, working tree dirty.
- **Mateo's verdict:** hero approved; services, header and grounds "lo demás está genial"; the patient names on the bag renders stay as they are.
- **Next:** Home section 3 on a verde ground with the method of D-038; then reconcile DripCard / Carousel / CtaBand with the section-by-section build; ask Mateo when to commit.

### 2026-09-11 · WU-04 · The halo grows on every Drip step (D-039)
- **Asked for:** "cuando voy pasando cada tratamiento en el hero, cada uno debería hacer el movimiento del círculo en inmersión como el primero; no lo hace, directamente aparece así de la nada" · **GO-AHEAD:** asked for in the same message, before committing.
- **Touched:** `web/src/components/Hero.tsx` (`terminarInundacion` grows the halo when the flood layer starts to fade, and kills that growth if another step interrupts); docs 09, 10.
- **Decision:** D-039.
- **Looked at (G-040):** headless Chromium (G-060) at 1440 and 375, two steps sampled every few hundred ms: during the step the halo holds at 1 / 1 under the flood; at 1.75 s it restarts at scale 0.84 with opacity 0, reaches 50 % at 2.6 s and 1 / 1 at 3.9 s, with the new ground already written (verde → gris → fluo). Two steps in a row leave it at 1 / 1, not half-way. Console clean.
- **Gates:** `pnpm --filter web typecheck` green. Still nothing committed.
- **Next:** Mateo looks at the steps on the real page; then Home section 3 on verde, and the commit when he says so.

### 2026-09-11 · WU-04 · Correction to the entry above — the halo step growth is 1.5 s
- **Asked for:** "quiero un poquito, no tanto, un poquito mas rapido" about the circle growing on each Drip step.
- **Touched:** `web/src/components/Hero.tsx` (2 s → 1.5 s, same `sine.inOut`); D-039 in `docs/10-MEMORY.md` updated with the new numbers.
- **Looked at (G-040):** headless Chromium (G-060) at 1440 and 375, two steps: the halo restarts at 1.75 s, 25 % at 2.1 s, 74 % at 2.6 s, complete at 3.2 s (was 3.9 s). Two steps in a row still end at 1 / 1. Console clean.
- **Gates:** `pnpm --filter web typecheck` green. Nothing committed.
- **Next:** Mateo looks at it; then Home section 3 on verde, and the commit when he says so.

### 2026-09-11 · WU-04 · Correction — the halo grows inside the step, in sync with everything else
- **Asked for:** "tarda porque todo aparece un poco mas rapido, debe estar sincronizado con la aparicion de todo".
- **Touched:** `web/src/components/Hero.tsx` (the growth moved out of `terminarInundacion` and into the step timeline at `DURACION_PASO - 0.3`, 0.9 s `sine.out`; the halo is cleared when a new step starts); D-039 in `docs/10-MEMORY.md` rewritten with the new numbers.
- **Broke and fixed on the way:** inserting the tween split the timeline's chain and left `Hero.tsx` with a syntax error (`TS1128`); caught by `pnpm --filter web typecheck` before any report.
- **Looked at (G-040):** headless Chromium (G-060) at 1440 and 375, two steps: growth starts at 1.3 s hidden under the disc, 37 % at 1.5 s, 73 % at 1.76 s, complete at 2.15 s, against 3.2 s before; two steps in a row end at 1 / 1. Console clean.
- **Gates:** `pnpm --filter web typecheck` green. Nothing committed.
- **Next:** Mateo looks at it; then Home section 3 on verde, and the commit when he says so.

### 2026-09-11 · WU-04 · Correction — the halo step growth is 0.7 s, starting earlier
- **Asked for:** "un poco mas rapido" again, about the circle on each Drip step.
- **Touched:** `web/src/components/Hero.tsx` (start moved to `DURACION_PASO - 0.45`, tween 0.9 s → 0.7 s, same `sine.out`); D-039 in `docs/10-MEMORY.md` updated with the new numbers and with what his three "faster" corrections taught.
- **Looked at (G-040):** headless Chromium (G-060) at 1440 and 375, two steps: growth starts at 1.15 s hidden under the disc, 73 % at 1.51 s, 98 % at 1.76 s, whole by about 1.85 s, right as the colour layer finishes fading; two steps in a row end at 1 / 1. Console clean.
- **Gates:** `pnpm --filter web typecheck` green. Nothing committed.
- **Next:** Mateo looks at it; then Home section 3 on verde, and the commit when he says so.

### 2026-09-11 · WU-04 · The colour circle opens in 1.1 s, the bag's arc stays at 1.6 s (D-040)
- **Asked for:** "no, sigue igual de lento abriendose el circulo, debe ser un poco mas rapido" — said after two speed-ups of the halo alone, which is what told me he was watching the flood, not the halo.
- **Touched:** `web/src/components/Hero.tsx` (`DURACION_INUNDACION` = 1.1 s drives the disc, `tCambio`, the palette tween and the halo's start; `DURACION_PASO` still drives the wheel at 1.6 s); docs 09, 10.
- **Decision:** D-040, which amends D-026 (flood and wheel no longer share a duration). D-039 updated: the halo now hangs off the flood.
- **Looked at (G-040):** headless Chromium (G-060) at 1440 and 375, two steps: halo at 36 % by 0.81 s and complete by 1.35 s, new ground written by 1.5 s, flood layer gone before 1.76 s (was 2.05 s), against a step that ended at 2.15 s two changes ago. Two steps in a row end at 1 / 1. Console clean.
- **Gates:** `pnpm --filter web typecheck` green. Nothing committed.
- **Next:** Mateo looks at the six Drips; then Home section 3 on verde, and the commit when he says so.

### 2026-09-11 · WU-04 · The circle he meant was the one on load (D-041, reverts D-040)
- **Asked for:** "no esta super rapido, no es nada fluido; el problema era que nos mal entendimos y vos hiciste el de todos menos el de primero, cuando entras a la pagina, entonces nunca veia y vos nunca actualizabas ese".
- **What went wrong:** four rounds of "un poco mas rapido" were spent on the step's circle — halo after the flood, halo inside the flood, then the flood itself at 1.1 s (D-040) — while he was reloading the page and watching the entrance halo, left at 2.6 s. The step ended up too fast and no longer fluid.
- **Touched:** `web/src/components/Hero.tsx` (`DURACION_INUNDACION` removed, flood back to `DURACION_PASO` 1.6 s and tied to the wheel as in D-026; step halo 0.9 s from `DURACION_PASO - 0.3`; entrance halo 2.6 s → 1.8 s); docs 09, 10 (D-040 marked reverted, D-039 renumbered timings, D-041 written with the rule).
- **Decision:** D-041, which reverts D-040 and amends D-037.
- **Looked at (G-040):** headless Chromium (G-060) at 1440 and 375. Entrance: halo 11 % at 0.93 s, 42 % at 1.34 s, 82 % at 1.84 s, whole by about 2.3 s (was 3.1 s), bag at 87 % and Drip name at 80 % by 1.34 s, no flash before the name rises. Step: halo 37 % at 1.5 s, 73 % at 1.75 s with the new ground written, 99 % at 2.11 s, two steps in a row ending at 1 / 1. Console clean.
- **Gates:** `pnpm --filter web typecheck` green. Nothing committed.
- **Next:** Mateo reloads and looks at the entrance; then Home section 3 on verde, and the commit when he says so.

### 2026-09-11 · WU-04 · The entrance circle opens instead of fading (D-042)
- **Asked for:** "no no me gusta nada, no parece nada fluido, es super feo" about the entrance circle after D-041 changed only its duration.
- **What I did differently:** stopped tuning the number and looked at the frames myself (full-viewport captures at 300, 600, 900, 1300, 1800 ms). The defect was the property being animated, not the timing: a 650 px hard-edged disc rising in opacity reads as a stain.
- **Touched:** `web/src/components/Hero.tsx` (halo starts at `scale: 0.2`, opacity resolved in 0.3 s while it is a dot, size 0.2 → 1 in 1.7 s `power2.out` from 0.30 s); docs 09, 10.
- **Decision:** D-042, amending D-037 and D-041.
- **Looked at (G-040):** headless Chromium (G-060) at 1440 and 375: opaque by 0.70 s at 58 % size, 80 % at 1.00 s, 95 % at 1.40 s with the bag at 88 % and the name at 83 %, settled by about 2.0 s; no translucent frame at any sample. Frames sent to Mateo. Console clean.
- **Gates:** `pnpm --filter web typecheck` green. Nothing committed.
- **Next:** Mateo reloads and judges the entrance; then Home section 3 on verde, and the commit when he says so.

### 2026-09-11 · WU-04 · Mateo approved the hero entrance (D-042)
- **Verdict:** "si", on the real page, after reloading. The entrance circle that opens (D-042) and the steps at their fluid timing are both accepted; sections 1 and 2 of the Home are approved.
- **Open:** nothing on these two sections. The commit is still pending on his word.
- **Next:** Home section 3 on a verde ground, with the method of D-038.
