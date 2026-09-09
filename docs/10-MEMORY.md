# 10 — MEMORY

> Append-only log. Decisions `D-NNN` (with alternatives and a reopen clause), gotchas `G-NNN`, debt `TD-NNN`, open questions `OQ-NN`. Never rewrite a superseded entry; add a new one that supersedes it.

## Decisions

### D-001 · 2026-09-09 · One repo, two Next.js apps, two Vercel deploys, subdomain for the internal system
Rationale: origin isolation for health data; independent blast radius; one place to look. Alternatives: single deploy (rejected: shared origin and deploy risk); two repos (rejected: two CIs, duplicated schema). Reopen if: a second team takes over the internal system.

### D-002 · 2026-09-09 · Postgres on Neon replaces Firestore
Rationale: relational domain with money, slots and audit; invariants in the database; the workspace doctrine rejects Firestore for this shape; per-document read pricing punishes the inherited list views. Alternatives: stay on Firestore (rejected: cannot express the invariants, does not fix authz); Postgres on Railway (rejected: paid, DB and compute on the same host); Supabase (vetoed by the operator: free-tier pause after inactivity). Reopen if: never for the DB engine; the host reopens if Neon's free plan removes a feature the project depends on.

### D-003 · 2026-09-09 · The inherited system is rebuilt in Next.js, not ported
Rationale: leaving Firestore rewrites all 209 data calls anyway; no build, types, tests or server-side authz; re-entry §6.1 option D with the audit attached. What is preserved: every rule, screen, text, template, PDF and default (`docs/08-REGLAS-SISTEMA.md`). Alternatives: keep plain HTML and swap the data layer (rejected: more work, same risk). Reopen if: never.

### D-004 · 2026-09-09 · Free plans only, on every provider — accepted risk
Operator's decision. Consequences accepted in writing: Vercel Hobby ToS forbids commercial use (see D-012); Neon compute autosuspend and cold start; short PITR so our own daily encrypted dump is mandatory; 1-hour Vercel logs; Resend send caps. Each limit is read from the provider on setup day and appended here as a `G-NNN` with its number. Reopen if: the operator reverses it; a limit is hit in production.

### D-005 · 2026-09-09 · Clerk for staff identity; roles in the DB; 6-month sessions
Clerk free, production instance on `sistema.sanalys.com.ar`, password + TOTP MFA mandatory, session max lifetime 6 months, inactivity timeout mapped to the inherited `config.seguridad.timeoutMinutos` (client default 0 = off). Role and module permissions live only in `usuarios`. Alternatives: Firebase Auth (rejected: no MFA on the free plan); Auth.js (rejected: MFA and revocation hand-built); Better Auth (deferred: maturity open question). Accepted risk: a shared reception PC with a long session; mitigations: one account per person, admin-configurable inactivity timeout, OS lock is the client's responsibility. Reopen if: Clerk's free plan drops MFA or the production-instance allowance.

### D-006 · 2026-09-09 · No separate backend; polling instead of push
Server Actions + `packages/db` in each app; polling every 10 s on the waiting room, cash balances and agenda day view. Alternatives: Node API on Railway with SSE (rejected: paid, fourth deployable, authz far from data). Reopen if: staff report the 10 s delay as a problem — then a lightweight SSE route on Vercel first, Railway only if function limits bite.

### D-007 · 2026-09-09 · Public page inventory = the client's full request
Home, Tratamientos (index + 8 detail pages from one template), Turnos, Nosotros, Novedades (index + post template), Contacto, Privacidad, confirmation page, 404. Tier A 4/6. The architect's initial cut list (merge Nosotros into Home, anchors instead of Drip pages, defer Novedades) was rejected by the operator; recorded so it is not re-proposed. Reopen if: the client cannot supply Nosotros or Novedades content by launch — then those pages launch later, nothing else changes.

### D-008 · 2026-09-09 · Photography: build complete with placeholders, duotone treatment, swap later
Placeholders are hard-coded files under the brand duotone; real photos replace the same files. Placeholders never ship to production without the client's written acceptance; Nosotros never launches on placeholders. Alternatives: purely typographic site (rejected by the operator: the client wants a photographic hero); wait for photos (rejected: nothing is postponed). Reopen if: real photos are delayed past the launch date — the client chooses between typographic hero or written acceptance.

### D-009 · 2026-09-09 · News is edited inside the internal system (`D-EDIT`)
The client publishes from a `/novedades` editor in `sistema/`; public pages use ISR with on-demand revalidation. Every post has a named author with a matrícula and dates. Alternatives: headless CMS (rejected: third system, paid seats, second auth); repo Markdown edited by Mateo (rejected: the client will publish herself). Reopen if: the client asks for scheduling, drafts review or multiple editors beyond the admin.

### D-010 · 2026-09-09 · No structural mockups; structure is approved on built pages
The operator declined the `SM-1` set. What is lost: a client signature on page count and block order before code, which is what makes a later change cost 2–3× instead of being absorbed. Replacement: the sitemap and block sequences in `docs/04-INTERFAZ.md` are approved in writing by the client on the first built version of each page (placeholder copy, real structure); structure changes after that approval cost 4×, stated to the client before the first page is built. Reopen if: the client asks for a redesign after approval — the multiplier applies.

### D-011 · 2026-09-09 · Turno state machine unified; nursing waiting room semantics pending the client
Canonical enum in `docs/03-DATOS.md` §3.3; mapping in `docs/08-REGLAS-SISTEMA.md` §0.1. The one behavioural choice (does nursing see `ESPERA` or only `PAGADO`) is CI-01. Reopen if: the client changes the flow.

### D-012 · 2026-09-09 · Vercel Hobby for a commercial client — accepted risk
Same risk knowingly taken on presisso. The ToS forbids commercial use; the consequence is a possible request to upgrade or a suspended deployment. Mitigation: the repo deploys to Vercel Pro with zero code change if it ever happens. Reopen if: Vercel enforces it, or the operator reverses D-004.

### D-013 · 2026-09-09 · Single tenant, no `tenant_id`
One clinic, written down. Trigger to reopen: the sentence "¿se lo podemos vender a otra clínica?" — at that point it is a new engagement (`A5→A4`), not a change request.

## Gotchas (inherited system, found 2026-09-08/09)

- **G-001** · `firestore.rules`: every collection readable and writable by any authenticated user; `usuarios` included → self-promotion to admin. Authorization lives only in the UI.
- **G-002** · Deactivating a user (`activo:false`) is checked only in `login.html`; the Firebase Auth account keeps full data access via the SDK.
- **G-003** · Client-side sign-up may be enabled in Firebase Auth; if so, anyone with the public config passes `isAuth()`. Unverified — needs console access (CI-05).
- **G-004** · Permission mismatches: `sueros.html` accepts `stock|formulas`, sidebar grants `sueros`; dashboard CRM card needs `leads`, which admin cannot grant; `consentimiento.html` checks no permission. Resolved by §0.5 of the rules doc (client decides) and a new `crm` flag.
- **G-005** · `manual.html` shows `allow read, write: if true` as the deployed rules and says stock is decremented at cash; the code decrements at nursing start. Documentation that is wrong.
- **G-006** · `config/recordatorios`, `config/archivado`, `config/disp_{profesionalId}` exist in admin; nothing implements them. Dead configuration (rules §0.7).
- **G-007** · Turno states spelled differently per screen (`ESPERA`/`EN RECEPCIÓN`, `TRATAMIENTO`/`EN TRATAMIENTO`, lowercase sets on the dashboard). A turno moved from the agenda can be invisible in nursing.
- **G-008** · The repository snapshot is not the deployed code: `index (4).html` is a browser download duplicate of the `index.html` every link targets; `jspdf.umd.min.js` is 0 bytes; Netlify receives a zip by drag-and-drop. Rules were extracted from the snapshot (CI-06 to diff against the live zip).
- **G-009** · Comprobante numbers are computed from the in-memory cash list (`max + 1`); two cashiers can produce the same number. Rebuilt with sequences; format preserved.
- **G-010** · All items of one ticket share the same `OI` number by design; `nro_comp` is unique only for EGRESO/CIERRE rows. Do not add a blanket unique index.
- **G-011** · CRM conversion creates a patient without the DNI-duplicate check the patients screen enforces. The rebuild applies the check (patient created with empty DNI, so the unique constraint does not fire until a DNI is entered).
- **G-012** · Three different phone normalisations: `utils.waNumero` (549 + strip 0), CRM `wa.me/54{tel}`, dashboard inline. Rebuilt with one normaliser (E.164 `+549…`).
- **G-013** · Every screen loads whole collections and keeps unsubscribed `onSnapshot` listeners; Tailwind Play CDN and PDF/Excel libraries block render on every page (1.5–2.5 MB JS). This, not indexes, is the reported slowness.
- **G-014** · Dates stored as locale strings in three formats (`dd/mm/yyyy`, `d/m/yyyy`, ISO); `caja` had to patch a UTC-3 bug when matching today's turno after 21:00. Timezone discipline in the rebuild: `timestamptz` + Buenos Aires rendering.
- **G-015** · Money stored as JS `number`; honorario rounding `Math.round(monto × porc) / 100`. Reproduced exactly with `Decimal` arithmetic (round half away from zero to cents).
- **G-016** · Clinic data hard-coded fallback in `sueros.html` (`25 de Mayo 1845`, `(342) 452-8533`) differs from the identity PDF (`Avellaneda 3365`, `342 445-2643`). Neither is trusted (CI-09).
- **G-017** · The identity PDF prints the same MP number on two doctors' business cards and a different matrícula on the prescription pad. Credentials are `{{CONFIRMAR}}` (CI-10).
- **G-018** · The consent PDF footer asserts "Documento oficial con valor legal" — a legal claim the system cannot make (CI-07).
- **G-019** · `BLUEPRINT-PROYECTO.md` in the architect vault still warns about an open D-01 collision that the vault's MOC marks resolved; this package follows the 8-doc chain plus `10-MEMORY` and `11-ROADMAP` as the operator instructed.

## Gotchas (build toolchain, found 2026-09-09, WU-01a)

- **G-020** · `corepack` 0.32.0 (bundled with Node 22.16) cannot launch pnpm 12: it looks for `bin/pnpm.cjs` and pnpm 12 ships `bin/pnpm.mjs` plus a native binary downloader. `corepack pnpm install` fails with `MODULE_NOT_FOUND`. Install pnpm directly (`npm install --global pnpm@12.3.4`); `.github/workflows/ci.yml` does the same instead of `corepack enable`.
- **G-021** · `eslint-config-next` 16.3.4 pulls `eslint-plugin-react` 7.37.5, whose React-version *detection* calls `context.getFilename()`, removed in ESLint 10. `eslint .` crashes with `TypeError: contextOrFilename.getFilename is not a function` before linting a single app file. Fixed without touching the dependency tree by pinning `settings.react.version` in `eslint.config.mjs`, which skips the detection path. Revisit when `eslint-config-next` ships an ESLint 10 compatible `eslint-plugin-react`.
- **G-022** · pnpm 12 only accepts `--filter` **before** the script name. `pnpm dev --filter web` — the form written in `docs/07-REPO.md` §4 and `CLAUDE.md` — goes recursive and fails with `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL`. The working form is `pnpm --filter web dev`. `README.md` documents the working form; the two doc files still carry the old one.
- **G-023** · pnpm 12 renamed the build-script allowlist to `allowBuilds: {<pkg>: true|false}` in `pnpm-workspace.yaml`. The pnpm 10 key `onlyBuiltDependencies` is still echoed by `pnpm config list` but does **not** clear `ERR_PNPM_IGNORED_BUILDS`, which pnpm 12 raises as an error, not a warning. Current verdict: `unrs-resolver: false` (transitive under `eslint-config-next`; its prebuilt platform binding is enough, lint verified green with the script denied).
- **G-024** · `next-env.d.ts` in Next 16 imports `./.next/types/routes.d.ts`, which only exists after a build. On a clean clone `tsc --noEmit` therefore fails before anything is built, so each app's `typecheck` script is `next typegen && tsc --noEmit`. Do not "simplify" it back to plain `tsc`.

## Technical debt (carried into the rebuild, to be paid in the named unit)

- **TD-001** · Inherited `pdf-master.js` templates must be ported from jsPDF 2.5 to 4.x (unit 15); visual parity checked against a PDF generated by the old system.
- **TD-002** · Excel import/export moves from `xlsx` to `read-excel-file`/`write-excel-file` (unit 17); column names preserved.
- **TD-003** · The inherited `manual.html` is rewritten after unit 22; until then no manual exists for the new system.
- **TD-004** · Video codec/bitrate policy and image art-direction per breakpoint have no source in the workspace yet (OQ-05, OQ-06); decided in unit 4 with a cited source or left out.
- **TD-005** · Free-plan limits not yet read from providers on the day (D-004); to be appended here at unit 1 and unit 2.

- **TD-006** · Env variables whose provider is not wired yet are declared `.optional()` in `web/src/lib/env.ts` and `sistema/src/lib/env.ts`, each with a `// required at WU-NN` comment. Required today: `DATABASE_URL` and `NEXT_PUBLIC_SITE_URL` (web), `DATABASE_URL` (sistema). Each one is promoted to required in the unit named in its comment; the names themselves are already the final ones from `docs/06-SEGURIDAD.md` §6.

## Open questions

- **OQ-01** · Argentine data-protection and health-record obligations (Ley 25.326 lineage, AAIP, retention, cross-border hosting on US providers). Counsel. Launch blocker (`S3-08`, CI-07).
- **OQ-02** · What the patient signs electronically (treatment consent vs. booking), where in the flow, what is stored as evidence, who may read it, for how long, and what happens if the patient later denies signing. Client + counsel (CI-02). Proposed evidence shape in `docs/03-DATOS.md` §3.4; validity is not asserted by us.
- **OQ-03** · The full numbered patient journey (Paso 01 · El escaneo inicial … N) and where the Drip choice sits (CI-03).
- **OQ-04** · Does real data exist in Firebase `sanalys-2263e` today? Decides unit 24 and the §6.3 kill rows (CI-04).
- **OQ-05** · Video delivery: codecs, bitrate ladders, compression for 4G — no source in the workspace; no video exists yet. Resolve with a T1 source if a video ever enters; propose as a vault note.
- **OQ-06** · Art direction of images per breakpoint (different crops, not just sizes) — `<picture>` with per-source crops is the interim rule; verify against a T1 source and propose as a vault note.
- **OQ-07** · Implement or remove the three dead configurations (reminders, auto-archive, per-professional availability) — client (rules §0.7).
- **OQ-08** · Shape of the inherited `deudas` collection (appears only in the backup list).
- **OQ-09** · Support and handoff terms after launch (`D-HANDOFF`, `RF-16`): retainer, hours bucket or best-effort, in writing.
- **OQ-10** · Booking calendar accessibility and concurrency were designed here from doctrine (keyboard grid, live region, `EXCLUDE`); the calendar-component sources are a declared gap in the workspace — verify against a T1 source (WAI-ARIA APG grid/date-picker pattern) in unit 8 and propose as a vault note.
- **OQ-11** · Whether the `legal` permission or `admin` only edits news (`docs/06-SEGURIDAD.md` §4.1).
