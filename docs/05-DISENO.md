# 05 — DISEÑO

> Visual direction with three signed decisions, tokens with values, typography, motion and performance budgets with numbers, photography treatment, 3D verdict, and the anti-generic vetoes. Source of truth for identity: `brandign-sanalys/…/sanalys - ID - VF.pdf` (Nov 2025). Instagram confirms application; where they disagree the PDF wins.

## 1. Stance — three decisions, signed

1. **Typography is the protagonist.** *(Amended 2026-09-11, D-028, client request: in the Home hero headline the highlighter is back as the manual sets it: "estar bien." bold on the solid box, box colours from the Drip palette. Everywhere else the D-021 amendment below stands.)* *(Amended 2026-09-10, D-021: the highlighter is no longer the headline device. Key words in a headline are set in a **different colour**; the solid marker survives at body and subhead size, where the brand actually uses it — Instagram post 5. At `--step-5` a box behind two words reads as a slab, not a marker: G-041.)* Original wording, kept for the record: **the highlighter is the signature.** Big geometric sans headlines mixing a light and a heavy weight in the same line, with the key words on a solid lime (or verde) rectangle behind them — exactly the *La ciencia de **estar bien.*** device. Every hero, every section title, every CTA band uses it once. Nothing else competes with it.
2. **Three grounds, one accent, colour-blocked sections** — everywhere except the Home hero. *(Amended 2026-09-10, D-021: in the hero the palette **rotates with the Drip**, the way the identity already gives each Drip its own liquid colour and cycles the label grounds by number, PDF p.26–28. Outside the hero this rule stands unchanged.)* Sections alternate full-bleed grounds: verde `#0A3D33`, fluo `#D0FF4E`, blanco. Gris `#9A9B9D` is a fourth ground for labels and cards (as on the Drip labels), never for text. No gradients, no glassmorphism, no five-colour palette.
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
| Display / brand / highlights | **Borna** | regular (400) + bold (700) in the same headline — the pairing the PDF uses (p.12–14); the family has no Light (G-033) | Client's licence (CI-08 — atipo, pay what you want). Until received: Roboto Flex at `wght 400` and `wght 700`, `opsz` 144 — D-016 |
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

## 4. Photography and imagery (rewritten 2026-09-10 after mining the identity folder — `docs/14-MARCA.md`)

- **Amended 2026-09-10 (D-022): the eight Drip bags are our own 3D renders**, generated by `tools/drips/` from `drips.json`, whose label data is read from the identity manual p.28. They replace the AI stills entirely — the two looks cannot share a page. The hero turntable is 36 AVIF frames per Drip; only frame 0 is fetched up front. §7 is not reopened: the WebGL runs offline on the workstation and the site ships images. **Amended again 2026-09-10 (D-023): the hero ships one flat, transparent, front-facing still per Drip — frame 0 — and no turntable.** Every path is built by a single function, `suero(slug, ext)` in `web/src/content/drips.ts`, so the six background-free SVGs replace the renders by editing that one function. The drag-to-spin turntable is parked, not deleted: `tools/drips/` still regenerates the frames.
- **The brand owns its imagery.** The identity folder holds print-resolution renders of the Drip bags (all 8 labels), the reception, the salon, the interior, the lab coats, the gift card and the pattern (`docs/14-MARCA.md` §3). They are the site's images, in this order of preference: brand renders → real photographs when the client sends them (CR-01) → nothing. **Stock is never used**, not even as a placeholder (D-018).
- Hero of `/`: the Drip bags render (`Mockup - Drips 1.jpg`, PDF p.26) — "sueros como insignia" is the brand's own definition of its emblem. Drip pages: the single-bag PSD composites. Space: reception/salon/interior renders, always labelled as renders ("así va a ser el espacio") in the caption or `alt`, never presented as photographs.
- Treatment: the brand's own renders keep their natural colour (they already carry the palette). **Duotone verde/fluo** applies to photographs of people, exactly as the IG runner post — and to the real photos when they arrive, so the swap never breaks the design. One permitted gradient: a fluo-to-transparent overlay rising from the bottom of a photo to carry text (IG post 9). No other gradient anywhere.
- Faces: the lab-coat figures and the "Turnos" image are AI-generated — usable only cropped below the chin, as texture. The two stock images in the IG links (runner, nurse-and-patient) are third-party property and are not used.
- Delivery: `web/public/img/brand/`, art-directed crops per breakpoint (`<picture>` with 3 sources: 3:4 mobile, 4:3 tablet, 21:9 desktop), AVIF + WebP, explicit `width`/`height`, `fetchpriority="high"` on the hero only; `SOURCES.md` beside them naming the source file of each export. Real photos (CR-01) replace files with the same names and crops.
- Icons: the three semantic isotypes of the manual (line = Análisis, drop = Drips, smile = Bienestar) are the site's icon set. No icon library.

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

**Amended 2026-09-11 (D-038) — the Home as it is actually built.** The inventory above was written before the Home was designed. What moves on the Home today: the Drip wheel step with its colour flood (D-025 to D-030, timing corrected in D-037), the entrance choreography (D-027, D-037), the services cards that stack with the scroll and open in place with Flip, with a photo carousel inside (D-034), and the header that takes the colour of the section under it while the grounds alternate blanco / verde (D-035). The budgets and the rules of this section still gate all of it; the bar for every new section is D-038.

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

## 10. Composition rules that are not optional (added 2026-09-10 after the first hero attempt, G-038)

These are constraints, not taste. A page that breaks one is rejected before anyone discusses whether it "looks good".

**Header**
- **Amended 2026-09-10 (D-021), at Mateo's instruction and after the objection was stated twice:** logo left, links **centred**, "Reservar turno" a `--fluo` button at the right, radius `--r-0`. This is the arrangement tell 1 of §11 names; §11 is amended to match. Never a logo centred *above* a centred nav — that stays forbidden.
- Superseded wording: wordmark at the left edge of the content grid, links at the right, CTA at the far right.
- Sticky; after 80 px of scroll it compacts (height 64 → 52 px) with a `--dur-2` transition; the CTA stays visible on mobile as the sticky bottom bar (`CTA-BAND.sticky-mobile`).
- **Amended 2026-09-11 (D-036):** 72 → 64 px, never less than 8 px of air above and below the 3D booking button.
- **Amended 2026-09-11 (D-035):** still solid, but ground, ink, logo, button and the phone menu take the colours of the section under it (`data-tema`), so it reads as transparent; over the hero it keeps the Drip palette and the flood. Home section grounds alternate blanco / verde from section 2 (services blanco).
- Mobile: wordmark left, CTA right, a menu button that opens a full-ground `--verde` panel with the five links at `--step-2`; built with real React state and GSAP, not a checkbox hack.

**Hero (`/`)**
- 12-column named-line grid (`[full-start] [content-start] … [content-end] [full-end]`). Text block spans content columns 1–6 on desktop; the image spans columns 7 → `full-end`, **bleeding to the right and top viewport edges** (it sits under the header), with an `aspect-ratio` reserved so CLS is 0. On mobile the image is a 3:4 crop above the text at full width.
- Headline at `--step-5` (`--step-4` on mobile), two lines maximum, the highlighter on the last two words only. Eyebrow at `--step--1`, uppercase, `letter-spacing 0.14em`, `--fluo`. Body ≤ 140 characters. Primary button "Reservar turno" (same button as the header) + secondary text link "Ver tratamientos" with a 2 px `--fluo` underline.
- No vertical text strips, no decorative bars glued to a viewport edge, no boxed image with margins on all sides, no centred stack.
- The verde ground of the hero is broken by exactly one fluo element besides the highlighter: the button. Everything else is verde, blanco text, and the duotone photo.
- Below the hero the page continues immediately with a `PROOF-STRIP` on `--fluo` ground; the hero is designed as the top of a page, never as an isolated card.

**Hero wheel (decided in WU-04, 2026-09-10, D-023 — replaces the roulette of D-021)**
- The Drip change is an **arc on a wheel**, never a slider, a carousel, a roulette or a fade. Radius 1.6 viewport widths, centre far below the hero, six Drips on the rim 26° apart, one step counter-clockwise per change, **each Drip counter-rotating on its own axis** so it never tilts. Incoming rises from the lower right and settles centred; outgoing crests and falls away left. 1.05 s, `power2.inOut`.
- Only `transform` and `opacity` are written, once per frame, from a single GSAP tween on a proxy value — no React state per frame, no property that triggers layout.
- **Opacity is tied to the column width, not to the angle.** Inside its own column a Drip is at 100 %; it only dims once it has left. On a phone the column is the screen, so nothing visibly fades. On desktop the outgoing passes **behind** the copy — the media column carries `z-0` so its internal ordering cannot beat the copy's `z-10` (G-045).
- Resting state without JavaScript: the transforms are emitted in `vw` from the server, so the active Drip is already centred in the HTML. `prefers-reduced-motion`: no arc, direct change.
- The counter reads `01 / 06`: six Drips, because 07 and 08 exist in no source.
- **No autoplay (D-025).** The hero wheel turns only when the visitor presses an arrow or uses the keyboard. Controls sit under the bag: `‹ 1/6 ›`, thin stroke, no fill, no border. The Drip's name fades in at 45 % of the step so it arrives with its bag.
- **Transition (D-025).** Bags are fixed to the rim and tilt with the wheel — no counter-rotation. 90° per step, counter-clockwise, 1.6 s `power2.inOut` (D-027); in at the bottom right lying down, out at the bottom left lying down.
- **Palette (D-025).** Header and hero take their ground, text, accent and CTA from the label of the Drip in front: verde → verde/blanco/fluo, gris → `#62686E`/blanco/fluo, fluo → fluo/verde/verde. Values and contrast in `docs/10-MEMORY.md` D-025.
- **Palette change (D-026).** A flood: the new label's ground opens as a circle from where the incoming bag enters, over hero and header together, with the wheel's curve and duration. Never a tween of the page's colour variables.
- **Primary button (D-026).** `BotonReserva`: a solid 3D block at radius 0 (face plus a solid edge 4 px behind, no blurred shadow); lifts and rolls its label on hover, sinks on press, follows a fine pointer slightly. It is the only primary button on the site.
- **Links (D-026).** `.link-linea`: underline drawn in from the left, out to the right, 240 ms, fine pointers only, also on keyboard focus.
- **Mobile menu (D-026).** Opens as a circle from the burger, links rise from masks 60 ms apart, burger crosses into an X; closes faster than it opens; scroll locked, focus trapped, Escape closes.
- **Home entrance (D-027).** One 2.9 s choreography on the real elements, no welcome screen: halo, header, eyebrow, headline, the bag entering through the wheel, Drip name, giant name, buttons, arrows. Hidden from the first frame by CSS (`[data-hero] [data-intro]`), never by a head script. Not replayed on client navigation.

**Drip carousel (decided in WU-04, 2026-09-10)**
- Embla, **no autoplay** (§5, WCAG 2.2.2). The position indicator is a **counter plus a hairline progress bar — never a row of dots**: dots read as the default template and stop being legible past five items, and there are eight Drips. The counter shows the Drip's **own number**, not the slide index, so it reads `03 / 08` for *Recuperación Deportiva* wherever the carousel happens to sit. Counter set in `tabular-nums`.
- Progress bar: 1 px, `--fluo` on the section's ground, width driven by `scrollProgress()` written straight to the DOM — never through React state on the `scroll` event, which fires every frame.
- Edge-peek on mobile (slide basis ≈ 92 %) so the next card is visibly there. Dot count, if one is ever added, comes from `scrollSnapList().length`, never `slides.length`.
- Keyboard: arrow keys on the viewport, `role="region"` + `aria-roledescription="carousel"`, a live region announcing the current Drip, `aria-hidden` on slides outside `slidesInView()`.

**Placeholder photography**
- Direction: **clinical, read as texture** — drip chamber, tubing, glass, the light through a line. The identity treats *sueros como insignia*, so the public site's placeholders stay on that object. Calm/natural subjects (hands, foliage, light on wood) are reserved for `/nosotros/`.
- No readable third-party text, brand, barcode or label in frame — **never a bag with a printed label** (the first attempt showed a "simlabsolutions" training bag with "Not for Human or Animal Use" — rejected).
- Duotone verde/fluo applied through a CSS filter or a pre-processed asset; the same treatment on every image on the site.
- Sources and licences in `web/public/img/placeholder/SOURCES.md`.

**The highlighter — scale rule (added 2026-09-10, G-041)**
- The highlighter is a **marker over a word inside a phrase**, which is how the brand uses it (Instagram post 5, *"Una `nueva mirada` sobre la salud"*, at subhead size). It is not a colour field.
- **At `--step-5` a solid fluo box behind two words stops being a marker and becomes a green slab**, and it competes with the button, which §10 says is the only other fluo element in the hero. That is what the first hero shipped and it was rejected on sight.
- The constraint, not the solution: at display sizes the highlighted words must still read as **type on the verde ground with a marker behind them**, not as a fluo rectangle with type knocked out. The box hugs the text; it never grows into a background.
- **How the exact treatment gets decided: `prototype`, not this document.** Candidate axes to diverge on: box that hugs the cap height instead of the line box · underline weight instead of a full box · the highlighter moved down to the support line at `--step-0` where the brand actually uses it, leaving the H1 clean. Mateo picks on the real page. Whatever wins is written back here as the rule.

**Entrance animation — the resting state is always the visible one (added 2026-09-10, G-040)**
- Every entrance animation is a `gsap.from()` whose **resting DOM state is fully visible and readable without JavaScript**. Never a `set()` to a hidden state, never a CSS class that starts at `opacity: 0` or `translate` and waits for a tween to undo it.
- Reason, and it already cost one rejected hero: if the tween is killed, reverted, never registered, or re-created by a re-split, the element stays in the hidden state and ships invisible. `SplitText` with `autoSplit: true` re-splits on font load and on resize, so its tween is re-created at least once on every page load — a `from()` there must be safe to interrupt at any frame.
- **Test that must pass before any headline is HECHO:** load the page with JavaScript disabled and screenshot it. Every word of every headline is readable. If something disappears, the animation owns the resting state and is wrong.
- This rule was written in `Highlight.tsx` and then broken in `SplitReveal.tsx` in the same unit. It lives here now so it is not a comment in one file.

**Fonts and tokens**
- Only `@sanalys/brand`: `@import "@sanalys/brand/tokens.css"` and the self-hosted fonts. Google Fonts CDN, copied tokens and inline logos are forbidden anywhere in `web/`.

**Load motion (from §5, made concrete)**
- t = 0: eyebrow fades in (240 ms). t = 60 ms: headline lines reveal with SplitText, `y: 100% → 0`, 440 ms, stagger 60 ms. t = 420 ms: highlighter wipe left → right, 240 ms, animating the **width of the box** (`background-size`), not `clip-path` — `clip-path` would also clip the text, and the headline lines are still moving at that moment. t = 300 ms: body and buttons `y: 12 → 0`, opacity, 240 ms, stagger 40 ms. t = 0: image `scale 1.04 → 1`, 900 ms, `--ease`. Total under 1 s. Header links stagger in 40 ms apart. `prefers-reduced-motion`: everything visible at t = 0, no transforms.

## 11. The tells — a page fails review if any is present

1. Logo centred **over** a centred nav. *(Amended 2026-09-10, D-021: logo-left / nav-centre / CTA-right is no longer a tell — it is the arrangement §10 now specifies.)*
2. A hero that is a centred stack, or two equal columns with the image boxed by margins.
3. Any typeface other than the brand's (Inter, Geist, Space Grotesk, system-ui as the display face).
4. Slate/zinc/gray neutrals; any gradient; glass blur; a fourth colour.
5. `rounded-2xl` or pill radii on the public site; cards and buttons must use `--r-0`/`--r-1`/`--r-2`.
6. Three equal icon cards; any icon set used decoratively.
7. Fade-up-on-scroll applied to every element; motion that does not appear in §5's inventory; autoplaying carousels without a control.
8. A single `max-w-4xl mx-auto` column with no full-bleed breakout.
9. Text over a photo without the duotone treatment; a photo with readable third-party text.
10. Layout shift on load (CLS > 0); fonts loaded from a CDN.
11. Generic copy that could belong to any clinic ("Cuidamos tu salud"); every headline must use the brand's own vocabulary and the highlighter device once.
12. Anything that looks like a mockup: wireframe placeholders, lorem ipsum, gray boxes, "image here".

## 9. Accessibility tier

`ACC-2` (interactive controls and forms) as the bar, with the `ACC-3` items that are cheap and matter for an older audience: 44×44 targets with 8 px separation, ≥ 16 px body on mobile, visible focus ring in fluo on verde and verde on fluo, no information carried by colour alone (turno states have text), the booking calendar fully keyboard-operable with `aria-selected` and a live region for slot changes, status messages via `role="status"` without focus moves. The `ACC-1` manual pass runs once on the real build before launch and its date is recorded.
