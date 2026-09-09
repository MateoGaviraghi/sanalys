# KICKOFF — Sanalys

Paste this into a fresh chat opened in `C:\Users\mateo\Desktop\sanalys`. It contains everything needed to build one work unit. The exhaustive references live in `docs/` in this same repository; this file is the expanded summary and it must be enough on its own.

---

## 1. Who you are and how you work

You are the single builder, working in the main thread for Mateo (solo operator, Argentina). Speak Spanish to Mateo; write every `.md` in English; keep technical terms in English. Reading can be delegated to the `explorador` subagent; nothing else is delegated; no workflows unless Mateo names them.

Memory across chats lives in the repository, not in your head: `docs/09-WORKLOG.md` §1 says where the project is and what is next; §2 is the append-only log every chat adds to before ending. `docs/10-MEMORY.md` holds every decision (`D-NNN`), gotcha (`G-NNN`), debt (`TD-NNN`) and open question (`OQ-NN`); nothing in it is re-decided. The full session protocol (start, re-anchoring during the work, mandatory end entry) is in `CLAUDE.md`.

Each chat builds **one work unit** from `docs/11-ROADMAP.md`. Sequence: read → state the plan as literals (files, components, schema, texts, design constraints, risk class, definition of done) → wait for Mateo's written `GO-AHEAD` → build → review your own diff against the plan and the declared file list → screenshots mobile + desktop for any UI → report. Two fix cycles maximum; a third means the plan was wrong. Never touch a file outside the declared list. Never invent a fact: `{{CONFIRMAR}}` and an open question instead.

## 2. What is being built

**Sanalys** is a private IV-therapy clinic in Santa Fe, Argentina, not yet open. Slogan *La ciencia de estar bien.* Registered trademark (logo carries `®`). Eight named treatments ("Drips"): 01 Detox Vital · 02 Escudo Antioxidante · 03 Recuperación Deportiva · 04 Impulso Celular · 05 Equilibrio Mental · 06 Anti-Estrés Plus · 07 Renovación Celular · 08 Juventud Activa. A numbered patient journey exists ("Paso 01 · El escaneo inicial …"); the full list is pending from the client.

Two surfaces, one repository, one domain:

- **`web/`** → `sanalys.com.ar` — public site: Home, Tratamientos (index + one page per Drip), Turnos (online booking through to confirmation), Nosotros, Novedades (index + post), Contacto, Privacidad, confirmation page, 404. Mobile first, 4G, designed completely now with placeholder photos under the brand duotone; real photos replace files later.
- **`sistema/`** → `sistema.sanalys.com.ar` — the clinic's internal system, **rebuilt** from an inherited plain-HTML/Firestore system whose behaviour is reproduced verbatim: dashboard, agenda, caja (cash), pacientes (clinical record), enfermería (nursing), sueros (stock and formulas), consentimiento (digital consent with signature), CRM, balance, admin, plus a new news editor. Staff only, ~5 users, module permissions.

Archetype: `A3 LEADGEN-TX` + `A5 INTERNAL-TOOL`, health data → security tier `S3`. Measured goal: online bookings per month, counted on `/turnos/confirmado/`.

Out of scope: booking bot, outbound WhatsApp automation, online payment, patient accounts, multi-tenancy, any paid plan.

## 3. Stack (exact versions, verified 2026-09-09; re-pin to the current patch on first install)

Shared: Next.js 16.3.4 · React 19.2.8 · TypeScript 5.9.3 (not 7) · Tailwind 4.3.3 + `@tailwindcss/postcss` · Zod 4.5.4 · Drizzle ORM 0.45.2 / drizzle-kit 0.31.10 · `@neondatabase/serverless` 1.1.0 · decimal.js 10.6.0 · date-fns 4.4.0 + date-fns-tz 3.2.0 · `@t3-oss/env-nextjs` 0.13.11 · `@sentry/nextjs` 10.73.0 · `@fontsource-variable/roboto-flex` 5.3.0 · pnpm 12.3.4 workspaces · Vitest 4.1.11 (not 5.0, released days ago) · ESLint 10.10.0 + `eslint-config-next` 16.3.4 flat config.

Every message to Mateo follows the strict shape in `CLAUDE.md` ("How to talk to Mateo"): `HECHO / FALTA / SIGUE / DE VOS`, no preamble, plans as tables.
`web/` only: GSAP 3.15.0 + `@gsap/react` 2.1.2 (the only motion engine; SplitText and ScrollTrigger included) · Lenis 1.3.26 · Embla `embla-carousel-react` 8.6.0 · `@vercel/analytics` 2.0.1 · `@vercel/speed-insights` 2.0.0 · Resend 6.26.0. Three.js only if a design decision adds one element (not by default).
`sistema/` only: `@clerk/nextjs` 7.9.1 · jsPDF 4.2.1 + jspdf-autotable 5.0.8 (lazy) · `read-excel-file` 9.3.10 · `write-excel-file` 4.1.1 · `@aws-sdk/client-s3` 3.1128.0 (Cloudflare R2) · Chart.js (lazy).
Hosting: Vercel Hobby, two projects from one repo (root dirs `web` and `sistema`, ignored-build-step by path). Database: Neon Free (Postgres). Files: Cloudflare R2 free, private bucket, signed URLs. Identity: Clerk free. E-mail: Resend free. Errors: Sentry free. Backups: GitHub Actions cron with `pg_dump` encrypted with `age` to R2. **Every plan is free by decision; each limit is read from the provider on setup and written to `docs/10-MEMORY.md` with its consequence.** Vercel Hobby's commercial-use restriction is an accepted, recorded risk.

**Prohibited**: Supabase, Firebase (any), Railway, Netlify, Tailwind Play CDN, `xlsx` from npm, Framer Motion/`motion`, tokens or sessions in `localStorage`, money as a JS `number`, authorization only in middleware or UI, Inter/Geist/Space Grotesk, untouched shadcn defaults, `.env.example`, `NEXT_PUBLIC_` on anything secret, packages installed without opening their npm page, any second motion engine, any headless CMS, any paid plan.

## 4. Repository

```
sanalys/
  CLAUDE.md  KICKOFF.md  README.md  .gitignore  pnpm-workspace.yaml  package.json  tsconfig.base.json
  .github/workflows/ci.yml (build+typecheck+lint+frozen install)  backup.yml (daily encrypted dump → R2)
  docs/00-BRIEF 01-ARQUITECTURA 02-STACK 03-DATOS 04-INTERFAZ 05-DISENO 06-SEGURIDAD 07-REPO 08-REGLAS-SISTEMA 10-MEMORY 11-ROADMAP
  packages/brand/   tokens.css · tailwind.preset.ts · fonts/ · assets/ (logo SVGs, favicon, pattern)
  packages/db/      drizzle.config.ts · src/schema/ · src/queries/ (system) · src/web-queries/ (public, narrow) · src/format.ts · migrations/ · seeds/ · scripts/
  web/              src/app · src/components · src/actions · src/lib/env.ts · public/img/placeholder/
  sistema/          src/app/(auth)/sign-in · src/app/(app)/<screen> · src/dal/ (guard.ts + one module per table group) · src/actions · src/components · src/pdf · src/i18n/es.ts · src/lib/env.ts
  sistema-interno/  the inherited HTML system — READ-ONLY parity reference, never edited
  brandign-sanalys/ 2 GB identity sources — git-ignored, never edited, never renamed
```
Conventions: `kebab-case` files, `PascalCase` components, one Server Action per file, apps import only `@sanalys/db` and `@sanalys/brand`, env through `src/lib/env.ts`, Spanish UI literals centralised in `sistema/src/i18n/es.ts` copied verbatim from `docs/08-REGLAS-SISTEMA.md`. Branch `wu-NN-name` → PR → `main`. Commits `feat(caja): …`. Never commit `brandign-sanalys/`, `.env*`, dumps, exports or screenshots with patient data.

## 5. Data model (Postgres, Drizzle) — summary

Conventions: `snake_case` Spanish names matching the inherited fields; `uuid` v7 keys; `created_at`/`updated_at`; money `numeric(12,2)` with `Decimal` in code and strings on the wire; `timestamptz` UTC rendered in Buenos Aires; inherited string formats (`dd/mm/yyyy`, `HH:MM`, `YYYY-MM`) are presentation only.

Tables: `usuarios` (clerk_user_id, email, nombre, rol, permisos[], activo — **the only authorization source**) · `personas` (doctors/partners: matrícula, es_medica, pct_medica_individual, es_socia, parte_sociedad) · `pacientes` (identity, contact, obra_social, alergias, hc_* bio-profile, perfil_* commercial profile, seguridad jsonb, activo) with `evoluciones`, `planes`, `archivos` (R2 key), `bitacora` (append-only) · `salas` (tipo consulta|sueros, capacidad, horarios jsonb {1..7:[{desde,hasta}]}, bloqueos jsonb) · `turnos` (paciente_id nullable, paciente_nombre, dni, telefono, email, servicio, sala_id, puesto, inicio, fin, estado enum, origen sistema|web, …) with **`EXCLUDE USING gist (sala_id WITH =, puesto WITH =, tstzrange(inicio,fin,'[)') WITH &&) WHERE (estado NOT IN ('CANCELADO','AUSENTE'))`** (needs `btree_gist`) · `registros_enfermeria` + `registro_materiales` · `consentimiento_textos` (versioned) · `consentimientos` (firma_r2_key, firma_sha256, firmado_at server time, ip, user_agent — **append-only**) · `insumos` (tipo solucion|puro|unidad, concentracion, vol_por_vial, unidad_uso, stock_disp ≥ 0, costo, lote, fecha_vencimiento, minimo_viales) · `formulas` + `formula_componentes` · `pedidos` · `caja_movimientos` (ticket_id, nro_comp `OI-26-0001`, tipo INGRESO|EGRESO|CIERRE, monto > 0, medio, dni, fecha, usuario, profesional, centro_costo, honorario_calculado, es_honorario, es_traspaso, destino, anulado + motivo/por/at, periodo `YYYY-MM`, arqueo jsonb) · `comprobantes_seq` (prefijo, anio, ultimo — read `FOR UPDATE`) · `periodos_cerrados` · `saldos_iniciales` · `inversiones` · `deudas` · `leads` + `lead_bitacora` · `novedades` (slug, cuerpo_md, autora with matrícula, publicada) · `contactos` · `config` (clave → jsonb; 14 inherited keys seeded with their defaults) · `auditoria` (append-only; usuario from the server session) · `rate_limits`.

Turno states (canonical): `PENDIENTE → CONFIRMADO → ESPERA → PAGADO → TRATAMIENTO → FINALIZADO`, plus `CUMPLIDO` (historical), `AUSENTE`, `CANCELADO`; transitions enforced by a trigger. The inherited screens spell them inconsistently; the mapping and the one open behavioural choice are in `docs/08-REGLAS-SISTEMA.md` §0.1.

Enforced in the database: chair exclusivity, capacity, money > 0, no movement in a closed period (trigger), comprobante sequences, stock ≥ 0, immutable consent/audit (no UPDATE/DELETE privilege), unique normalised DNI, state transitions, news author has a matrícula. Client-changeable parameters (percentages, slot duration, capacity, timeout, alert thresholds, templates) live in `config`, not in constraints.

Roles: `sanalys_app` (system, DML minus the append-only exceptions), `sanalys_web` (public: read `salas`, agenda config, published news, availability view; insert `turnos` and `contactos`; **no access to clinical or money tables**), `sanalys_migrate` (DDL only, direct connection; runtime uses the pooled string).

## 6. Public site — pages and blocks

Nav: Tratamientos · Turnos · Nosotros · Novedades · Contacto + persistent CTA "Reservar turno". Slugs Spanish, lowercase, hyphen, trailing slash, never renamed. No i18n.

- **`/`**: NAV → HERO.split (positioning line with the lime highlighter on the key words, photo slot with placeholder, CTA) → PROOF-STRIP (matrículas, formación, "basada en evidencia", all `{{CONFIRMAR}}`) → VALUE-PROP → FEATURE-GRID of the 8 Drips (Embla carousel on mobile, no autoplay) → PROCESS-STEPS (journey, `{{CONFIRMAR}}` names) → SPLIT-FEATURE (how Sanalys was born → Nosotros) → CTA-BAND on lime → MAP-LOCATION (static map image linking out, never an embed) → FOOTER.
- **`/tratamientos/`**: NAV → HERO.statement → PROCESS-STEPS → 8 Drip cards → FAQ → CTA-BAND → FOOTER. **`/tratamientos/[drip]/`** ×8: HERO on the Drip's colour ground → VALUE-PROP (for whom / not for whom) → SPEC-TABLE (duration, frequency, prep, price "consultar") → PROCESS-STEPS → FAQ → CTA-BAND pre-selecting the Drip → RELATED-LINKS → FOOTER; breadcrumbs; `Service` schema without `Offer`.
- **`/turnos/`**: NAV.simple → BOOKING-WIDGET (tratamiento → día → hora → datos → confirmar; URL state; keyboard-operable calendar with `aria` grid and live region; slots generated from `salas.horarios` per franja with `config.agenda.duracion` step; taken slots shown as taken; capacity-aware; honeypot + time trap; Zod server-side; cancellation policy visible before confirm; signature step only if the client says the patient signs at booking) → STATUS-PANEL → FOOTER.minimal. Server Action `crearTurnoPublico`: transaction, first free chair 1..capacidad, insert (`origen='web'`, `PENDIENTE`), e-mail via Resend with 5 s timeout and logged fallback, redirect to `/turnos/confirmado/?t=<opaque>`. States: loading skeleton with reserved height · "No hay horarios ese día — probá otro" · DB error → "No podemos mostrar horarios ahora" + `wa.me` link, typed data kept · slot taken meanwhile → back to step 3 with the grid refreshed.
- **`/turnos/confirmado/`**: animated STATUS-PANEL (`role="status"`, no focus move) → what happens next → add-to-calendar + `wa.me` with the inherited *confirmacion_turno* text → FOOTER. `noindex`; fires `turno_confirmado`.
- **`/nosotros/`**: HERO (origin story) → TEAM (photo placeholder, name, role, matrícula, titles) → TIMELINE → PROOF-STRIP → CTA-BAND → FOOTER. Never launches on placeholder photos.
- **`/novedades/`** (ISR, on-demand revalidation from the system editor): LIST-FEED with date and author, designed empty state. **`/novedades/[slug]/`**: AUTHOR-META (named doctor + matrícula, published/updated dates, mandatory) → CONTENT-BODY (Markdown through an allowlist sanitizer) → contextual CTA → RELATED → FOOTER; `BlogPosting`.
- **`/contacto/`**: MAP-LOCATION (NAP `{{CONFIRMAR}}`, hours, `tel:`, `wa.me`, Instagram) → LEAD-FORM.short (nombre, teléfono, mensaje; spam controls; e-mails the clinic and stores a row) → FAQ logistics → FOOTER.
- **`/privacidad/`** (`{{CONFIRMAR}}` by counsel), **404** (real 404, three links out, no jokes).

## 7. Design — tokens and rules

Stance: typography is the protagonist and the lime highlighter behind the key words is the signature device; three grounds (verde, fluo, blanco) colour-blocked per section, gris only as a fourth ground; editorial asymmetry on a named-line grid; the Drip label from the identity PDF *is* the card.

Colour (OKLCH): `--verde oklch(0.325 0.055 176)` #0A3D33 · `--verde-deep oklch(0.218 0.032 177)` #071F1A (system ground) · `--fluo oklch(0.936 0.202 123)` #D0FF4E (only accent) · `--negro oklch(0 0 0)` · `--gris oklch(0.689 0.003 265)` #9A9B9D (never for text: 2.8:1 on white) · `--blanco`. Verified contrasts: fluo/verde 10.5:1, blanco/verde 12.2:1, negro/fluo 18.1:1.
Type: **Borna** (display; client's licence pending → fallback Roboto Flex 300/800) mixing light and bold in one headline; **Roboto Flex** variable for body, self-hosted, `tabular-nums` for money and times. Fluid scale `--step--1 … --step-5` (Utopia-style, 375→1440), headlines `line-height 0.95`, `-0.02em`.
Radius: `0` (highlighter, labels, CTA band — sharp is the brand), `4px` inputs, `12px` public cards; the internal system keeps its inherited `20px` cards and dark theme untouched. One shadow `0 16px 40px oklch(0 0 0 / .25)`. Durations `--dur-1 140ms`, `--dur-2 240ms`, `--dur-3 440ms`, easing `cubic-bezier(.16,1,.3,1)`.
Photos: duotone verde/fluo on every photograph; `<picture>` with art-directed crops (3:4 mobile, 4:3 tablet, 21:9 desktop), AVIF+WebP, explicit dimensions, `fetchpriority="high"` on the hero only. Placeholders in `web/public/img/placeholder/`.
Motion budget: INP ≤ 200 ms p75; scroll handlers < 4 ms; nothing autonomous longer than 5 s without a control — so carousels do not autoplay. Inventory: hero SplitText reveal once (440 ms) · highlighter `clip-path` wipe on enter (240 ms, once) · process steps scrubbed with ScrollTrigger (transform/opacity only) · booking step transitions 240 ms · confirmation panel entrance 440 ms · Lenis lerp 0.1 · View Transitions card→page. `prefers-reduced-motion` respected everywhere. No 3D in v1. No video in v1.
Performance: CLS ≤ 0.1 blocks everywhere; LCP ≤ 2.5 s and INP ≤ 200 ms at p75 block on `sistema/`, warn on `web/`; JS ≤ 180 KB on `/` and `/turnos/`, ≤ 250 KB per system screen; PDF/Excel/Chart lazy; two font files preloaded; analytics deferred. Until live these are targets you can fail, not measurements you can pass — say so.
Accessibility: `ACC-2` plus 44×44 targets, ≥ 16 px body on mobile, fluo focus ring, no colour-only meaning, keyboard calendar, `role="status"` messages; `ACC-1` manual pass dated before launch.
Vetoes: Inter/Geist, slate neutrals, `rounded-2xl` everywhere, centred gradient hero with two buttons, equal 3-column icon grid, `whileInView` fade-up everywhere, logo-left/nav-centre/CTA-right header, single `max-w-4xl` column.

## 8. Security — instantiated

- Staff identity: Clerk production instance on `sistema.sanalys.com.ar`, e-mail + password, **MFA (TOTP) mandatory**, cookie session `httpOnly/Secure/SameSite=Lax`, max lifetime 6 months, inactivity timeout = `config.seguridad.timeoutMinutos` (client default 0). Suspension in Clerk **and** `usuarios.activo=false`; either kills access on the next request. Patients never log in.
- Authorization: every Server Action/route handler in `sistema/` starts with the canonical guard — Clerk `userId` → `usuarios` row → `activo` → `requirePermiso(u, '<flag>')` → row-level checks. Permissions: `admin, pacientes, stock, formulas, caja, balance, agenda, enfermeria, sueros, legal, crm`; `admin` implies all. Middleware only redirects anonymous users. Hidden UI is not security.
- Input: one Zod schema per action; text caps (nombre ≤ 80, mensaje/notas ≤ 2000, cuerpo_md ≤ 20 000); phone E.164 `+549…`; DNI digits 6–9; reject, never sanitise structured fields. Files: PDF/JPG/PNG/WebP ≤ 5 MB, magic bytes, random key, SVG rejected, images re-encoded server-side.
- Rate limits: booking 5/h per phone and 20/h per IP; contact 5/h per IP; system mutations 120/min per user; Postgres `rate_limits` table. Honeypot + time trap ≥ 2 s on public forms.
- Headers on both apps: HSTS `max-age=63072000; includeSubDomains`, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. CSP: `web/` `'unsafe-inline'` baseline Report-Only one week then enforcing; `sistema/` nonce + `'strict-dynamic'` from day one; `frame-ancestors 'none'`.
- Secrets (names): `web/` `DATABASE_URL` (role `sanalys_web`), `RESEND_API_KEY`, `RESEND_FROM`, `SENTRY_DSN`, `NEXT_PUBLIC_SITE_URL`, `REVALIDATE_SECRET`; `sistema/` `DATABASE_URL` (role `sanalys_app`), `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `SENTRY_DSN`, `WEB_REVALIDATE_URL`, `REVALIDATE_SECRET`; Actions: `DATABASE_URL_DIRECT`, `BACKUP_AGE_PUBLIC_KEY`, `R2_*`. Values only in the Vercel env store and the client's password manager. Post-build grep of `.next/static` for every secret value: zero hits.
- Personal data: never log DNI, phone, e-mail, clinical text, signatures; opaque uuids in URLs; Sentry scrubs bodies; exports write an `auditoria` row with row count; no marketing pixels. Legal regime is an open question for counsel — we write what we implemented, never "compliant with".
- Consent evidence: signature image to R2 (private), SHA-256, server time, IP, user agent, versioned text; append-only. Legal validity is not asserted by us.

## 9. The internal system — parity

`docs/08-REGLAS-SISTEMA.md` lists every rule, formula, default, text, WhatsApp template and PDF of the inherited screens (dashboard, agenda, pacientes, enfermería, consentimiento, sueros, caja, balance, CRM, admin). Reproduce them exactly, including Spanish spelling and emoji. The inherited look (dark verde ground, glass cards 20 px, fluo accents, 72 px sidebar, same icons, same toast) is kept; only the CSS delivery changes. Its §0 lists nine contradictions inside the inherited code (turno state spellings, when stock is decremented, which fee percentage applies, permission mismatches, clinic data, dead configuration, a legal claim in a PDF footer): apply the client's answer if it exists in `docs/10-MEMORY.md`; otherwise `{{CONFIRMAR}}` and stop that part.

Key formulas to get right: honorario `round(monto × porc) / 100` with `porc` = sueros rate when the item type contains "suero"/"fórmula", else the doctor rate; comprobantes `PREFIJO-YY-NNNN` (`OI OE OT OH OR CC`) via sequences; IMC `(peso/(talla/100)²)` one decimal; ICC `cin/cad` two decimals; nursing duration `max(1, floor((fin−inicio)/60000))`; stock conversions `unidadesPorVial` (ml → vol; mg → vol × conc × 1000; g → vol × conc) and `dosisAMlSolucion` (inverse); P&L margen = ingresos − honorarios variables − egresos variables, EBITDA = margen − egresos fijos, punto de equilibrio = fijos / margen%.

## 10. Work units and order

Foundations: WU-01 repo/tooling · WU-02 database (+ backup and restore drill; critical test: chair exclusivity) · WU-03 brand package. Public site complete: WU-04 design (client approves in writing) · WU-05 shell · WU-06 Home · WU-07 Tratamientos · WU-08 Turnos (critical test: double submit / taken slot) · WU-09 Nosotros · WU-10 Novedades public · WU-11 Contacto. Internal system complete: WU-12 shell + Clerk + guard (critical test: RBAC negative) · WU-13 Admin · WU-14 Agenda + dashboard · WU-15 Pacientes · WU-16 Caja (critical test: period lock at three layers) · WU-17 Sueros · WU-18 Enfermería · WU-19 Consentimiento · WU-20 CRM · WU-21 Balance · WU-22 News editor. Closing: WU-23 real photos · WU-24 data migration (only if real data exists) · WU-25 launch. Declared file lists per unit are in `docs/11-ROADMAP.md`.

## 11. Definition of done (every unit)

Build, typecheck and lint green · frozen lockfile · no file outside the declared list · plan literals present with the same values · the unit's critical test green · no `{{PENDIENTE}}` left; every `{{CONFIRMAR}}` has a row in `docs/00-BRIEF.md` §8 · for UI: mobile + desktop screenshots, CLS 0 on the changed pages, motion within the inventory · for system screens: rule-by-rule parity check against `docs/08-REGLAS-SISTEMA.md` written in the PR · no secret in the built output · `docs/10-MEMORY.md` appended if anything was decided, found or deferred · Mateo told in one short Spanish message what was done, what failed, and what is next.

## 12. What is still owed by the client (do not block on it; mark and continue)

Answers to the nine inherited-code contradictions · what the patient signs and when · the full numbered journey · whether real data exists in the old Firebase project · account ownership (Firebase, Netlify, domain, Vercel, cards) · counsel sign-off (launch blocker) · Borna licence · definitive address, phones, hours · matrículas · confirmation channel · cancellation policy · who reads the monthly number · real photos with a date · Drip copy · team and origin texts · who signs news posts and how often · privacy notice text.
