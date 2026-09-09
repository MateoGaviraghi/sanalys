# 01 — ARQUITECTURA

> The shape of the system as an ADR: context, options evaluated, decision, consequences, block diagram, rendering map, state placement, failure modes. Vendors and versions live in `docs/02-STACK.md`.

## 1. Context

- Two surfaces (public site + internal system), one client, one domain, one operator.
- The internal system exists as plain HTML on Firestore with authorization only in the UI (see `docs/06-SEGURIDAD.md` §9). Its data layer must be rewritten to leave Firestore; the rest is rewritten with it.
- Health data (`S3`), so blast radius and origin isolation matter more than in a brochure site.
- Everything on free plans (D-004).

## 2. Decision — one repo, two Next.js apps, one shared database package, no separate backend

```
sanalys/
  web/        Next.js — public site        → Vercel project "sanalys-web"     → sanalys.com.ar
  sistema/    Next.js — internal system    → Vercel project "sanalys-sistema" → sistema.sanalys.com.ar
  packages/db     Drizzle schema, migrations, seeds, typed queries — the ONLY code that talks to Postgres
  packages/brand  tokens (OKLCH), fonts, Tailwind preset
  docs/       this package
```

- Each app is its own Vercel project with its own deploy, env vars and domain. A push touching only `web/` does not deploy `sistema/` (Vercel "Ignored Build Step" per project, keyed on the changed paths).
- Both apps reach Postgres through `packages/db` from **server code only** (Server Actions and route handlers). The browser never holds a database credential.
- Authorization is decided in the data-access layer of each app (`sistema/src/dal/*`), not in middleware, not in the UI.
- No separate API service. Real-time in the internal system is **polling** (5–10 s) on the two or three screens that need it (waiting room, cash balances, agenda day view). See ADR-B.

### Alternatives considered

**ADR-A — repo and deploy shape**

| Option | Tier | Best for | Trade-offs | Verdict |
|---|---|---|---|---|
| A. One repo, one deploy, the system inside the public Next app | Free | nothing here | Same origin for public and staff: a compromised landing script reads the staff session. A landing deploy can break the clinic's tool. | Rejected |
| **B. One repo, two apps, two deploys** | Free | one operator, one domain, isolated blast radius | Two Vercel projects to configure; shared git history | **Chosen** |
| C. Two repos | Free | handing the system to another team | Two CIs, two places to look, duplicated schema types | Rejected |

**ADR-B — separate backend on Railway vs. none**

| Option | Tier | Best for | Trade-offs | Verdict |
|---|---|---|---|---|
| X. No backend; each app uses Server Actions + `packages/db` | Free | solo operator, doctrine default | No persistent process → no push realtime; polling instead | **Chosen** |
| Y. Node API on Railway with SSE, both apps as clients | Paid (usage) | true push realtime | A fourth deployable; authz written far from the data; Railway has no free plan that fits D-004 | Rejected. Reopen if polling becomes a user-visible complaint |

**ADR-C — Firestore vs. Postgres** — see `docs/02-STACK.md` D-DATA and `docs/10-MEMORY.md` D-002.

## 3. Block diagram

```mermaid
flowchart LR
  P[Patient · 4G phone] --> EDGE_W[EDGE · Vercel CDN]
  S[Staff · clinic PC / phone] --> EDGE_S[EDGE · Vercel CDN]
  EDGE_W --> WEB[APP · web/ Next.js 16]
  EDGE_S --> SIS[APP · sistema/ Next.js 16]
  WEB -- packages/db, server only --> DB[(DB · Postgres on Neon)]
  SIS -- packages/db, server only --> DB
  SIS --> STORE[(STORE · Cloudflare R2, private, signed URLs)]
  SIS --> EXT_CLERK[EXT · Clerk — staff identity]
  WEB --> EXT_MAIL[EXT · Resend — booking e-mail]
  WEB -. wa.me deep link .-> EXT_WA[EXT · WhatsApp, inbound only]
  JOBS[JOBS · GitHub Actions cron] -- pg_dump, encrypted --> STORE
  JOBS -. reads .-> DB
  WEB --> OBS[OBS · Sentry + Vercel Speed Insights + uptime check]
  SIS --> OBS
```

Seven blocks, no eighth. `JOBS` is the backup cron only; there is no queue because nothing is enqueued (bookings send one e-mail synchronously after commit, with a timeout and a logged fallback).

## 4. Rendering map

| Route group | Mode | Why |
|---|---|---|
| `web/` `/`, `/tratamientos/*`, `/nosotros/`, `/contacto/`, `/privacidad/`, `404` | **SSG** | Content changes on deploy; 4G LCP wins by default |
| `web/` `/novedades/`, `/novedades/[slug]/` | **ISR + on-demand revalidation** | The client publishes from `sistema/`; must appear within minutes without a deploy. Publish action calls `revalidatePath` on both routes |
| `web/` `/turnos/` | **Static shell + client-fetched availability** | Slots must be exact at read time; the page itself is static; availability is a Server Action read, never cached at the CDN |
| `web/` `/turnos/confirmado/` | SSG, `noindex` | Distinct URL for measurement |
| `sistema/` everything | **SSR per request, `noindex`, no CDN cache** | Behind login, role-dependent |

## 5. State placement

| Fact | Sole owner | Cache | Invalidation |
|---|---|---|---|
| Slot availability | `DB` — `turnos` + `EXCLUDE` constraint | none | — |
| Money amounts, comprobante numbers, period locks | `DB` (`numeric(12,2)`, sequences, `periodos_cerrados`) | none | — |
| Roles and module permissions | `DB` `usuarios` row keyed by Clerk user id — **the single source**; Clerk holds identity only | none | — |
| Staff identity and session | Clerk (httpOnly cookie) | — | Clerk revocation is immediate |
| Config documents (14) | `DB` `config` table | request-scoped in `sistema/` | on write |
| Published news | `DB` `novedades` | ISR HTML in `web/` | `revalidatePath` on publish/unpublish |
| Files, signatures | `STORE` R2 private; `DB` holds key + SHA-256 | — | — |
| Consent, audit rows | `DB`, append-only (app role has no UPDATE/DELETE) | — | — |
| Client-side UI state | browser memory | — | Never a price, a role or a slot |

## 6. Integrations

| Integration | Pattern | Authority | Failure mode |
|---|---|---|---|
| Clerk | Synchronous, unavoidable, `sistema/` only | Clerk for identity | Login down → system down; nothing else depends on it |
| Resend (booking confirmation e-mail) | After the booking commits, one send with 5 s timeout, result logged on the `turnos` row (`email_enviado_at`, `email_error`) | Ours | Send fails → booking still confirmed; confirmation page shows the `wa.me` button and reception sees the row |
| WhatsApp | `wa.me` deep links with per-context prefilled text (patient side and staff side, exactly the inherited templates) | Nobody | None; it is a link |
| Cloudflare R2 (S3 API) | Server-side upload from `sistema/`, signed GET URLs valid ≤ 10 min | Ours | Upload fails → the record saves without the file, user told to retry |
| Vercel Web Analytics / Speed Insights | Client, deferred | Disposable | Blocked script must not shift layout |
| Sentry | Server + client, PII scrubbing on | Disposable | — |

No webhooks exist in this system. No payment provider.

## 7. Jobs

| Job | Where | Schedule | On failure |
|---|---|---|---|
| Encrypted `pg_dump` to R2 | GitHub Actions cron | daily 03:30 America/Argentina/Buenos_Aires | Workflow fails visibly; a second missed day pages the operator by e-mail |
| Restore drill | Manual, documented in `docs/07-REPO.md` | before launch, then quarterly | Untested backup = no backup |

Deliberately absent: reminder sending, auto-archiving, retention deletion — all exist as config in the inherited admin but nothing implemented them (G-006). They enter only as explicit work units if the client asks (OQ-07).

## 8. Failure modes

| Breaks | Patient sees | Operator does |
|---|---|---|
| Neon cold start (free plan) | First availability read of the morning takes ~1 s more | Nothing; accepted (D-004) |
| Neon down | Static pages still render; `/turnos/` shows "No podemos mostrar horarios ahora — escribinos por WhatsApp" with the `wa.me` link | Check Neon status; nothing to redeploy |
| Vercel down | Site down | Status page; no action possible on free plan |
| Clerk down | Staff cannot log in; logged-in sessions keep working until they expire | Wait; no fallback by design (one identity provider) |
| Resend down | Booking confirmed on screen, e-mail missing, `wa.me` button offered | Reception sees the booking in the agenda regardless |
| R2 down | File upload fails with a retry message; record saved | Retry later |
| A bad deploy of `web/` | Public site broken; `sistema/` untouched | Vercel instant rollback (`docs/07-REPO.md`) |
| A bad deploy of `sistema/` | Staff tool broken; public site untouched | Same rollback |

## 9. Explicitly rejected (someone will propose them later)

Microservices · a message broker · Redis · websockets for data that changes a few times an hour · a headless CMS for Novedades (the editor lives in `sistema/`) · a shared React component library between the two apps (share tokens, not components) · Docker for local dev · multi-region · i18n · Terraform.
