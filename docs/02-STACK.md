# 02 — STACK

> Every layer with its exact version (verified against the npm registry on 2026-09-09), the reason, and the trigger that would invert it. Re-pin to the current patch on the day of the first `pnpm install`; never "latest".

## 1. Decisions (`D-*`)

| Decision | Value |
|---|---|
| `D-ARCH` | `A3 LEADGEN-TX` primary + `A5 INTERNAL-TOOL` secondary, profile `BOOKING-FUNNEL` |
| `D-RENDER` | Next.js App Router; SSG by default in `web/`, ISR for news, SSR in `sistema/` (`docs/01-ARQUITECTURA.md` §4) |
| `D-RUNTIME` | Node.js on Vercel serverless; TypeScript everywhere; no separate backend |
| `D-DATA` | Postgres on Neon (free), Drizzle ORM; Firestore is abandoned |
| `D-AUTH` | Clerk (free) for staff; no patient accounts; roles in the DB |
| `D-PAY` | none — payment at the clinic |
| `D-EDIT` | News edited by the client inside `sistema/` (own editor screen); all other copy in the repo, edited by Mateo |
| `D-MSG` | E-mail via Resend (free) + `wa.me` deep links; no outbound WhatsApp automation |
| `D-FILES` | Cloudflare R2 (free), private bucket, signed URLs, S3 API |
| `D-JOBS` | GitHub Actions cron for backups only |
| `D-OBS` | Sentry (free) for errors, Vercel Speed Insights + Web Analytics (free) for field vitals and the D-MEASURE event, one external uptime check |
| `D-HOST` | Vercel Hobby, two projects, client-owned account |
| `D-IDENT` | Identity PDF (Nov 2025) is canonical; `docs/05-DISENO.md` |
| `D-TRAFFIC` | Brand-driven (Instagram bio, word of mouth) → conversion-led structure; local search on "sueroterapia santa fe" as secondary |
| `D-MEASURE` | Online bookings per month, event on `/turnos/confirmado/` |
| `D-LEGAL` | `S3-SENSITIVE`; counsel sign-off is a launch blocker (CI-07) |
| `D-PERF` | CLS ≤ 0.1 blocks everywhere; LCP ≤ 2.5 s and INP ≤ 200 ms at p75 block on `sistema/`, warn on `web/` |
| `D-PHASE` | `docs/11-ROADMAP.md` — foundations → public site complete → internal system complete → closing |
| `D-HANDOFF` | Client owns every account; Mateo is a collaborator; support terms `{{CONFIRMAR}}` (OQ-09) |

## 2. Shared by both apps

| Layer | Package | Version | Why | Inverts at |
|---|---|---|---|---|
| Framework | `next` | 16.3.4 | One deployable per surface, Server Actions, the workspace vault is written against Next 16 | Never for this project |
| UI | `react`, `react-dom` | 19.2.8 | Paired with Next 16 | — |
| Language | `typescript` | **5.9.3** | TS 7 (Go compiler) shipped weeks ago; a new major is not adopted on a health system | When Next declares TS 7 support and one project in the workspace has run it for a quarter |
| Styles | `tailwindcss`, `@tailwindcss/postcss` | 4.3.3 | Compiled at build, tokens as CSS variables; replaces the inherited Play CDN | — |
| Validation | `zod` | 4.5.4 | One schema per boundary, shared client/server | — |
| ORM | `drizzle-orm` / `drizzle-kit` | 0.45.2 / 0.31.10 | Schema as code, migrations in the repo, typed queries | — |
| DB driver | `@neondatabase/serverless` | 1.1.0 | Built for serverless; pooled connection string in runtime, direct string for migrations only | — |
| Money | `decimal.js` | 10.6.0 | Never a JS `number` for an amount | — |
| Dates | `date-fns`, `date-fns-tz` | 4.4.0 / 3.2.0 | UTC in the DB, `America/Argentina/Buenos_Aires` on screen | — |
| Env | `@t3-oss/env-nextjs` | 0.13.11 | Validated env module; no inline `process.env.X` | — |
| Errors | `@sentry/nextjs` | 10.73.0 | Free tier, PII scrubbing on | — |
| Fonts | `@fontsource-variable/roboto-flex` | 5.3.0 | Self-hosted body face from the identity; Borna (display) supplied by the client under its licence (CI-08) | — |
| Package manager | `pnpm` | 12.3.4 | Workspaces: `web`, `sistema`, `packages/*` | — |
| Tests | `vitest` | **4.1.11** | The four critical tests (chair exclusivity, double submit, RBAC negative, period lock) run as Vitest integration tests against a Neon dev branch. Vitest 5.0.0 shipped 2026-09-05 and is not adopted days after its release | When 5.x has a month of patch releases |
| Lint | `eslint` + `eslint-config-next` | 10.10.0 / 16.3.4 | Flat config `eslint.config.mjs` at the root; Next 16 has no `next lint` | — |
| Browser E2E | `@playwright/test` | 1.63.0 — **not installed by default** | Only if a critical test cannot be expressed against Server Actions | WU-08 decides |

## 3. `web/` only

| Need | Package | Version | Note |
|---|---|---|---|
| Motion | `gsap`, `@gsap/react` | 3.15.0 / 2.1.2 | Fully free incl. SplitText and ScrollTrigger. **The only motion engine** — no Framer Motion |
| Smooth scroll | `lenis` | 1.3.26 | Off under `prefers-reduced-motion` |
| Carousels | `embla-carousel-react` | 8.6.0 | Dots with real state, no autoplay by default (`docs/05-DISENO.md` §6) |
| 3D | `three`, `@react-three/fiber` | 0.186.0 / 9.7.0 | **Not installed by default.** Enters only if the design step (unit 4) proves one element earns it under the mobile budget |
| Analytics / vitals | `@vercel/analytics`, `@vercel/speed-insights` | 2.0.1 / 2.0.0 | D-MEASURE event + field CWV |
| E-mail | `resend` | 6.26.0 | Booking confirmation |

## 4. `sistema/` only

| Need | Package | Version | Note |
|---|---|---|---|
| Identity | `@clerk/nextjs` | 7.9.1 | Production instance on `sistema.sanalys.com.ar`; password + TOTP MFA; max session lifetime 6 months, inactivity timeout mapped to the inherited `config/seguridad.timeoutMinutos` (0 = off). Exact ceiling verified in the Clerk dashboard on setup |
| PDF | `jspdf`, `jspdf-autotable` | 4.2.1 / 5.0.8 | Loaded lazily on "exportar"; the inherited `pdf-master.js` templates are ported so PDFs look identical (jsPDF moved two majors: API deltas checked in unit 15) |
| Excel import | `read-excel-file` | 9.3.10 | Replaces `xlsx` (npm build frozen at 0.18.5 with known CVEs) |
| Excel export | `write-excel-file` | 4.1.1 | Same reason |
| Files | `@aws-sdk/client-s3` | 3.1128.0 | R2 is S3-compatible; server-side only |
| Charts | `chart.js` | pin on install | Inherited balance/CRM charts; lazy-loaded |

## 5. Free-plan limits (read from each provider on setup day; write the number and its consequence in `docs/10-MEMORY.md`)

| Provider | Plan | Known consequence to write down |
|---|---|---|
| Vercel | Hobby | **Commercial use prohibited by ToS** — accepted risk D-012. 1-hour logs, 3 WAF rules, no team seats |
| Neon | Free | Compute autosuspends after minutes idle → ~1 s cold start; short PITR window → our own daily encrypted dump is mandatory; storage and compute-hour caps |
| Clerk | Free | MAU ceiling far above a clinic's staff; production instance requires the custom domain |
| Sentry | Developer | Event quota; scrub PII |
| Cloudflare R2 | Free | 10 GB-class storage, egress free; verify the operations quota |
| Resend | Free | Daily/monthly send cap; sender domain verification on `sanalys.com.ar` |
| GitHub Actions | Free | Minutes quota on a private repo; the backup job is ~2 min/day |

## 6. PROHIBITED IN THIS PROJECT

Supabase (any product) · Firebase (Auth, Firestore, Storage, Hosting) · Railway · Netlify · Tailwind Play CDN · `xlsx` from npm · Framer Motion / `motion` (GSAP only) · tokens or sessions in `localStorage` · money as a JS `number` · authorization only in middleware or in the UI · Inter, Geist or Space Grotesk as typefaces · untouched shadcn defaults · `.env.example` files · `NEXT_PUBLIC_` on anything that is not safe on a billboard · AI-suggested packages installed without opening their registry page · a second motion engine · a headless CMS · any paid plan without a new D-NNN reversing D-004.

## 7. Pinning and dependency policy

- Exact versions in `package.json` (no `^`), one `pnpm-lock.yaml`, CI installs with `pnpm install --frozen-lockfile`.
- Adopting a new major: only in its own work unit, after reading the changelog, never mid-feature.
- Every new package: open its npm page, check exact name, publish date, weekly downloads, last release ≤ 12 months, and record a one-line verdict in `docs/10-MEMORY.md` before installing.
- `pnpm audit` weekly, triage moderates, block on high/critical.
