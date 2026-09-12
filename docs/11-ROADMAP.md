# 11 — ROADMAP

> Twenty-five work units in the order they are built, each with its declared file list, its risk class, what "done" means, and the named test where one is critical. One unit = one branch = one PR = one written `GO-AHEAD` from Mateo before the first file is touched. If a unit stretches, it is cut in two and reported, never silently extended.

## 0. Rules of the build

- Build happens in fresh chats opened in `C:\Users\mateo\Desktop\sanalys`, one per unit, that start by reading `CLAUDE.md` and `KICKOFF.md`.
- Stages per unit: `READ` (this package) → `PLAN` (literals: files, components, schema, texts, design constraints, DoD, R-class) → `GO-AHEAD` → `BUILD` (main thread) → `REVIEW` (diff vs. declared files, `preflight/06` §3, parity vs. `docs/08-REGLAS-SISTEMA.md` for system screens, screenshots mobile + desktop) → fix pass. Two FAIL cycles max.
- A file outside the declared list is a FAIL unless it is a one-line import/type change named in the PR.
- Nothing is invented: any missing fact is a `{{CONFIRMAR}}` in the UI and a row in `docs/00-BRIEF.md` §8.
- Criterion for the order: shared foundations first; then the public site complete (the client-visible deliverable, independent of the system except for the `turnos` table); then the internal system complete; then closing. Photos never block a unit.

## Block A — Foundations

### WU-01a · Repo and tooling · R1
Files: `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig.base.json`, `eslint.config.mjs`, `vitest.config.ts`, `.github/workflows/ci.yml`, `web/` and `sistema/` scaffolds (`package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `next-env.d.ts`, `src/app/layout.tsx`, `src/app/page.tsx` placeholder, `src/app/globals.css` with only `@import "tailwindcss";`, `src/lib/env.ts`), `packages/db/package.json`, `packages/brand/package.json`, `README.md`.
Done: `pnpm install --frozen-lockfile`, `typecheck`, `lint`, `build`, `test` (empty suite) green locally and in CI; env module with the §6 names (vars not yet needed declared optional with `// required at WU-NN`); no secret in the output; WORKLOG entry; first commit.

### WU-01b · Vercel projects, previews, rollback · R1 — blocked on CI-05 (client account)
Files: `docs/07-REPO.md` §5 (amend with the exact settings and the rollback screenshot), `docs/10-MEMORY.md` (TD-005 limits).
Done: two Vercel projects on the client's account with root dirs `web` / `sistema`, ignored-build-step `git diff --quiet HEAD^ HEAD -- ./ ../packages/`, env var names, domains; preview deploy of both apps; rollback performed once; free-plan limits recorded. If the client account is late, Mateo may create the projects on his own account and transfer them later — written as a `D-NNN` if so.

### WU-02 · Database · R3
Files: `packages/db/drizzle.config.ts`, `packages/db/src/schema/*.ts`, `packages/db/src/queries/*.ts` (skeleton), `packages/db/src/web-queries/*.ts`, `packages/db/src/format.ts`, `packages/db/migrations/0001_init.sql`, `packages/db/seeds/*.ts`, `packages/db/scripts/restore-drill.md`, `.github/workflows/backup.yml`.
Done: all tables, enums, `EXCLUDE` (with `btree_gist`), triggers (`touch_updated_at`, `caja_periodo_abierto`, `turno_estado_transicion`), sequences table, three Postgres roles with grants; seeds for the 14 config keys, `salas` and the 8 Drips; backup workflow ran once and a restore drill completed with row counts recorded; Neon limits recorded. **Critical test 1**: two concurrent inserts on the same chair → exactly one succeeds.

### WU-03 · Brand package · R1
Files: `packages/brand/tokens.css`, `packages/brand/tailwind.preset.ts`, `packages/brand/fonts/*`, `packages/brand/assets/*` (logo SVGs in three colourways, isotype, favicon, pattern — extracted from the identity `.ai`/PDF, never the 2 GB sources), `packages/brand/README.md`.
Done: tokens exactly as `docs/05-DISENO.md` §2; both apps render a sample page with the highlighter component; logo clear space read from PDF pages 11/13/14/20 and written into §3; Borna wired if CI-08 received, else the fallback recorded as a `D-NNN`.

## Block B — Public site, complete

### WU-04 · Design, in code, in the real app · R1 — supersedes the earlier "reference sheet" wording (D-017)
**There are no mockups, wireframes, boards, Miro exports or self-contained HTML in this project.** Design happens in `web/` itself, with the real brand package, the real fonts, GSAP, Lenis and Embla installed, and is reviewed in the browser on mobile and desktop. The first attempt of this unit (a static `web/design/` sheet, G-038) is deleted, not iterated.
**Step 0 of this unit — brand imagery export** (before any component): export the brand-owned renders listed in `docs/14-MARCA.md` §3 from `brandign-sanalys/` into `web/public/img/brand/` (AVIF + WebP, three crops each, explicit dimensions) with `SOURCES.md`; the hero uses the Drip bags render, never a stock image. `web/public/img/placeholder/` is not created.
Files: `web/package.json` (add `gsap 3.15.0`, `@gsap/react 2.1.2`, `lenis 1.3.26`, `embla-carousel-react 8.6.0` after opening each npm page), `web/public/img/brand/*` + `SOURCES.md`, `web/src/lib/{gsap,lenis}.ts`, `web/src/components/{Nav,Highlight,SplitReveal,DuotoneImage,Hero,DripCard,Carousel,CtaBand}.tsx`, `web/src/app/page.tsx` (the Home hero + `PROOF-STRIP` + the Drip carousel + `CTA-BAND`, real), `web/src/app/layout.tsx` (**added to this unit's list by Mateo, 2026-09-10**: the Lenis provider and the font preload belong at the root from the start, not moved in later from `page.tsx`; WU-05 still owns the rest of the shell), `web/src/app/globals.css`, `docs/05-DISENO.md` (amend §10 with what was settled), `docs/10-MEMORY.md`. Delete `web/design/`. **Amended 2026-09-10 (D-018):** `web/public/img/placeholder/*` is removed from this list — nothing on the site is a placeholder; the imagery is `web/public/img/brand/*` + `SOURCES.md`, already named above. One file outside the list: `web/src/types/assets.d.ts`, a three-line ambient declaration so the `.woff2` import that makes the font preload point at the real hashed asset passes `tsc`.
Mandatory before the plan (see `CLAUDE.md` "Skills per unit"): `/diseno` → `Skill(web-distintiva)`, `Skill(ui-ideas)`, `Lib(animate)`, `Lib(tailwindcss-mobile-first)`; `/motion` → `Skill(motion-web-senior)` with `references/carousels.md` and `references/text-animation` for SplitText, `Lib(gsap-scrolltrigger)`. If a skill cannot be loaded, stop and report; do not design without them.
Done: `docs/05-DISENO.md` §10 composition rules and §11 tells pass line by line; the §5 motion inventory runs (hero reveal, highlighter wipe, carousel with real dots, CTA band); `prefers-reduced-motion` verified; CLS 0 and LCP on the lab proxy recorded; screenshots 375/1440 and a screen recording of the load and the carousel attached; Mateo reviews in the browser and the client approves look and structure on the running page (D-010). Nothing generic survives: any of the §11 tells present is a FAIL.

### WU-05 · Web shell · R1
Files: `web/src/app/layout.tsx`, `web/src/app/not-found.tsx`, `web/src/app/privacidad/page.tsx`, `web/src/components/{Nav,Footer,CtaBand,Highlight,SplitReveal,DuotoneImage,StaticMap,Carousel}.tsx`, `web/src/lib/{gsap,lenis,seo}.ts`, `web/next.config.ts` (headers, CSP report-only), `web/src/app/sitemap.ts`, `web/src/app/robots.ts`, Sentry + analytics wiring.
Done: 404 returns 404; headers present; CLS 0 on the shell; Lighthouse lab on throttled 4G as a diagnostic (not a gate).

### WU-06 · Home · R1
Files: `web/src/app/page.tsx`, `web/src/components/home/*`, `web/public/img/placeholder/hero-*.{avif,webp}`.
Done: the 10 blocks of `docs/04-INTERFAZ.md` §1.1 with placeholder copy in Spanish respecting character budgets; every client-owned fact `{{CONFIRMAR}}`; hero LCP ≤ 2.5 s on the lab proxy; motion inventory respected.

### WU-07 · Tratamientos · R1
Files: `web/src/app/tratamientos/page.tsx`, `web/src/app/tratamientos/[drip]/page.tsx`, `web/src/content/drips.ts` (the 8 Drips from the PDF + `{{CONFIRMAR}}` fields), `web/src/components/{DripCard,ProcessSteps,Faq,SpecTable}.tsx`.
Done: 8 generated pages with breadcrumbs, `Service` schema, View Transition from card to page; journey steps as `{{CONFIRMAR}}` until CI-03.

### WU-08 · Turnos · R3
Files: `web/src/app/turnos/page.tsx`, `web/src/app/turnos/confirmado/page.tsx`, `web/src/components/booking/{BookingWidget,Calendar,SlotGrid,PatientForm,Summary,StatusPanel}.tsx`, `web/src/actions/{leerDisponibilidad,crearTurnoPublico}.ts`, `web/src/lib/{rateLimit,email}.ts`, `packages/db/src/web-queries/turnos.ts`.
Done: the five-step flow with URL state; slots from `salas.horarios` with the inherited generation rule; taken slots visible; keyboard-operable calendar with live region (OQ-10 source cited); honeypot + time trap + rate limit; e-mail via Resend with timeout and logged fallback; confirmation page fires `turno_confirmado`; signature step only if CI-02 says so. **Critical test 2**: double submit writes one row; a taken slot is rejected by the DB and the UI recovers to step 3.

### WU-09 · Nosotros · R1
Files: `web/src/app/nosotros/page.tsx`, `web/src/components/{Team,Timeline,ProofStrip}.tsx`, `web/public/img/placeholder/team-*.{avif,webp}`.
Done: per `docs/04-INTERFAZ.md` §1.6; matrículas `{{CONFIRMAR}}`; page marked "no launch on placeholders" in the PR.

### WU-10 · Novedades (public) · R1
Files: `web/src/app/novedades/page.tsx`, `web/src/app/novedades/[slug]/page.tsx`, `web/src/app/api/revalidate/route.ts` (secret-protected), `web/src/components/{AuthorMeta,ContentBody,ListFeed}.tsx`, `web/src/lib/markdown.ts` (allowlist sanitizer), `packages/db/src/web-queries/novedades.ts`.
Done: ISR pages; `EMPTY-STATE.first-run` designed; `BlogPosting` schema; revalidation endpoint tested with the secret.

### WU-11 · Contacto · R2
Files: `web/src/app/contacto/page.tsx`, `web/src/actions/enviarContacto.ts`, `web/src/components/LeadForm.tsx`, `packages/db/src/schema/contactos.ts` (+ migration).
Done: NAP `{{CONFIRMAR}}`; form e-mails the clinic and stores a row; spam controls; `ContactPage` schema.

## Block C — Internal system, complete (parity with `docs/08-REGLAS-SISTEMA.md`)

### WU-12 · System shell · R3
Files: `sistema/src/app/layout.tsx`, `sistema/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`, `sistema/src/middleware.ts` (redirect only), `sistema/src/dal/guard.ts`, `sistema/src/dal/usuarios.ts`, `sistema/src/components/{AppShell,Sidebar,Toast,PermissionGate,DataTable,KpiRow,ModalForm,PdfButton}.tsx`, `sistema/src/i18n/es.ts`, `sistema/src/lib/audit.ts`, `sistema/next.config.ts` (headers, nonce CSP), theme CSS.
Done: Clerk production instance, MFA enforced, session policy set and recorded; sidebar identical to the inherited one; guard used by a sample action; **Critical test 3**: a user without `caja` calling a caja action gets 403 and no side effect; anonymous `curl` gets 401.

### WU-13 · Admin · R3
Files: `sistema/src/app/(app)/admin/{personas,honorarios,plan-de-cuentas,agenda,usuarios,inversiones,config,auditoria,analisis,alertas}/page.tsx`, `sistema/src/actions/admin/*.ts`, `sistema/src/dal/{config,personas,inversiones,auditoria}.ts`.
Done: every config key with its default (rules §12); users invited/suspended through Clerk; audit rows on every change; JSON export kept; CSV analysis exports logged. May be cut into 13a (personas, usuarios, config general) and 13b (agenda/salas, mensajes, auditoría, análisis) if it stretches.

### WU-14 · Agenda and dashboard · R3
Files: `sistema/src/app/(app)/page.tsx`, `sistema/src/app/(app)/agenda/page.tsx`, `sistema/src/components/agenda/*`, `sistema/src/components/dashboard/*`, `sistema/src/actions/{turnos,dashboard}.ts`, `sistema/src/dal/turnos.ts`, `sistema/src/pdf/agenda-semanal.ts`.
Done: rules §3 and §4 verbatim; canonical states with the §0.1 mapping and the client's CI-01 answer; capacity via `EXCLUDE` with the inherited messages; polling 10 s; WhatsApp templates; weekly PDF; KPIs, waiting room, alerts, birthdays.

### WU-15 · Pacientes · R3
Files: `sistema/src/app/(app)/pacientes/page.tsx`, `sistema/src/app/(app)/pacientes/[id]/page.tsx`, `sistema/src/components/pacientes/*` (10 tabs), `sistema/src/actions/pacientes/*.ts`, `sistema/src/dal/{pacientes,evoluciones,planes,archivos,bitacora}.ts`, `sistema/src/pdf/{historia-clinica,arco,presupuesto}.ts`, `sistema/src/pdf/base.ts` (ported `pdf-master`), `sistema/src/lib/r2.ts`.
Done: rules §5 verbatim; DNI uniqueness; IMC/ICC formulas; R2 uploads; PDFs compared side by side with the old ones (TD-001); Excel export.

### WU-16 · Caja · R3
Files: `sistema/src/app/(app)/caja/page.tsx`, `sistema/src/components/caja/*`, `sistema/src/actions/caja/*.ts`, `sistema/src/dal/{caja,periodos}.ts`, `sistema/src/pdf/{caja-diaria,caja-periodo,arqueo,comprobante}.ts`.
Done: rules §9 verbatim; sequences; honorario pair in one transaction with the client's §0.3 answer; period lock at three layers (**Critical test 4** — Zod, action, trigger); arqueo with bills; cascade cancellation; PDFs and Excel.

### WU-17 · Sueros · R2
Files: `sistema/src/app/(app)/sueros/page.tsx`, `sistema/src/components/sueros/*`, `sistema/src/actions/sueros/*.ts`, `sistema/src/dal/{insumos,formulas,pedidos}.ts`, `sistema/src/pdf/{receta,orden-proveedor}.ts`, `sistema/src/lib/excel.ts`.
Done: rules §8 verbatim including the three conversion functions with unit tests on the documented examples (10 ml @ 10 % = 1000 mg); Excel import with the exact headers (TD-002).

### WU-18 · Enfermería · R3
Files: `sistema/src/app/(app)/enfermeria/page.tsx`, `sistema/src/components/enfermeria/*`, `sistema/src/actions/enfermeria/*.ts`, `sistema/src/dal/registros.ts`, `sistema/src/pdf/atencion.ts`.
Done: rules §6 verbatim; stock decrement in the same transaction as the record, at the moment the client chose in §0.2; `registro_materiales` written; KPIs; PDF; WhatsApp summary.

### WU-19 · Consentimiento · R3
Files: `sistema/src/app/(app)/consentimiento/page.tsx`, `sistema/src/components/consentimiento/*` (canvas), `sistema/src/actions/consentimiento.ts`, `sistema/src/dal/consentimientos.ts`, `sistema/src/pdf/consentimiento.ts`.
Done: rules §7 verbatim; signature to R2 with SHA-256, server time, IP, UA; append-only verified (an UPDATE from the app role fails); versioned texts; footer per CI-07.

### WU-20 · CRM · R2
Files: `sistema/src/app/(app)/crm/page.tsx`, `sistema/src/components/crm/*`, `sistema/src/actions/crm.ts`, `sistema/src/dal/leads.ts`, `sistema/src/pdf/crm.ts`.
Done: rules §11 verbatim; `crm` permission; conversion with the duplicate check (G-011).

### WU-21 · Balance · R2
Files: `sistema/src/app/(app)/balance/page.tsx`, `sistema/src/components/balance/*`, `sistema/src/dal/balance.ts` (SQL aggregates by period — never whole-table loads), `sistema/src/pdf/{sumas-saldos,libro-diario,asientos,libro-mayor,estado-profesional,inversiones}.ts`.
Done: rules §10 verbatim with the §0.3 fee rule; DEBE = HABER asserted in a unit test on a seeded month; charts lazy.

### WU-22 · News editor · R2
Files: `sistema/src/app/(app)/novedades/page.tsx`, `sistema/src/app/(app)/novedades/[id]/page.tsx`, `sistema/src/components/novedades/*` (Markdown editor with preview, cover upload), `sistema/src/actions/novedades.ts`, `sistema/src/dal/novedades.ts`.
Done: author must have a matrícula; publish/unpublish calls the web revalidation endpoint; audit rows; `/manual` rewritten (TD-003).

## Block D — Closing

### WU-22b · Client inputs round · R0 (no code)
Files: `docs/12-CLIENT-QUESTIONS.md` (strike answered rows), `docs/00-BRIEF.md` §8 (status per row), `docs/10-MEMORY.md` (a `D-`/`G-` per answer that changes something built), plus the `{{CONFIRMAR}}` replacements in the pages the answers unblock.
Done: the 32 questions sent in one batch and every answer written back; a question that hard-blocks an earlier unit (17–19 → WU-08, 25 → WU-14, 31 → WU-25) is sent alone when that unit starts, not held for this one (Mateo, 2026-09-09).

### WU-23 · Real photos · R0
Files: `web/public/img/*` replacements only.
Done: same file names and crops; CR-01 `RECIBIDO`; Nosotros launch unblocked.

### WU-24 · Data migration · R3 — only if CI-04 says real data exists
Files: `packages/db/scripts/import-firestore.ts`, `docs/10-MEMORY.md` (row counts).
Done: dry run on a Neon branch, counts per table, state mapping applied, signatures moved to R2, then production import in a maintenance window; the inherited system frozen read-only the same day.

### WU-25 · Launch · R3
Files: `docs/06-SEGURIDAD.md` §11 checkboxes, `docs/10-MEMORY.md`, DNS at the registrar, Vercel domains; `sistema-interno/` removed from the repo after cut-over.
Done: every `S1`/`S2`/`S3` line green; `ACC-1` manual pass dated; the three vitals measured on the real deploy (targets, honestly reported); restore drill dated; counsel sign-off or written acceptance on file; Netlify site retired; client owns every account; support terms in writing (OQ-09).

### After launch, out of this scope
Booking bot / conversational agent. Outbound WhatsApp automation. Any reopened decision goes through the triage in `preflight/11` §1 (`INT-0`–`INT-4`) with a new `D-NNN`.
