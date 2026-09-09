# 06 — SEGURIDAD

> Threat model for this system, where authentication and authorization are checked, secrets, personal data, incident runbook, the pre-launch gate, and the audit of the inherited system that motivated the rebuild.

## 1. Archetype and tier

`A3 LEADGEN-TX` + `A5 INTERNAL-TOOL` + `SENSITIVE-OVERLAY` → **`S1-BASELINE` + `S2-ACCOUNTS` + `S3-SENSITIVE`**. `S3-08` (counsel sign-off or written client acceptance of risk) is a **launch blocker** (CI-07).

## 2. Threat model (this system, not generic)

| Threat | Likelihood | Impact | Mitigation |
|---|---|---|---|
| A staff member escalates their own permissions | Medium (it is trivial in the inherited system) | Full clinical record access | Permissions in `usuarios` written only by the admin action, checked in the DAL on every read and mutation; Clerk holds no role |
| An ex-employee keeps access | High (turnover) | Reads every patient | Admin suspends in Clerk → session dead on next request; `activo=false` also checked in the DAL |
| Shared reception PC with a 6-month session | Medium | Anyone at the desk reads records | Accepted risk D-005: one account per person, inactivity timeout configurable in Admin (default 0 per the client), OS lock is the client's responsibility, stated in writing |
| Public booking flood / slot stuffing | Medium | Calendar filled with fake bookings | Honeypot + time trap; rate limit 5 bookings/hour per phone and 20/hour per IP; the `EXCLUDE` constraint prevents overbooking regardless |
| Patient data harvested through the public site | Low | Leak | `web/` uses the `sanalys_web` Postgres role with no grant on clinical tables; no patient data is ever rendered publicly |
| XSS on the public site reaching staff sessions | Low | Session theft | Different origin (`sistema.` subdomain); staff cookies are `httpOnly`; CSP with nonces on `sistema/` |
| Stored XSS via news Markdown or bitácora text | Medium | Staff session or defacement | Allowlist sanitizer at render time; no raw HTML from the DB ever |
| Leaked service credential (Neon, R2, Resend, Clerk secret) | Low | Total data exposure | Values only in Vercel env store; post-build grep for every secret value; rotation runbook §7 |
| Signature or audit row edited after the fact | Medium today (anyone can) | Legal evidence worthless | Append-only tables: app role has no `UPDATE/DELETE`; SHA-256 of the signature stored with the row |
| Backup dump exposed | Low | Full leak | Dump encrypted with `age` before upload; key only in GitHub secret + client's password manager; R2 bucket private |
| Free-plan limits reached (Neon compute hours, Resend cap) | Medium | Bookings stop or e-mails stop | Uptime check on `/turnos/`; e-mail failure never blocks a booking; limits written with their consequence |

**Out of scope, verbatim for the client:** nation-state actors, targeted zero-days, physical security of the premises, DDoS beyond what Vercel's free edge absorbs, formal certifications (SOC2 / ISO 27001), 24/7 monitoring unless bought.

## 3. Authentication

- **Provider:** Clerk, production instance on `sistema.sanalys.com.ar`. Sign-in: e-mail + password. **MFA mandatory for every account** (TOTP app; backup codes). No e-mail-code sign-in.
- **Session:** Clerk cookie session (`httpOnly`, `Secure`, `SameSite=Lax`). Maximum lifetime **6 months**; inactivity timeout = the value the admin sets in `config.seguridad.timeoutMinutos` (inherited setting; `0` = no timeout, the client's default) — synchronised to Clerk's session settings by the admin action. Exact ceilings verified in the Clerk dashboard at setup and recorded in `docs/10-MEMORY.md`.
- **Revocation:** suspend in Clerk from the Admin → Usuarios screen (which calls Clerk's backend API) **and** set `usuarios.activo=false`. Both are checked; either kills access on the next request.
- **Patients** never authenticate. A booking is identified by an opaque id in the confirmation URL; it grants nothing.
- Inherited login rate limiting (5 attempts / 15 min in `localStorage`) is replaced by Clerk's server-side protection.

Mistakes checklist, each confirmed handled: no token in `localStorage` ✓ · cookie flags ✓ · rotating refresh by Clerk ✓ · reset links single-use and expiring by Clerk ✓ · no redirect built from user input ✓ · role never read from the request ✓ · no auth decision in middleware (middleware only redirects anonymous users to `/sign-in`) ✓.

## 4. Authorization — the canonical guard

Every Server Action and route handler in `sistema/` starts with:

```ts
// sistema/src/dal/guard.ts — shape; the real file is the canonical version
const { userId } = await auth();                 // Clerk
if (!userId) throw new AuthError('unauthorized');
const u = await db.usuarios.byClerkId(userId);   // one query, cached per request
if (!u || !u.activo) throw new AuthError('unauthorized');
requirePermiso(u, 'caja');                        // or 'admin' — from the DB row only
// row-scoped actions additionally check the row (e.g. the movement's periodo is open)
```

Hand-rolled `if (u.rol === 'admin')` scattered in components is rejected at review. Hiding a sidebar entry is UX; the guard is security.

### 4.1 Role × action matrix

Permissions are additive flags on `usuarios.permisos`; `admin` implies all. `rol='admin'` is the inherited shorthand and maps to the `admin` flag.

| Action | admin | pacientes | agenda | caja | balance | enfermeria | stock/formulas/sueros | legal | crm |
|---|---|---|---|---|---|---|---|---|---|
| Read/write patients, evolutions, plans, files, bitácora, seguridad | ✅ | ✅ | — | — | — | read basic + write evolución 'Enfermería' | — | — | — |
| Export ARCO / HC PDF | ✅ | ✅ | — | — | — | — | — | — | — |
| Agenda: create/edit/cancel/delete turnos | ✅ | — | ✅ | mark `PAGADO` only | — | change to `TRATAMIENTO`/`FINALIZADO` only | — | — | — |
| Cash: tickets, egresos, traspasos, retiros, arqueo, anular | ✅ | — | — | ✅ | — | — | — | — | — |
| Close a period | ✅ | — | — | — | — | — | — | — | — |
| Balance, reports, inversiones | ✅ | — | — | — | ✅ | — | — | — | — |
| Nursing session start/finish, stock decrement | ✅ | — | — | — | — | ✅ | — | — | — |
| Stock, formulas, pedidos, Excel import | ✅ | — | — | — | — | — | ✅ | — | — |
| Consent create/read, WhatsApp | ✅ | — | — | — | — | — | — | ✅ | — |
| CRM leads, convert to patient | ✅ | — | — | — | — | — | — | — | ✅ |
| Users, permissions, config, backup export, audit viewer, analysis export | ✅ | — | — | — | — | — | — | — | — |
| News editor | ✅ | — | — | — | — | — | — | ✅ `{{CONFIRMAR}}` | — |

`{{CONFIRMAR}}` cells are the inherited system's ambiguities (`docs/08-REGLAS-SISTEMA.md` §0.5) — the client decides.

### 4.2 `web/`

No user. Server Actions: `crearTurnoPublico`, `leerDisponibilidad`, `enviarContacto`. Postgres role `sanalys_web` grants: `SELECT` on `salas`, `config` (key `agenda` only via a view), published `novedades`; `INSERT` on `turnos` (+ `SELECT` on `turnos` restricted to `sala_id, puesto, inicio, fin, estado` through a view for availability); `INSERT` on `contactos`. Nothing else.

## 5. Input, rate limits, headers

- One Zod schema per action, parsed first; free text capped (nombre ≤ 80, mensaje ≤ 2000, notas ≤ 2000, cuerpo_md ≤ 20 000); phone normalised to E.164 `+549…`; DNI digits only, 6–9; reject, never sanitise structured fields.
- Rate limits (numbers, not adjectives): booking 5/h per phone, 20/h per IP; contact form 5/h per IP; login handled by Clerk; `sistema/` mutations 120/min per user. Store: Vercel KV is paid → use a Postgres table `rate_limits (key, window_start, count)` with an upsert; good enough at this volume.
- Spam: honeypot field + time trap (≥ 2 s) on both public forms; Turnstile only if abuse is observed.
- Headers on both apps: `Strict-Transport-Security: max-age=63072000; includeSubDomains` · `X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- CSP: `web/` ships the `'unsafe-inline'` baseline (Next inline bootstrap) in `Report-Only` for one week, then enforcing; `sistema/` ships **nonce + `'strict-dynamic'`** from day one (it is `S3`). `connect-src` lists Sentry, Vercel analytics, Clerk; `img-src 'self' data: blob:` plus the R2 signed-URL host; `frame-ancestors 'none'`.
- Files: only PDF, JPG, PNG, WebP ≤ 5 MB (inherited limit); magic-byte check; random server-side key; SVG rejected; images re-encoded server-side (strips EXIF/GPS).

## 6. Secrets — variable names (values only in the Vercel env store per project, and in the client's password manager)

`web/`: `DATABASE_URL` (pooled, role `sanalys_web`), `RESEND_API_KEY`, `RESEND_FROM`, `SENTRY_DSN`, `NEXT_PUBLIC_SITE_URL`, `REVALIDATE_SECRET` (shared with `sistema/` to trigger ISR revalidation).
`sistema/`: `DATABASE_URL` (pooled, role `sanalys_app`), `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `SENTRY_DSN`, `WEB_REVALIDATE_URL`, `REVALIDATE_SECRET`.
GitHub Actions: `DATABASE_URL_DIRECT` (role `sanalys_migrate`, migrations and dumps), `BACKUP_AGE_PUBLIC_KEY`, `R2_*` for the backup bucket.
No `.env.example`. Local dev uses an untracked `.env.local` per app.

Ship gate `S1-06`: after each production build, grep `.next/static` for every secret **value**; zero hits.

## 7. Rotation and leak runbook

Rotate on any suspicion, any staff departure with admin access, any leak. Order: rotate → deploy → revoke old → check provider logs for the exposure window → fix the cause → `G-NNN` in `docs/10-MEMORY.md`. Removing a commit is not a fix.

## 8. Personal data

- Stored: what the clinical workflow provably needs (`docs/03-DATOS.md`), each with a purpose; the `S3-01` field inventory is that document's §3.
- Never logged: DNI, phone, e-mail, clinical text, signatures, tokens. Sentry `beforeSend` scrubs request bodies; identifiers in URLs are opaque uuids only.
- Sub-processors to disclose in the privacy notice: Vercel (hosting, US/EU edge), Neon (database — region chosen at setup, `{{CONFIRMAR}}` `sa-east-1` if offered on free), Clerk (staff identity), Cloudflare (files), Resend (e-mail), Sentry (errors), Meta/WhatsApp (links only, no data sent by us), Vercel Analytics.
- Access to production data is per person (Clerk account + Neon/Vercel collaborator invites), never a shared login. Exports (ARCO, backup, analysis CSVs) write an `auditoria` row with row count (inherited behaviour, kept).
- Marketing pixels: none. A Meta pixel on a page titled with a treatment is a data disclosure; raise with the client before ever adding one.
- **Legal regime (Ley 25.326, habeas data, AAIP, health data as sensitive category): OPEN QUESTION for counsel.** This package never writes "compliant with…". We write what we implemented; the lawyer names the law (OQ-01).

## 9. Audit of the inherited system (2026-09-08, repository snapshot, not the live deploy)

Findings that motivate the rebuild; each is a `G-NNN` in `docs/10-MEMORY.md`.

1. `firestore.rules`: default deny, but every rule is `if request.auth != null`. Any authenticated account reads and writes **all** collections, including `usuarios` → self-promotion to admin from DevTools. Roles enforced only in `sessionStorage` and per-screen `if`s.
2. Deactivation (`activo:false`) checked only in `login.html`; the Firebase Auth account stays valid → a removed employee reads everything with the SDK.
3. If client sign-up is enabled in Firebase Auth settings, anyone with the (public by design) config creates an account and passes `isAuth()`. Unverifiable from the repo.
4. `consentimientos` writable/deletable by anyone authenticated; `auditoria.usuario` is client-supplied.
5. `manual.html` publishes `allow read, write: if true` as the rules and contradicts the code on stock timing — documentation that is wrong.
6. No `storage.rules`; `pacientes.html` uploads to Firebase Storage.
7. Money as JS `number`; comprobante numbers computed in memory (race); dates as locale strings in three formats.
8. Repo snapshot ≠ deploy (`index (4).html`, empty `jspdf.umd.min.js`); Tailwind Play CDN and ~1.5–2.5 MB of render-blocking JS per screen; whole-collection listeners on every screen; `xlsx 0.18.5` with known CVEs; Firebase SDK two majors behind.

Re-entry §6.3 kill rows: money-as-float, untested backup and UI-only authz are positive in the code; whether they *kill* depends on CI-04 (real data). Rebuild chosen either way (D-003).

## 10. Incident runbook (six steps)

1. Contain: suspend the account in Clerk / rotate the credential / disable the action behind a config flag. 2. Preserve: Neon branch from the current state + export Vercel logs (1-hour window on Hobby — act fast). 3. Scope: what data, whose, what window; write it even if "unknown". 4. Notify the client's named contact `{{CONFIRMAR}}` in writing, facts and unknowns separated. 5. Legal path: the client's counsel decides notification obligations — not us. 6. Fix and record (`G-NNN`).

## 11. Pre-launch checklist (live checkboxes, every line ≤ 2 minutes to verify)

**S1** — [ ] HTTPS + HSTS on apex, www and `sistema.` · [ ] headers §5 present · [ ] CSP enforcing on `sistema/`, Report-Only reviewed then enforcing on `web/` · [ ] registrar 2FA + transfer lock, DNS inventoried, no dangling CNAME (Netlify records removed) · [ ] post-build secret grep zero hits · [ ] no secret in git history · [ ] no `.env.example` · [ ] lockfile + `--frozen-lockfile` · [ ] `pnpm audit` zero high/critical · [ ] prod build leaks no stack trace · [ ] honeypot + time trap + server validation on both public forms · [ ] backup exists **and a restore was performed** (date recorded) · [ ] access inventory written with client ownership confirmed (CI-05).
**S2** — [ ] cookies `httpOnly/Secure/SameSite`; nothing in `localStorage` · [ ] `curl` an admin action anonymously → 401 · [ ] role matrix §4.1 matches the code · [ ] `sanalys_web` role cannot select a clinical table (tested) · [ ] MFA on every account · [ ] rate limits live with the §5 numbers · [ ] audit row on every privileged action · [ ] Sentry PII scrub verified with a test error · [ ] session lifetime set and recorded.
**S3** — [ ] field inventory complete with purpose and retention · [ ] retention procedure with a named owner · [ ] log sample: zero PII, zero PII in URLs · [ ] per-person production access, no shared credentials · [ ] exports logged with row counts · [ ] encryption at rest confirmed (Neon) and `sslmode=require` · [ ] sub-processor list in the privacy notice · [ ] breach runbook with the client's named contact · [ ] **counsel sign-off or written client acceptance — LAUNCH BLOCKER**.
**Handover** — [ ] client owns registrar, Vercel, Neon, Clerk, Cloudflare, Resend, GitHub org · [ ] credentials shared via password manager only · [ ] client told in writing what is and is not monitored.

## 12. Deliberately skipped, with reason

| Control | Why skipped |
|---|---|
| RLS | No browser-facing database key; server-only access with two DB roles. Reopen if a client-side data path ever appears |
| Turnstile/CAPTCHA | Conversion tax against an unobserved threat; honeypot + time trap + rate limit first |
| WAF rules | Vercel Hobby allows 3; used for `/sign-in` and `/turnos/` burst caps only |
| Scheduled secret rotation | Event-driven rotation the operator actually performs beats a 90-day policy nobody follows |
| Paid log retention | D-004. Consequence stated: 1-hour logs on incidents |
| Automated retention deletion | Counsel has not set periods (OQ-01); a documented manual procedure with an owner until then |
