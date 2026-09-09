# 05 — DISEÑO

> Visual direction with three signed decisions, tokens with values, typography, motion and performance budgets with numbers, photography treatment, 3D verdict, and the anti-generic vetoes. Source of truth for identity: `brandign-sanalys/…/sanalys - ID - VF.pdf` (Nov 2025). Instagram confirms application; where they disagree the PDF wins.

## 1. Stance — three decisions, signed

1. **Typography is the protagonist; the highlighter is the signature.** Big geometric sans headlines mixing a light and a heavy weight in the same line, with the key words on a solid lime (or verde) rectangle behind them — exactly the *La ciencia de **estar bien.*** device. Every hero, every section title, every CTA band uses it once. Nothing else competes with it.
2. **Three grounds, one accent, colour-blocked sections.** Sections alternate full-bleed grounds: verde `#0A3D33`, fluo `#D0FF4E`, blanco. Gris `#9A9B9D` is a fourth ground for labels and cards (as on the Drip labels), never for text. No gradients, no glassmorphism, no five-colour palette.
3. **Editorial asymmetry, not template symmetry.** Off-centre heroes on a named-line grid, one full-bleed breakout per page, Drip cards that reuse the PDF's label composition (isotipo top-left, number top-right, name in two lines, one-liner, band). The Drip label *is* the card.

What this rejects (from the workspace veto list): Inter/Geist, slate neutrals, `rounded-2xl` everywhere, the centred gradient hero with two buttons, the equal 3-column icon grid, `whileInView` fade-up on everything, the logo-left/nav-centre/CTA-right header, `max-w-4xl mx-auto` single column.

## 2. Tokens (`packages/brand/tokens.css`)

### 2.1 Colour (OKLCH, computed from the PDF hex values)

| Token | Value | Hex | Use |
|---|---|---|---|
| `--verde` | `oklch(0.325 0.055 176)` | `#0A3D33` | primary ground; text on fluo and blanco |
| `--verde-deep` | `oklch(0.218 0.032 177)` | `#071F1A` | internal system page ground (inherited `theme.css`) |
| `--fluo` | `oklch(0.936 0.202 123)` | `#D0FF4E` | the only accent: highlighter, CTA ground, focus ring, active states |
| `--negro` | `oklch(0 0 0)` | `#000000` | text on fluo and blanco when verde is too soft (body on fluo) |
| `--gris` | `oklch(0.689 0.003 265)` | `#9A9B9D` | secondary ground, dividers. **Not for text** (2.8:1 on white) |
| `--blanco` | `oklch(1 0 90)` | `#FFFFFF` | third ground |
| `--verde-ink-soft` | `oklch(0.325 0.055 176 / 0.72)` | — | secondary text on light grounds |
| `--fluo-soft` | `oklch(0.936 0.202 123 / 0.12)` | — | hover wash on verde (inherited `--fluo-dim`) |

Contrast (verified): fluo on verde 10.5:1 · blanco on verde 12.2:1 · negro on fluo 18.1:1 · verde on blanco 12.2:1 · gris on verde 4.4:1 (large text only) · gris on blanco 2.8:1 (decorative only).

Neutrals carry a deliberate temperature: no pure grays except the brand gris; tints are verde at low alpha.

### 2.2 Typography

| Role | Face | Weights | Source |
|---|---|---|---|
| Display / brand / highlights | **Borna** | light (300) + bold (700) in the same headline | Client's licence (CI-08). Fallback until received: Roboto Flex at `wght 300` and `wght 800`, `opsz` max — written as a `D-NNN` if it ships |
| Body / UI | **Roboto Flex** (variable) | 400, 500, 600 | Self-hosted via Fontsource; `font-display: swap` with size-adjusted fallback (`Arial`) to hold CLS at 0 |
| Numbers (money, times) | Roboto Flex `font-variant-numeric: tabular-nums` | — | Right-aligned in tables |

Scale (fluid, Utopia-style, mobile 375 → desktop 1440):
`--step--1: clamp(0.83rem, …, 0.9rem)` · `--step-0: clamp(1rem, …, 1.125rem)` · `--step-1: clamp(1.25rem, …, 1.5rem)` · `--step-2: clamp(1.56rem, …, 2.1rem)` · `--step-3: clamp(1.95rem, …, 2.95rem)` · `--step-4: clamp(2.44rem, …, 4.1rem)` · `--step-5: clamp(3.05rem, …, 5.8rem)`. Headlines at `line-height: 0.95`, letter-spacing `-0.02em`; body `1.5`; measure 55–70 characters. Cap-height trimming on headlines.

### 2.3 Space, radius, shadow, motion durations

- Space scale: `--space-1: 0.25rem` … `--space-9: 8rem`, fluid pairs for section padding (`clamp(3rem, 8vw, 8rem)`).
- Radius scale: `--r-0: 0` (highlighter rectangles, Drip labels, CTA band — **sharp is the brand**), `--r-1: 4px` (inputs, small chips), `--r-2: 12px` (cards on the public site). The internal system keeps the inherited `20px` cards and `12px` icons because its look is respected as-is.
- Shadow: one only, `0 16px 40px oklch(0 0 0 / 0.25)`, used on hover of interactive cards (inherited from the dashboard).
- Durations: `--dur-1: 140ms` (state changes), `--dur-2: 240ms` (hover, reveals), `--dur-3: 440ms` (page-level reveals). Easing `cubic-bezier(.16,1,.3,1)` (inherited).

## 3. Logo

- Isotype (drop + line + smile) always with `®`. Never without it, never recoloured outside verde / fluo / blanco.
- Three lockups from the PDF: horizontal (isotype + wordmark), stacked, isotype alone (favicon, app icon, Drip labels).
- Minimum clear space and minimum size (checked at WU-03, 2026-09-09): **the PDF prints no rule** — pages 4, 8–11, 13, 14 and 20 are construction grid, colourways, slogan, lockup and pattern only. The margins it actually uses were measured on the vectors (≥ 0.57 × the isotype height around the horizontal lockup on p.11, ≥ 0.4 × around the stacked lockup, 1.09 × on p.14) and the rule adopted is stricter than all of them (D-015): **clear space = the isotype height on all four sides** (apex of the drop to the bottom of the smile; 100 units in the horizontal file, 57.11 in the stacked file); **minimum size on screen** horizontal lockup 120 px wide, stacked 64 px, isotype alone 24 px, favicon 16 px as the only exception. The isotype→wordmark gap is fixed by the lockup files (0.25 × isotype height horizontal, 0.165 × stacked) and is never rebuilt from the isotype file.
- Files: `packages/brand/assets/` — `isotype-*`, `logo-horizontal-*`, `logo-stacked-*` in the three colourways, `favicon.svg`, `pattern-tile.svg`; geometry and colourway-per-ground table in `packages/brand/README.md` §4.
- The pattern (tiled isotypes) is allowed as a texture on verde grounds at ≤ 8 % opacity (gift card and IG post reference), never behind text. One repeat cell is `assets/pattern-tile.svg` (glyph 52.54 × 51.79, pitch 95.5 × 76, second row offset +52.5, from p.20).

## 4. Photography

- Direction: **duotone** verde/fluo on every photograph, as the IG post templates in the PDF (p.37–39). It unifies placeholder and real photos so swapping files never breaks the design; it also tolerates uneven photo quality.
- Placeholders: hard-coded files in `web/public/img/placeholder/`, art-directed crops per breakpoint (`<picture>` with 3 sources: 3:4 mobile, 4:3 tablet, 21:9 desktop), AVIF + WebP, explicit `width`/`height`, `fetchpriority="high"` on the hero only.
- Real photos (CR-01) replace files with the same names and crops. **Stock never ships to production without the client's written acceptance**; Nosotros never launches on placeholders (D-008).
- The PDF's interior renders (reception, salon) may be used **only** labelled as "así va a ser el espacio" — never presented as photographs of the clinic.

## 5. Motion — inventory and budget

Motion is measured, not counted. Three numbers gate it:

| Budget | Value | Where measured |
|---|---|---|
| INP | ≤ 200 ms at p75 | Speed Insights, field |
| Scroll handler cost | < 4 ms per frame | DevTools performance, lab |
| Autonomous motion | anything that starts alone and lasts > 5 s, or auto-updates, needs a pause control — or does not start alone | design review |

Inventory of what moves (public site):

| Element | How | Autonomous? | Reduced motion |
|---|---|---|---|
| Hero headline | SplitText reveal once on load, 440 ms, lines only | no | instant |
| Highlighter rectangles | `clip-path` wipe from left, 240 ms, on entering viewport, once | no | visible immediately |
| Drip cards carousel (mobile) | Embla, drag/swipe, dots with real state, **no autoplay** | no (by design — avoids the WCAG 2.2.2 control) | same |
| Process steps | Number counts and line draws with ScrollTrigger scrub, transform/opacity only | no | static |
| Section grounds | Colour blocks are static; no colour-scrub | — | — |
| Booking widget | Step transitions 240 ms translate/opacity; slot grid skeleton; confirmation `STATUS-PANEL` entrance 440 ms with a lime highlighter wipe | no | instant |
| Lenis smooth scroll | on, lerp 0.1 | — | off |
| Page transitions | View Transitions API for the Drip card → Drip page morph, 240 ms | no | none |
| Video | **None in v1**: no footage exists. If the client supplies one later: muted, `playsinline`, poster, `preload="metadata"`, `aspect-ratio` reserved, codecs decision is an open gap (OQ-05) | would be | poster only |

Rules: transform and opacity only on scroll; anything that triggers layout in a scroll handler is a defect; no motion on the internal system beyond the inherited hover and toast transitions (`A5`: quiet by default); `prefers-reduced-motion` respected everywhere with the same information visible.

## 6. Performance budget

| Metric | Public (`web/`) | Internal (`sistema/`) |
|---|---|---|
| CLS | ≤ 0.1 p75 — **BLOCK** | ≤ 0.1 — **BLOCK** |
| LCP | ≤ 2.5 s p75 — WARN (blocks the design if the lab proxy on throttled 4G exceeds 2.5 s) | ≤ 2.5 s — **BLOCK** |
| INP | ≤ 200 ms p75 — WARN | ≤ 200 ms — **BLOCK** |
| JS per route (compressed) | ≤ 180 KB on `/` and `/turnos/`; GSAP plugins loaded per route | ≤ 250 KB per screen; jsPDF/Chart.js lazy |
| Fonts | 2 variable files, subset latin, preloaded | same |
| Third-party scripts | Analytics + Speed Insights, deferred; nothing else | Sentry only |

Until the site is live, these are targets you can fail, not measurements you can pass — say so in every review.

## 7. 3D — verdict

**No 3D in v1.** Nothing in the identity is three-dimensional; the brand's strength is flat type, colour and the highlighter. A 3D element would cost texture memory and DPR on the phones this audience uses, for no message the flat system does not already carry. Reopen only if the design step (unit 4) proposes one specific element (e.g. a drip bag as a single low-poly scene on the Tratamientos hero), it passes the mobile budget with DPR capped at 1.5, and it degrades to a static image. Then `three` + R3F enter as a `D-NNN`.

## 8. Internal system look — respected

The rebuilt system keeps the inherited theme: ground `--verde-deep`, cards `rgba(255,255,255,.03)` with `1px` borders at `.06` alpha, `20px` radius, fluo accents, Roboto Flex, 72 px sidebar, the same icons, the same toast (bottom-right, 3 s, four types), the same badge colours per turno state. Only the CSS delivery changes (compiled Tailwind instead of the Play CDN). Any visual change to the system is a scope change, not a refactor.

## 9. Accessibility tier

`ACC-2` (interactive controls and forms) as the bar, with the `ACC-3` items that are cheap and matter for an older audience: 44×44 targets with 8 px separation, ≥ 16 px body on mobile, visible focus ring in fluo on verde and verde on fluo, no information carried by colour alone (turno states have text), the booking calendar fully keyboard-operable with `aria-selected` and a live region for slot changes, status messages via `role="status"` without focus moves. The `ACC-1` manual pass runs once on the real build before launch and its date is recorded.
