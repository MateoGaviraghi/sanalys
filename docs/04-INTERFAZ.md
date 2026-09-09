# 04 — INTERFAZ

> Page map of both surfaces, block sequence per public page with what each block says and why it sits there, mandatory states, navigation and URL rules, component inventory. Visual decisions live in `docs/05-DISENO.md`; the internal screens' behaviour lives in `docs/08-REGLAS-SISTEMA.md`.

## 1. Public site — sitemap (v1 · 2026-09-09)

Project archetype `A3` · Data tier `D5` · Security `S1+S2+S3`

| # | URL | Archetype | Tier | Primary action | Search intent |
|---|---|---|---|---|---|
| 1 | `/` | A-HOME | A | Go to `/turnos/` | brand: "sanalys santa fe" |
| 2 | `/tratamientos/` | A-SERVICE-INDEX | A | Open a Drip | "sueroterapia santa fe" |
| 3 | `/tratamientos/[drip]/` | A-SERVICE-DETAIL (template ×8) | A | Book this Drip | "drip detox santa fe" (weak) |
| 4 | `/turnos/` | A-BOOKING | A | Confirm a slot | "sanalys turnos" |
| 5 | `/nosotros/` | A-ABOUT | B | Book | — |
| 6 | `/novedades/` | A-BLOG-INDEX | B | Open a post | informational |
| 7 | `/novedades/[slug]/` | A-BLOG-POST (template) | B | Go to a treatment | informational |
| 8 | `/contacto/` | A-CONTACT | B (measured as A) | WhatsApp | "sanalys contacto" |
| 9 | `/privacidad/` | A-LEGAL | C | — | — |
| 10 | `/turnos/confirmado/` | A-THANKYOU | C | Save the date / WhatsApp | — |
| 11 | `404` | A-404 | C | Back to a hub | — |

Page tier A count: **4 / 6**. Templates: 2 (`[drip]`, `[slug]`). Nothing cut: this is the client's requested scope in full (D-007).

The 8 Drips (`[drip]` slugs): `detox-vital`, `escudo-antioxidante`, `recuperacion-deportiva`, `impulso-celular`, `equilibrio-mental`, `anti-estres-plus`, `renovacion-celular`, `juventud-activa` — names and one-liners from the identity PDF p.28; longer copy is CR-02.

### 1.1 `/` — Home

Purpose: route and convince in one screen; the site's only page that carries a photographic hero.

| # | Block | What it says / holds | Why here |
|---|---|---|---|
| 01 | `NAV.sections` | Tratamientos · Turnos · Nosotros · Novedades · Contacto · persistent CTA "Reservar turno" | Money pages reachable from every scroll position |
| 02 | `HERO.split` | Positioning line with the lime highlighter on the key words (e.g. *La ciencia de **estar bien.***), one supporting sentence, CTA "Reservar turno", secondary "Ver tratamientos". **Photo slot**: professional hero photo (placeholder now, real later — CR-01), duotone treatment | First screen states what this is and what to do |
| 03 | `PROOF-STRIP.credentials` | Matrículas, formación, "medicina basada en evidencia" — numbers and credentials, each `{{CONFIRMAR}}` (CI-10) | Salud: credibility before any argument |
| 04 | `VALUE-PROP` | What Sanalys solves and for whom: preventive, personalised, "no hay protocolos genéricos, hay personas únicas" | The client's own claim, verified on Instagram |
| 05 | `FEATURE-GRID.cards-link` (carousel on mobile, Embla) | The 8 Drips as cards: number, name, one-liner, "Reservar" | Inventory of comparable peers → grid/carousel, not a fork |
| 06 | `PROCESS-STEPS.numbered-cards` | The patient journey: Paso 01 · El escaneo inicial … (CI-03) | Kills "¿qué me van a hacer?" |
| 07 | `SPLIT-FEATURE` | How Sanalys was born, short, link to `/nosotros/` | The face is the product in salud |
| 08 | `CTA-BAND.full-bleed` | "Reservar turno" on lime ground | Decision point |
| 09 | `MAP-LOCATION.static-image+link` | Address, hours, WhatsApp, static map image linking to Google Maps (never an embedded map) | Physical existence is part of trust; embeds are the top LCP offender |
| 10 | `FOOTER` | Identity + matrículas · Tratamientos (8 links) · Nosotros/Novedades · Contacto/Legal | Internal links to money pages from every page |

States: loading none (static); error none.

### 1.2 `/tratamientos/`

`NAV → HERO.statement ("Ocho protocolos. Una persona a la vez." style, {{CONFIRMAR}} wording) → PROCESS-STEPS (the numbered journey, full) → FEATURE-GRID.cards-link ×8 (each card: Drip #, name, one-liner, duration {{CONFIRMAR}}, "Reservar") → FAQ.accordion (6–8 real questions; until real patient questions exist, the client supplies them — CR-02) → CTA-BAND → FOOTER`

### 1.3 `/tratamientos/[drip]/`

`NAV → HERO (Drip # and name on its own colour ground from the PDF label system: verde / gris / fluo, alternating as on p.28) → VALUE-PROP (what it is for, who it is for, who it is NOT for — {{CONFIRMAR}}) → SPEC-TABLE (duration, frequency, preparation, "consultar" for price — never an invented number) → PROCESS-STEPS (what happens in the session) → FAQ.accordion (3) → CTA-BAND ("Reservar {Drip}", pre-selects the treatment in `/turnos/`) → RELATED-LINKS (other Drips) → FOOTER`. Breadcrumbs required. `Service` schema without `Offer`.

### 1.4 `/turnos/` — the core

`NAV.simple → BOOKING-WIDGET → STATUS-PANEL → FOOTER.minimal`

One decision per screen, all inside the widget, URL state in query params so back/refresh never lose progress:

1. **Tratamiento** — the 8 Drips (+ "Consulta médica / Escaneo inicial" if CI-03 says the journey starts there); pre-filled from a Drip page.
2. **Día** — calendar (keyboard-navigable, `aria` grid, month paging, closed days and `bloqueos` disabled with a reason, timezone fixed to Buenos Aires regardless of device).
3. **Hora** — slots from `salas.horarios` for salas of `tipo = 'sueros'` (or `consulta` for the consultation), generated with the inherited rule (`duracion` step per franja), **occupied slots shown as taken, never hidden**, capacity aware (a slot with 1 of 3 chairs free is bookable).
4. **Datos** — nombre y apellido, DNI, teléfono (E.164 normalised), e-mail; honeypot + time trap; server-side Zod.
5. **Confirmar** — summary, cancellation policy visible before the button (CI-12), the signature step **only if CI-02 says the patient signs at booking** (otherwise nothing), button "Confirmar turno" with pending state (text + opacity, no spinner, `--dur-1`).

Server Action `crearTurnoPublico`: transaction → pick first free `puesto` → insert `turnos` (`origen='web'`, `estado='PENDIENTE'`) → `EXCLUDE` guards the race → send e-mail (5 s timeout, logged) → redirect to `/turnos/confirmado/?t=<opaque id>`.

Animated confirmation ("la alerta de turno reservado animada"): lives on the confirmation page as a `STATUS-PANEL` entrance, announced via `role="status"` without moving focus.

States (mandatory): loading (skeleton for the slot grid, height reserved) · empty-filtered ("No hay horarios ese día — probá otro") · error-recoverable (DB unreachable → "No podemos mostrar horarios ahora" + `wa.me` link; typed data preserved) · stale (slot taken between selection and confirm → inline message, return to step 3 with the grid refreshed).

### 1.5 `/turnos/confirmado/`

`NAV.simple → STATUS-PANEL (animated: what was booked, day, hour, treatment, reference) → PROCESS-STEPS (what happens next, preparation — {{CONFIRMAR}}) → CTA-BAND.secondary (add to calendar `.ics`, WhatsApp `wa.me` with the inherited *confirmacion_turno* text) → FOOTER`. `noindex`. Fires `turno_confirmado`.

### 1.6 `/nosotros/`

`NAV → HERO (how Sanalys was born — CR-03) → TEAM (one card per member: real photo (placeholder now), name, role, matrícula, titles list — CI-10) → TIMELINE (short) → PROOF-STRIP.credentials → CTA-BAND → FOOTER`. Team photos: placeholder in preview only; **Nosotros does not launch without real photos unless the client accepts it in writing** (D-008).

### 1.7 `/novedades/` and `/novedades/[slug]/`

Index: `NAV → HERO.statement → LIST-FEED (date visible, author, cover, pagination) → CTA-BAND → FOOTER`. `EMPTY-STATE.first-run` designed ("Pronto vas a encontrar acá…") because the section may launch empty.
Post: `NAV → HERO.statement → AUTHOR-META (named doctor + matrícula, published and updated dates — mandatory) → CONTENT-BODY (Markdown rendered with an allowlist sanitizer at render time) → CTA-BAND (contextual, to a treatment) → RELATED-LINKS → FOOTER`. `BlogPosting` schema, breadcrumbs.

### 1.8 `/contacto/`

`NAV → HERO.statement → MAP-LOCATION (address, hours incl. holidays, `tel:`, `wa.me`, Instagram, static map) → LEAD-FORM.short (nombre, teléfono, mensaje; honeypot + time trap; e-mails the clinic via Resend) → FAQ.accordion (logistics: parking, access) → FOOTER`. NAP must match the Google Business Profile character for character (CI-09).

### 1.9 `/privacidad/`, `404`

Legal: `NAV → CONTENT-BODY → FOOTER`; last-updated date, controller, what is collected, third parties (Vercel, Neon, Clerk, Resend, R2, Sentry, WhatsApp), retention, deletion request path; text `{{CONFIRMAR}}` by counsel (CR-05). 404: `NAV → HERO.statement → FEATURE-GRID.cards-link (Tratamientos, Turnos, Contacto) → FOOTER`, real HTTP 404, no jokes (salud).

## 2. Internal system — screen map

Every route `noindex`, behind Clerk, authorization in the DAL per screen. Left sidebar identical to the inherited one (same order, same icons, same permission per entry).

| Route | Inherited file | Permission | Screen archetype |
|---|---|---|---|
| `/` | `index.html` | any logged-in user; cards hidden per permission | APP-DASHBOARD |
| `/agenda` | `agenda.html` | `agenda` | APP-LIST + calendar |
| `/caja` | `caja.html` | `caja` | APP-FORM + APP-LIST |
| `/pacientes`, `/pacientes/[id]` | `pacientes.html` | `pacientes` | APP-LIST, APP-DETAIL (tabs: datos, bio-perfil, evoluciones, perfil, presupuestos, archivos, bitácora, seguridad, documentos, pagos) |
| `/enfermeria` | `enfermeria.html` | `enfermeria` | APP-DASHBOARD (waiting room / chairs / done) |
| `/sueros` | `sueros.html` | `stock` or `formulas` (the inherited check; the sidebar's `sueros` flag is mapped to both — G-004) | APP-LIST ×3 (insumos, fórmulas, pedidos) |
| `/balance` | `balance.html` | `balance` | APP-DASHBOARD + reports |
| `/crm` | `crm.html` | `crm` (new flag; inherited had none) | Kanban |
| `/consentimiento` | `consentimiento.html` | `legal` + feature flag | APP-FORM + APP-LIST |
| `/admin/*` | `admin.html` | `admin` | APP-ADMIN, one route per inherited tab (personas, honorarios, plan-de-cuentas, agenda, usuarios, inversiones, config, auditoria, analisis, alertas) |
| `/novedades` | — (new) | `admin` or `legal` `{{CONFIRMAR}}` | APP-LIST + APP-FORM (Markdown editor, cover upload, author with matrícula, publish/unpublish → revalidates `web/`) |
| `/manual` | `manual.html` | any | Static; rewritten to match the rebuilt system |
| `/sign-in` | `login.html` | — | Clerk `<SignIn />` themed; inherited rate limit replaced by Clerk's |

States on every APP-* screen: loading (skeleton rows, stable height) · `EMPTY-STATE.first-run` vs `.no-results` (distinct copy, inherited texts where they exist: "Sin turnos para este día.", "Sin pagos registrados.") · error-recoverable (retry keeps filters) · partial-permission: **hidden**, one policy for the whole app (matches the inherited sidebar behaviour) · stale: last-write-wins except `turnos` and `caja_movimientos`, which re-read before writing.

Real-time replacement: polling every 10 s on `/` (waiting room, balances), `/enfermeria` and `/agenda` day view; refetch on window focus everywhere else.

## 3. Navigation and URL rules

- Public nav: 5 items + persistent CTA; depth ≤ 2; every tier A page in the nav.
- Slugs: Spanish, lowercase, hyphen, accents stripped, no dates, never renamed after launch.
- Trailing slash: **with** slash, 308 the other form, site-wide.
- Query params only for booking state and pagination; canonical points to the clean URL.
- No i18n.

## 4. Component inventory (shared = used on ≥ 3 pages)

Public: `Nav`, `Footer`, `CtaBand`, `Highlight` (the lime highlighter behind a word — the brand's own device), `DripCard`, `ProcessSteps`, `Faq`, `Carousel` (Embla wrapper with real dot state, progress bar, reduced-motion aware), `SplitReveal` (GSAP SplitText once, on load, never on every scroll), `DuotoneImage` (`<picture>` with art-directed crops per breakpoint), `StaticMap`, `BookingWidget` (+ `Calendar`, `SlotGrid`, `PatientForm`, `Summary`), `StatusPanel`.
Internal: `AppShell`, `Sidebar`, `Toast` (same four types as inherited: ok, error, warn, info), `DataTable`, `KpiRow`, `ModalForm`, `PermissionGate`, `PdfButton` (lazy jsPDF), `AuditLog`.

Rule: a block used on ≤ 2 pages stays page-local; extract after the second real use.
