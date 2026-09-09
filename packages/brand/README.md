# @sanalys/brand

The brand package: tokens, fonts and logo assets shared by `web/` and `sistema/`. Values come from `docs/05-DISENO.md` §2 and from the identity PDF (`brandign-sanalys/…/sanalys - ID - VF.pdf`, Nov 2025, canonical — D-IDENT). This package holds **no components**: apps share tokens, not React (`docs/01-ARQUITECTURA.md` §7).

## 1. Contents

| Path | What | Source |
|---|---|---|
| `tokens.css` | Every token as a CSS custom property, the Tailwind `@theme inline` mapping, the `highlight`, `type-display` and `ground-*` utilities, and the inherited `--sys-*` block for the internal system | `docs/05` §2, §8; `sistema-interno/sistema/theme.css` |
| `tailwind.preset.ts` | The same values typed for JavaScript (jsPDF, Chart.js, `themeColor`, e-mail HTML). Not a Tailwind 3 preset: Tailwind 4 is CSS-first, the name is the one declared in `docs/07-REPO.md` | mirrors `tokens.css` |
| `fonts/fonts.css` | `@font-face` for Roboto Flex plus the metric-compatible Arial fallback | `docs/05` §2.2, §6 |
| `fonts/roboto-flex-latin-opsz.woff2` | Roboto Flex variable, latin subset, axes `wght` 100–1000 and `opsz` 8–144, 84 304 bytes | `@fontsource-variable/roboto-flex` 5.3.0 |
| `fonts/OFL.txt` | SIL Open Font License 1.1 for Roboto Flex | same package |
| `assets/isotype-{verde,fluo,blanco}.svg` | The isotype alone (drop + line + smile + ®), viewBox `101.38 × 100` | PDF p.5 |
| `assets/logo-horizontal-{verde,fluo,blanco}.svg` | Isotype + wordmark, viewBox `404.47 × 100` | PDF p.8 |
| `assets/logo-stacked-{verde,fluo,blanco}.svg` | Isotype over wordmark, viewBox `117.78 × 100` | PDF p.11 |
| `assets/favicon.svg` | Isotype in fluo on a verde square, `64 × 64`, radius 0 | PDF p.5 |
| `assets/pattern-tile.svg` | One repeat cell of the isotype pattern, `95.5 × 152`, two staggered rows | PDF p.20 |

Every SVG is traced from the PDF vectors (PyMuPDF `get_drawings`, coordinates normalised to a 100-unit height, rounded to 0.01) — never from the 2 GB `.ai` sources, which stay git-ignored.

## 2. Consume

**CSS (both apps)** — in `src/app/globals.css`, after Tailwind:

```css
@import "tailwindcss";
@import "@sanalys/brand/tokens.css";
```

`tokens.css` imports `fonts/fonts.css` itself. Tailwind then generates `bg-verde`, `text-fluo`, `font-display`, `font-body`, `text-step--1` … `text-step-5`, `rounded-0/1/2`, `shadow-card`, `ease-brand`, plus the utilities `highlight`, `type-display`, `ground-verde`, `ground-fluo`, `ground-blanco`, `ground-gris`. The space scale is deliberately **not** mapped to Tailwind's numeric spacing (it would silently change `p-5`); use `p-(--space-5)` or `var(--space-5)`. Durations: `duration-(--dur-2)`.

**JavaScript** — `import { brand } from "@sanalys/brand/tailwind.preset"`. The package ships TypeScript source, so the consuming app needs `transpilePackages: ["@sanalys/brand"]` in its `next.config.ts` (first consumer: WU-15 PDFs).

**Assets** — import the SVG from `@sanalys/brand/assets/<file>.svg` where the bundler resolves it, or copy the file into the app's `public/` for `<link rel="icon">`, Open Graph images and e-mails. The `favicon.svg` is the source for every icon size; rasterise from it, never redraw.

**Preload** — each app preloads `fonts/roboto-flex-latin-opsz.woff2` from its root layout (WU-05 for `web/`, WU-12 for `sistema/`); the budget is two variable files, latin subset, preloaded (`docs/05` §6).

## 3. How the grounds and the highlighter work

`docs/05` §1: three grounds (verde, fluo, blanco) colour-blocked per section, gris as a fourth for labels and cards, one accent (fluo), and the highlighter as the signature device. `tokens.css` implements that with four inherited variables — `--ground`, `--ink`, `--hl-bg`, `--hl-fg` — that every `ground-*` utility re-sets, so a highlighter is always right for the section it sits in without any per-element classes:

```html
<section class="ground-verde">
  <h1 class="type-display text-step-5">La ciencia de <mark class="highlight">estar bien.</mark></h1>
</section>
```

| Ground | Ink | Highlighter box / text | PDF reference |
|---|---|---|---|
| `ground-verde` | blanco | fluo / verde | p.13 bottom, p.14 bottom |
| `ground-fluo` | verde | verde / fluo | p.13 top, p.14 top |
| `ground-blanco` | verde | fluo / verde | p.12 |
| `ground-gris` | verde (4.4:1 — large text only) | fluo / verde | p.28 labels |

`highlight` sets bold weight, sharp corners (`--r-0`), `box-decoration-break: clone` for wrapped lines, and the box geometry measured on the PDF slogan (p.13): `0.17em` inline padding, `0.14em` above the ascender and `0.11em` below the descender at a 56 px em. `type-display` sets the display face at its regular weight, `opsz` 144, line-height 0.95, letter-spacing −0.02em and cap-height trimming (`text-box`) where the browser supports it. The bold word inside a headline comes from `<strong>` or from `highlight`; the pairing regular + bold is the one the identity uses (Borna Regular + Borna Bold, p.12–14) — D-016.

## 4. Logo

**Files.** Three lockups × three colourways: verde `#0A3D33`, fluo `#D0FF4E`, blanco `#FFFFFF`. The PDF (p.11) also shows negro and gris versions; `docs/05` §3 restricts the web to the three above, so those two are not shipped.

**Which colourway on which ground.**

| Ground | Lockup colour | PDF |
|---|---|---|
| verde | fluo (or blanco) | p.8, p.14 |
| fluo | verde | p.9, p.14 |
| blanco | verde | — (PDF shows negro on white; verde is the web substitute) |
| gris | fluo | p.11 — a logo, never text: fluo on gris is 2.4:1 |

**Geometry (from the extracted vectors).** Units are the SVG viewBox units, height 100.

| Lockup | viewBox | Isotype inside | Gap isotype → wordmark |
|---|---|---|---|
| Isotype | 101.38 × 100 | whole file | — |
| Horizontal | 404.47 × 100 | x 0–101.44, full height | 25.14 = 0.25 × isotype height |
| Stacked | 117.78 × 100 | x 29.96–87.86, y 0–57.11 | 9.42 = 0.165 × isotype height |

The isotype height is measured from the apex of the drop to the bottom edge of the smile; the ® sits inside that box, at the top right.

**Clear space and minimum size (D-015).** The PDF prints no rule: pages 4, 8–11, 13, 14 and 20 were checked at WU-03 and are construction grid, colourways, slogan, lockup and pattern only. The margins the PDF actually uses were measured — ≥ 0.57 × the isotype height around the horizontal lockup (p.11), ≥ 0.4 × around the stacked lockup (p.11), 1.09 × on p.14 — and the rule adopted is stricter than all of them:

- **Clear space:** the isotype height, on all four sides, for every lockup. In the horizontal file that is the file height (100 units); in the stacked file it is 57.11 units.
- **Minimum size on screen:** horizontal lockup 120 px wide (isotype ≈ 30 px), stacked lockup 64 px wide, isotype alone 24 px. The favicon at 16 px is the only exception, and it exists because the ® is allowed to disappear there.
- **Never:** remove or recolour the ®, stretch, rotate, outline, add shadows or gradients, place the lockup on a photograph without the duotone treatment, use negro or gris colourways, or put the isotype closer to the wordmark than the lockup files do. The lockup files are the only source of that relationship — do not rebuild it from the isotype file.

## 5. Pattern

`pattern-tile.svg` is one repeat cell: glyph 52.54 × 51.79 units, horizontal pitch 95.5, row pitch 76, second row offset +52.5 (the PDF stacks four identical copies of each glyph; one is kept). Allowed only as a texture on verde grounds at **≤ 8 % opacity**, never behind text (`docs/05` §3; gift card p.36, IG post p.37).

```css
/* fluo tile, as drawn */
.pattern { background: url("@sanalys/brand/assets/pattern-tile.svg") repeat; background-size: 191px 304px; opacity: 0.08; }
/* any colour: the tile as a mask */
.pattern-mask { mask: url("@sanalys/brand/assets/pattern-tile.svg") repeat; mask-size: 191px 304px; background-color: var(--fluo); opacity: 0.08; }
```

## 6. Fonts

**Roboto Flex** (body, and display until Borna arrives). Self-hosted from `@fontsource-variable/roboto-flex` 5.3.0 (npm, OFL-1.1, checked on the registry on 2026-09-09), file `files/roboto-flex-latin-opsz-normal.woff2`, sha256 `e97ca92cebcf4df3539f6514cd652a84a827939e6d5eaf5edece6d83c8229138`. Latin subset only: Spanish needs nothing outside U+0000–00FF. The `opsz` build carries both `wght` and `opsz`, which is what the display role needs; the smaller `wght`-only build was rejected for that reason.

**Fallback.** `"Roboto Flex Fallback"` is Arial with `size-adjust: 118.14%`, `ascent-override: 78.53%`, `descent-override: 20.67%`, `line-gap-override: 0%`, computed with fontTools from the two font files (xAvgCharWidth ratio and hhea metrics: Roboto Flex 2048 upm, ascent 1900, descent 500, xAvgCharWidth 1068; Arial 2048 upm, xAvgCharWidth 904). It exists so the swap moves nothing (CLS 0, `docs/05` §6).

**Borna** (display — "usada en marca y highlights", PDF p.18). Designed by **atipo** (atipofoundry.com), sold as *pay what you want* for the complete family; the weights that exist are Regular, Medium, SemiBold and Bold, with italics — **there is no Light**. The identity folder contains the four desktop OTFs (`Borna-Regular/Medium/SemiBold/Bold.otf`, © 2023 atipo); they are desktop files and are **not shipped** until the web licence is received (CI-08). When it arrives: put the web files in `fonts/`, add their `@font-face` to `fonts/fonts.css` as `"Borna"` at weights 400 and 700, point `--font-display` at `"Borna", "Roboto Flex Variable", …`, and close D-016.

## 7. Facts read from the identity PDF

Colour, p.16 (the OKLCH values in `tokens.css` were recomputed from these hex values and match `docs/05` §2.1 exactly):

| Name | PANTONE | RGB | CMYK | HEX |
|---|---|---|---|---|
| Verde | 560 C | 10 61 51 | 90 45 70 60 | `#0A3D33` |
| Fluo | 374 C | 208 255 78 | 27 0 86 0 | `#D0FF4E` |
| Negro | Black C | 0 0 0 | 0 0 0 100 | `#000000` |
| Gris | Cool Gray 7 C | 154 155 157 | 20 14 12 40 | `#9A9B9D` |
| Blanco | — | 255 255 255 | — | `#FFFFFF` |

Contrast, recomputed on 2026-09-09: fluo/verde 10.5 · blanco/verde 12.2 · negro/fluo 18.1 · verde/blanco 12.2 · gris/verde 4.4 · gris/blanco 2.8 · fluo/gris 2.4 · fluo/verde-deep 14.8.

Typography, p.18: Borna "usada en marca y highlights"; Roboto Flex "usada en cuerpo de texto". Slogan, p.12–14: *La ciencia de* in Regular, **estar bien.** in Bold inside the box; one-line and two-line settings, on fluo and on verde.

Drip label, p.28 (the composition the public Drip cards reuse, `docs/05` §1.3): isotype top-left · "Drip # NN" rotated 90° top-right · a rule · the name in two lines, Bold · one-liner in Roboto Flex · a "PACIENTE" band with a handwritten name (set in Rock Salt on the mockup) · footer with the wordmark and the mini slogan. Grounds cycle by Drip number: 01 verde · 02 gris · 03 fluo · 04 verde · 05 gris · 06 fluo · 07 verde · 08 gris; the name is fluo on verde and on gris, verde on fluo.

Page map: 1 cover · 2–3 concept · 4 construction grid · 5–7 isotype · 8–11 lockups and colourways · 12–14 slogan · 15–18 colour and type · 19–20 pattern · 21–39 applications (interiors, coats, drips, labels, cards, prescriptions, gift card, Instagram) · 40 close.

## 8. What is not here

Addresses, phones, matrículas and every client-owned fact stay `{{CONFIRMAR}}` in `docs/00-BRIEF.md` §8; the PDF prints two different phone numbers and two different matrículas (G-016, G-017) and this package repeats none of them. Photos and their duotone treatment belong to `web/public/img/placeholder/` (WU-04, D-008).
