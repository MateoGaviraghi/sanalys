# 00 — BRIEF

> What Sanalys is, who uses it, the one number that says it worked, the hard constraints, and what is explicitly out of scope. Written 2026-09-09 from the kickoff audit; client-owned facts are marked `{{CONFIRMAR}}`.

## 1. Business in one line

Sanalys is a private clinic in Santa Fe (AR), **not yet open**, whose core product is IV therapy ("sueroterapia") framed as preventive, personalised, evidence-based medicine. Slogan: *La ciencia de estar bien.* Instagram: `@sanalys.sf` (6 posts, ~250 followers as of 2026-09-08 — no behavioural data exists; direction comes from the identity PDF and the client interview, never from inferred audience preferences).

Registered trademark: the logo carries `®`. Treat the brand as a registered mark in every asset.

## 2. What is being built

Two surfaces in one repository, one domain:

| Surface | Purpose | Who uses it |
|---|---|---|
| `web/` — public site, `sanalys.com.ar` | Attract, explain the 8 treatments and the patient journey, take appointments online, publish news, show the team | Patients on mobile, 4G |
| `sistema/` — internal system, `sistema.sanalys.com.ar` | The clinic's daily tool: agenda, patients (clinical record), nursing, stock, consent, CRM, cash, balance, admin, news editor | Clinic staff, ~5 people |

The internal system already exists as 23 plain-HTML files on Firestore (built by a previous developer, never launched). **It is rebuilt, not migrated**: every screen, rule, text, template and PDF is reproduced exactly (`docs/08-REGLAS-SISTEMA.md`), on Next.js + Postgres, with server-side authorization. Rationale and audit: `docs/06-SEGURIDAD.md` §9 and `docs/10-MEMORY.md` D-003.

## 3. Archetype and tiers

- **PRIMARY `A3 LEADGEN-TX`** — the public site takes bookings that persist. Architecture profile `BOOKING-FUNNEL` (`D-PAY = no`: payment happens at the clinic through the internal cash module).
- **SECONDARY `A5 INTERNAL-TOOL`** — the internal system. Strictly by the gate tree, `G3` (staff login) fires before `G5` (public submits); the split here follows the workspace precedent (silc-estetica): what is *built for the public* is primary, what *staff use* is secondary. Consequence: the internal system is held to `A5` performance gates (LCP and INP **block**).
- **`SENSITIVE-OVERLAY` → `S3-SENSITIVE`.** Verified by fields, not by file names: patients store allergies, diagnoses, treatment plans, vitals, toxic habits, ID number, birth date, health insurance; nursing records store vitals, IV access, batch; consents store ID number plus a handwritten signature image. `S3-08` (counsel sign-off or written client acceptance of risk) is a **launch blocker with a cost**.
- **Data tier `D5`** (Postgres on Neon). **Cost tier**: everything on free plans by explicit decision (D-004).

## 4. Users and their concrete task

| User | Task | Surface |
|---|---|---|
| Prospective patient | Understand what a Drip is, pick one, book a slot from the phone | `web/` |
| Existing patient | Rebook, read a news post, find address and hours | `web/` |
| Reception | Manage today's agenda, register the patient, collect payment, close the cash drawer | `sistema/` |
| Nurse | See who paid and is waiting, record vitals, start and end the IV session | `sistema/` |
| Doctor (2 founders) | Clinical record, evolutions, budgets, consent, prescriptions, fees | `sistema/` |
| Admin (founders) | Configure everything, users and permissions, balance, backups, publish news | `sistema/` |

Roles are **module permissions** (10 flags), exactly as the inherited system: `admin`, `pacientes`, `stock`, `formulas`, `caja`, `balance`, `agenda`, `enfermeria`, `sueros`, `legal`. A `crm` permission is added because the inherited dashboard required a `leads` permission nobody could grant (G-004).

## 5. The one measurable goal (`D-MEASURE`)

| Field | Value |
|---|---|
| The number | **Appointments booked online per month** |
| Where it fires | `/turnos/confirmado/` — a distinct URL, never a toast |
| What records it | Vercel Web Analytics (free) on the client's Vercel account, event `turno_confirmado` |
| Who reads it | `{{CONFIRMAR}}` — one named founder, monthly |

Secondary: the internal system's own agenda counts every appointment (online or at the desk) by `origen`.

## 6. Hard constraints

1. **Free plans only, no exceptions, by the operator's decision** (D-004): Vercel Hobby, Neon Free, Clerk Free, Sentry Developer, Cloudflare R2 Free, Resend Free. Each limit is read from the provider on the day it is configured and written with its consequence in `docs/10-MEMORY.md`.
2. **One domain**, promised to the client. Resolved by subdomain (`sistema.`), never by path — different origins mean different cookies, storage and CSP (D-001).
3. **The inherited system's behaviour is respected verbatim**: screens, rules, formulas, formats, texts, WhatsApp templates, PDFs, defaults. Where the inherited code contradicts itself, the client decides (`docs/08-REGLAS-SISTEMA.md` §0).
4. **No real photographs exist yet.** The site is built complete with hard-coded placeholder photos under the brand's duotone treatment; real photos replace files later (D-008). Placeholders never ship to production without the client's written acceptance.
5. **Mobile first, 4G.** Budgets in `docs/05-DISENO.md` §6. CLS blocks everywhere; LCP and INP block on `sistema/`.
6. **Health data**: no invented data, no legal claims by us, `{{CONFIRMAR}}` on every credential, matrícula, price, address and claim.
7. **Single operator, single thread.** One work unit, one PR, one written `GO-AHEAD` before each (`docs/11-ROADMAP.md`).

## 7. Non-goals (explicit)

- Booking bot / conversational agent — last roadmap item, after launch, not designed.
- Outbound WhatsApp automation (reminders, confirmations via Meta API) — requires WABA, a dedicated number and template approval; not in scope. Inbound `wa.me` links only.
- Online payment (Mercado Pago) — payment happens at the clinic; `D-PAY = no`.
- Patient accounts / patient portal — patients identify by phone + ID number at booking; no login.
- Multi-tenancy — one clinic, written down with the reopening trigger "¿se lo podemos vender a otra clínica?" (D-013).
- Migrating the inherited HTML code — it is rebuilt from its rules, not ported.
- Any paid plan, until the operator reverses D-004.

## 8. Client inputs ledger (`CI` = access/decisions, `CR` = content)

Status values: `PENDIENTE` · `PARCIAL` · `RECIBIDO` · `WAIVED` · `CANCELADO`. Owner is a named person, never "the clinic".

| ID | What | Tier | Owner | Consequence if missing | Status |
|---|---|---|---|---|---|
| CI-01 | Answer the 8 code contradictions in `docs/08-REGLAS-SISTEMA.md` §0 | HARD-BLOCK for units 14–21 | `{{CONFIRMAR}}` | Those screens cannot be specified to parity | PENDIENTE |
| CI-02 | What exactly the patient signs (treatment consent vs. booking), when, and who may read it | HARD-BLOCK for the signature part of unit 8 and unit 19 | `{{CONFIRMAR}}` | Booking ships without signature; consent stays in-clinic as today | PENDIENTE |
| CI-03 | The full numbered patient journey (Paso 01 · El escaneo inicial … Paso N) and where the Drip choice sits | SHIP-BLOCK for units 6–7 | `{{CONFIRMAR}}` | Pages built with `{{CONFIRMAR}}` step names; do not launch | PENDIENTE |
| CI-04 | Whether real data (patients, cash, investments) exists today in Firebase project `sanalys-2263e` | HARD-BLOCK for unit 24 | Mateo | Decides whether migration exists and whether re-entry §6.3 kill rows apply | PENDIENTE |
| CI-05 | Ownership of: Firebase project, Netlify account, domain + registrar, Vercel account, which card pays what | SHIP-BLOCK | `{{CONFIRMAR}}` | Launch date not promised until the client owns registrar and hosting | PENDIENTE |
| CI-06 | The deployment source actually running on Netlify (the `sanalys-v2.zip`) — the repo snapshot is not the deploy (G-008) | DEFERRABLE | Mateo | Rules were extracted from the snapshot; a diff against the live zip is a 30-min check | PENDIENTE |
| CI-07 | Counsel: consent signature validity, health-data obligations, privacy notice text | **LAUNCH BLOCKER** (`S3-08`) | `{{CONFIRMAR}}` | Written client acceptance of risk is the only alternative | PENDIENTE |
| CI-08 | Borna web-font licence (identity typeface) | SHIP-BLOCK for unit 3 | `{{CONFIRMAR}}` | Fallback: headings in Roboto Flex at heavy weight, written as D-NNN | PENDIENTE |
| CI-09 | Definitive address, phone, e-mail, hours (PDF says Avellaneda 3365 / 342 445-2643; code says 25 de Mayo 1845 / 342 452-8533) | SHIP-BLOCK | `{{CONFIRMAR}}` | `{{CONFIRMAR}}` on Contact and footer; no launch | PENDIENTE |
| CI-10 | Matrículas and titles of each doctor (the PDF prints the same MP number on two different cards) | SHIP-BLOCK | `{{CONFIRMAR}}` | Credentials block does not ship | PENDIENTE |
| CI-11 | Booking confirmation channel: e-mail only, or e-mail + `wa.me` button (default) | DEFERRABLE | `{{CONFIRMAR}}` | Default ships | PENDIENTE |
| CI-12 | Cancellation policy text and window | SHIP-BLOCK for unit 8 | `{{CONFIRMAR}}` | Shown as `{{CONFIRMAR}}`; booking does not launch | PENDIENTE |
| CI-13 | Who reads the monthly number (D-MEASURE) | DEFERRABLE | `{{CONFIRMAR}}` | Written `NONE` | PENDIENTE |
| CR-01 | Real photography: hero, space, each team member — with an estimated date | SHIP-BLOCK for launch of Home and Nosotros | `{{CONFIRMAR}}` | Placeholders stay; launch with placeholders only with written acceptance | PARCIAL — 2026-09-11: facade, application room, boxes and patio shown in chat (docs/14-MARCA §9); files not yet in the repo; team photos still missing |
| CR-02 | 40–60 words per Drip (8) beyond the one-liner the PDF already has | SHIP-BLOCK | `{{CONFIRMAR}}` | Page shows the PDF one-liner only | PENDIENTE |
| CR-03 | Team stories and the "how Sanalys was born" text | SHIP-BLOCK for Nosotros | `{{CONFIRMAR}}` | Placeholder copy in Spanish, never published | PENDIENTE |
| CR-04 | Novedades: who signs each post (matrícula), cadence, what happens if nobody feeds it | SHIP-BLOCK for unit 10 | `{{CONFIRMAR}}` | Section exists, empty state designed, no posts | PENDIENTE |
| CR-05 | Privacy notice reviewed by counsel | SHIP-BLOCK | `{{CONFIRMAR}}` | Route exists with `{{CONFIRMAR}}`; no launch | PENDIENTE |

## 9. Evidence hierarchy used

Level 1 (behavioural numbers) does not exist for this client. Direction comes from: the identity PDF (`brandign-sanalys/…/sanalys - ID - VF.pdf`, Nov 2025, canonical), Instagram as confirmation of application, and the client interview asking for concrete cases. Any sentence of the form "their audience will respond to X" is unsupported and is not written anywhere in this package.
