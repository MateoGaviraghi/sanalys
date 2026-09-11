# 14 — MARCA · the identity folder, mined

> Everything usable in `brandign-sanalys/sanalys sin comprimir/` (2 GB, git-ignored, never edited, never renamed), file by file and page by page: what each thing is, what was extracted from it, where it goes in the build, and what must never be used. Read before any UI unit. The identity PDF is canonical; when Instagram or the inherited code disagree with it, the PDF wins.

## 1. What is in the folder

| Path (inside `sanalys sin comprimir/`) | What it is | Use |
|---|---|---|
| `sanalys - ID - VF.pdf` (40 pp, 31 MB, Nov 2025) | **The brand manual.** Concept, sign construction, logo system, slogan, colour, type, pattern, applications, business cards, prescriptions, gift card, Instagram templates | Canonical source. Page map in §2 |
| `sanalys - ID - VF.ai` (387 MB) + `ID/…/sanalys - ID - VF.ai` (same) | Illustrator master of the manual | Vector source of every logo, label and pattern. The SVGs in `packages/brand/assets/` were traced from the PDF (WU-03); if a vector ever looks off, this is the file to re-export from |
| `ID/sanalys - ID - VF_Carpeta/Links/` | Linked images of the manual: `sanalys - IG - Drip 2.psd`, `sanalys - IG - Turnos.jpg` | See §3 |
| `IG/sanalys - IG.pdf` (9 pp) + `IG/sanalys - IG.ai` | The Instagram post set, same content as PDF pp. 37–39 | Copy bank §4; composition rules §5 |
| `IG/sanalys - IG_Carpeta/Fonts/` | **Borna-Regular / Medium / SemiBold / Bold `.otf`** + **Roboto Flex variable `.ttf`** | Desktop files. Borna needs the web licence (CI-08); Roboto Flex is OFL and already self-hosted via Fontsource |
| `IG/sanalys - IG_Carpeta/Links/` | `Drip 1.psd`, `Drip 2.psd` (3064 × 3580, the two Drip-bag label compositions), `Drips.jpg`, `Juventud.jpg`, `Runner.psd`, `Salón.jpg`, `Turnos.jpg` | §3: two are usable brand renders, two are third-party stock — **not used** |
| `Links-20251120T163502Z-1-001/Links/` | **The high-resolution mockups behind the manual**: `Ambiente.png` (22 MB interior), `Mockup - Recepción.jpg`, `Mockup - Salón.jpg`, `Mockup - Bata V1/V2.jpg`, `Mockup - Drips 1/2.jpg`, `Mockup - Comprimidos.jpg`, `Mockup - Gift card.jpg`, `Mockup - Recetas.jpg`, `Mockup - Tarjeta personal 1/2.jpg`, plus the IG links above | **The brand-owned image library.** §3 |
| `IG-20251120T163109Z-1-001/`, `IG-20251128T093748Z-1-001/`, `sanalys - IG_Carpeta-…/`, the four `.zip` | The same IG folder three times plus its zips (~1.5 GB of duplicates) | Nothing new. Leave them; do not delete (source material) |

Also embedded in the manual PDF at print resolution and extractable with `pypdf` (`page.images`): p.17 interior 3995 × 2904 · p.22 reception 5824 × 3264 · p.23 salon 7424 × 4000 · p.24–25 lab coats 6014 × 4000 · **p.26–27 Drips 7106 × 4000** · p.29 pills 7328 × 4500 · p.31/33 cards 5500 × 3000 · p.34 prescriptions 3840 × 2160 · p.36 gift card 4500 × 3200 · p.37–39 IG composites.

## 2. The manual, page by page — the rule each page gives

| Pages | Content | Rule taken into this project |
|---|---|---|
| 2 | **Concepto + Keywords**: "identidad visual que refleje la naturaleza de este emprendimiento medicinal no convencional… alejarse de la fría y clásica imagen del mundo medicinal para comunicar la energía positiva de este nuevo espacio… SANO + ANÁLISIS, integración entre salud natural y medicina avanzada basada en evidencia científica." Keywords: **Ciencia · Bienestar · Calidez · Calma · Sano** | Tone of every headline and every micro-copy. Not cold-clinical, not pastel-holistic |
| 3 | **Sign construction**: Sano + Análisis; the scan bracket = "escaneo del paciente / tratamiento a medida"; the drop = "Drips, sueros como insignia"; the smile = "Calma / Bienestar"; "análisis de sangre / orina → resultado del tratamiento" | The three parts of the isotype are the three concepts of the journey: **análisis → drip → bienestar**. Use them as the site's own iconography (§6) instead of any icon set |
| 4 | Isotype on construction grid | Geometry already in `packages/brand/assets/` |
| 5–6 | ISO on fluo and on verde, with `®` | Colourways |
| 7 | **ISO with one element in fluo: line = Análisis, drop = Drips, smile = Bienestar** | Three semantic variants of the isotype — the only "icons" the site needs (§6) |
| 8–10 | Wordmark lockups: horizontal on verde / on fluo; stacked on verde and fluo | Lockups in the brand package |
| 11 | Mono colourways: black on white, fluo on gris, white on black, gris on white, plus stacked variants | Allowed monochrome uses (footer on black, print) |
| 12–14 | **Slogan**: "La ciencia de **estar bien.**" — "Apelamos a un juego de palabras: en los complejos tiempos que corren, estar bien es una ciencia y sanalys es ciencia que ayuda a lograr ese bienestar." Two-line and one-line versions on fluo and verde; lockup with the logo | The highlighter device; two-line form for narrow widths |
| 16–17 | **Colour**: Verde Pantone 560 C `#0A3D33` · Fluo 374 C `#D0FF4E` · Negro · Gris Cool Gray 7 C `#9A9B9D` · Blanco. "Colores de impacto, de look moderno, dejando la calma de los tonos pasteles para el diseño de los ambientes… combinan con ambientes naturales y cálidos: plantas, madera, paredes blancas, vidrio, luces cálidas" | Tokens (`docs/05` §2). Warm interiors are the *photographic* counterpart of the cold-impact palette |
| 18 | **Type**: Borna "usada en marca y highlights"; Roboto Flex "usada en cuerpo de texto" | `docs/05` §2.2 |
| 20 | **Pattern**: tiled isotypes on verde / fluo / gris, strong rows above, faint rows below | Texture at ≤ 8 % opacity; the fade from strong to faint rows is part of the pattern's own language |
| 22–23 | Reception and salon renders (wood, plants, glass, fluo light strip on the ceiling, the isotype on the wall) | Brand-owned imagery; labelled as renders when shown |
| 24–25 | Lab coat in white and in gris, with isotype and wordmark | Brand-owned; the model is AI-generated — usable only cropped so no face shows |
| 26–28 | **The 8 Drips** as bag labels and as a label grid: 01 Detox Vital · 02 Escudo Antioxidante · 03 Recuperación Deportiva · 04 Impulso Celular · 05 Equilibrio Mental · 06 Anti-Estrés Plus · 07 Renovación Celular · 08 Juventud Activa, each with its one-liner and a coloured liquid (yellow, lilac, aqua, coral, green, green, …) | **Hero imagery and the Drip card.** The label composition is the card (`docs/05` §1.3) |
| 29 | Pills box "Juventud Activa" | Brand-owned; a future product line — not on the site now |
| 30–33 | Business cards: Guillermina María Ringa (Médica especialista clínica y oncología, MP 7455 R.E. 01216030, Postgrado en Dermatología Estética, Diplomatura en terapias endovenosas, Magister en Medicina Orthomolecular, +54 9 3425 21-8327) and Constanza Chavarini (Médica especialista clínica, same MP number printed, same titles, +54 9 3404 52-8533); `@sanalys.sf`, `sanalys.com.ar` | Team content for Nosotros — **every credential `{{CONFIRMAR}}`** (the same MP on both cards is a template error, G-017) |
| 34–35 | Prescription pads: "Dra. Guillermina Ringa · MÉDICA ONCÓLOGA · MAT 2982", **Avellaneda 3365, Santa Fe, Argentina · +54 9 342 445-2643 · sanalys.sf@gmail.com**, and a lab checklist (hemograma con plaquetas, glucemia, urea, creatinina, hepatograma, ionograma, magnesio, calcio, albúmina, colesterol total/HDL/LDL/TAG, hCG, glucosa 6-fosfato deshidrogenasa, PCR us, homocisteína, somatomedina C, estrés oxidativo, ferritina, insulina basal, relación TGL/HDL, HbA1C, cortisol matutino, vitamina D, B12, B6) | The most recent NAP in the folder (matches the IG "Turnos" post) — still CI-09. The checklist is what "Paso 01 · El escaneo inicial" contains: content for the journey, `{{CONFIRMAR}}` with the doctor |
| 36 | Gift card (gris sleeve, fluo pattern inside, verde card "Gift Card · Vale por · De parte de") | The inherited system already has a `gift_card` WhatsApp template; a Gift Card block is a legitimate future feature (OQ-12) |
| 37–39 | **Instagram set** (9 posts): "Hola bienestar!" · "Ciencia + Bienestar" over the salon · "Una **nueva mirada** sobre la salud: más humana, preventiva y consciente." · Drips grid · Detox Vital 01 · Escudo Antioxidante 02 · Recuperación Deportiva 03 (runner, fluo duotone) · Juventud Activa 08 (nurse and patient) · **Turnos · WhatsApp 342 445-2643** over the lab coat with a fluo gradient | Copy bank §4 and composition rules §5 |

## 3. The image library — what to export, where, for what

Brand-owned renders replace stock placeholders **entirely**. Nothing on the site needs a stock photo. Export at the first UI unit (WU-04) from the sources named here, into `web/public/img/brand/` (AVIF + WebP, art-directed crops, explicit dimensions), with `web/public/img/brand/SOURCES.md` listing source path → output → crop.

| # | Source (highest resolution available) | Output | Where it is used | Notes |
|---|---|---|---|---|
| 1 | `Links/sanalays - Mockup - Drips 1.jpg` (= PDF p.26, 7106 × 4000: Detox Vital, Escudo Antioxidante, Recuperación Deportiva bags) | `hero-drips.{avif,webp}` ×3 crops | **Home hero** (`docs/05` §10) | The brand's emblem, "sueros como insignia". Crop 21:9 desktop on the three bags; 3:4 mobile on one bag. Duotone optional — these already carry the palette |
| 2 | `Links/sanalays - Mockup - Drips 2.jpg` (= p.27: Impulso Celular, Equilibrio Mental, Anti-Estrés Plus) | `hero-drips-b.*` | Tratamientos hero, alternate | |
| 3 | `IG/…/Links/sanalys - IG - Drip 1.psd`, `Drip 2.psd` (3064 × 3580, single bag on fluo / on gris) | `drip-01.*`, `drip-02.*` | Drip detail pages hero | Composite readable with PIL; export the flattened image |
| 4 | `IG/…/Links/sanalys - IG - Drips.jpg` (bag grid, 3553 × 2000) | `drips-grid.*` | Tratamientos index, `PROOF-STRIP` background, Novedades empty state | |
| 5 | `Links/Ambiente.png` (22 MB) / PDF p.17 | `interior.*` | Home §07 "cómo nace Sanalys", Contacto | **Label "render del espacio"** in the caption or `alt` (D-008) |
| 6 | `Links/sanalys - Mockup - Recepción.jpg` (= p.22) | `recepcion.*` | Contacto, Nosotros (the space) | Same label |
| 7 | `Links/sanalys - Mockup - Salón.jpg` (= p.23) | `salon.*` | Tratamientos (the chairs), Turnos confirmation page | Same label |
| 8 | `Links/sanalays - Mockup - Bata - V1.jpg`, `V2.jpg` (= p.24–25) | `bata-blanca.*`, `bata-gris.*` | Nosotros background, team section texture | **Crop below the chin** — the figure is AI-generated; never show the face |
| 9 | `Links/sanalays - Mockup - Gift card.jpg` (= p.36) | `gift-card.*` | Only if OQ-12 (gift card feature) is approved | |
| 10 | PDF p.20 pattern (vector in `packages/brand/assets/pattern-tile.svg`) | — | Section textures | Already in the brand package |
| 11 | `Links/sanalays - Mockup - Comprimidos.jpg` (= p.29) | — | **Not on the site** (product not sold yet) | Keep for later |

**Never used on the site:** `sanalys - IG - Juventud.jpg` (stock: nurse and patient) and `sanalys - IG - Runner.psd` (stock runner) — third-party stock in the IG templates, not the client's property; `sanalys - IG - Turnos.jpg` and the lab-coat faces (AI-generated people presented as staff would be a lie in Nosotros — cropped, faceless use only as texture); the business cards and prescriptions as images (they print personal phone numbers and a wrong MP).

## 4. Copy bank — the brand's own words (verbatim, Spanish)

Use these before writing anything new; every headline on the site should be traceable to this list or to the client.

- Slogan: **La ciencia de estar bien.** (highlight "estar bien.")
- Keywords: Ciencia · Bienestar · Calidez · Calma · Sano
- Positioning sentences: "integración entre salud natural y medicina avanzada basada en evidencia científica" · "medicina integral, preventiva y personalizada" (Instagram bio) · "Una **nueva mirada** sobre la salud: más humana, preventiva y consciente." · "Ciencia + Bienestar" · "Hola bienestar!" · "protocolos diseñados para que tu cuerpo reciba nutrientes y antioxidantes directamente a la célula" (Instagram) · "no hay protocolos genéricos, hay personas únicas" (Instagram, Paso 01)
- Sign meanings (for the journey and the icons): "Escaneo del paciente · Tratamiento a medida" · "Drips · Sueros como insignia" · "Análisis de sangre / orina · Resultado del tratamiento" · "Calma / Bienestar"
- The 8 Drips, name + one-liner: 01 Detox Vital — Limpieza profunda y depuración · 02 Escudo Antioxidante — Protección celular e inmunidad · 03 Recuperación Deportiva — Energía y regeneración muscular · 04 Impulso Celular — Vitalidad y metabolismo · 05 Equilibrio Mental — Regulación del ánimo y descanso · 06 Anti-Estrés Plus — Relajación y alivio del dolor · 07 Renovación Celular — Regeneración y frescura · 08 Juventud Activa — Limpieza profunda y depuración (sic: same one-liner as 01 in the PDF — `{{CONFIRMAR}}` with the client)
- Drip descriptions already written: **Detox Vital** — "Diseñado para favorecer la eliminación de metales pesados y toxinas, mejorar la sensación de bienestar y promover la desintoxicación celular. Ideal para quienes buscan un 'reset' profundo." · **Escudo Antioxidante** — "Combate el cansancio y aumenta los niveles de energía. Ayuda a reparar las células dañadas y a retrasar el proceso de envejecimiento celular, mejorando la vitalidad general del organismo." (Medical claims: they ship only with the doctor's sign-off, CI-13 / RF-14)
- Booking language the brand already uses: "Turnos" + WhatsApp number (post 9). The site's CTA stays "Reservar turno".
- Label micro-copy: "PACIENTE", "Drip #", "Gift Card · Vale por · De parte de", "Rp./"

## 5. Composition language observed in the applications (rules for the web)

1. **Vertical wordmark on the left edge**, rotated 90°, reading bottom-to-top, as a page or section signature (posts 1, 3, 7, 8, 9). Use it once per page, on a full-bleed section — not on the header.
2. **"Drip # 03"**: the number large, top-right, with a thin rule underneath; the eyebrow "La ciencia de estar bien." top-centre. This is where the carousel counter "03 / 08" comes from.
3. **Headlines in two lines, mixed weight, the highlighter on the key words**; on photo grounds the highlighter is verde on fluo text (post 3: "**nueva mirada**").
4. **Grounds rotate**: verde → fluo → gris → blanco across consecutive pieces; on the web, across consecutive sections.
5. **Photo treatment**: fluo/verde duotone on people (runner), natural colour on the brand's own renders (drips, interior), and **one permitted gradient**: a fluo-to-transparent overlay rising from the bottom of a photo to carry text (post 9). No other gradients anywhere.
6. **The label as the card**: isotype top-left, "Drip #" top-right, rule, name in two lines, one-liner, band with the name of the patient (on the web: the CTA), wordmark + slogan at the foot, on verde / gris / fluo grounds alternating.
7. **Pattern fade**: strong rows above, faint rows below — a texture that already contains its own vertical rhythm.

## 6. Icons — the brand already has them

No icon library. The three semantic isotypes of p.7 (line lit = **Análisis**, drop lit = **Drips**, smile lit = **Bienestar**) are the icons for the three steps of the journey, the three columns of any "how it works" block, and the three states of a booking (elegís → reservás → estás bien). Anything else that needs an icon uses typography or a numbered label.

## 7. Fonts

Borna Regular/Medium/SemiBold/Bold desktop OTFs are in the folder; **not a web licence** — buying the Web · Complete licence is CI-08 (guide sent to the client 2026-09-10). Roboto Flex is already self-hosted. The system mockups in the manual set Borna Regular + Bold in the same line (D-016).

## 8. Facts this folder settles, and facts it does not

Settled: palette, type pairing, the 8 Drips and their one-liners, the slogan device, the logo system with three semantic variants, the pattern, the existence of brand-owned high-resolution renders for every surface of the site, the tone.
Not settled (still `{{CONFIRMAR}}`): matrículas (the manual contradicts itself), address and phones (the prescriptions say Avellaneda 3365 / 342 445-2643 — most recent, still to confirm), the journey steps beyond "Paso 01", the longer Drip texts for Drips 03–08, the medical claims' sign-off.

## 9. Client positioning — the founders' own words (received 2026-09-11)

Sent by Mateo in chat on 2026-09-11: a positioning brief plus three founder visions (the three founders, kept whole in the client's document; where they agree is the core of the story). This section is the **source** for any value-proposition, "quiénes somos" or differentiator copy on the site. Quote or tighten it; do not invent beyond it.

**Voice** (the client's own rule):

| Hablamos así | No hablamos así |
|---|---|
| Directa · Cálida · Precisa · Basada en evidencia · Preventiva · No clínica | ~~Clínica médica~~ · ~~Genérica~~ · ~~Alarmista~~ · ~~Reactiva~~ |

"Ciencia con humanidad. Directa, sin condescendencia, sin jerga clínica innecesaria. Le habla a alguien inteligente que quiere respuestas precisas."

**Quiénes somos** — "No esperamos que algo falle para intervenir." A medical space specialised in orthomolecular medicine, IV therapy (sueroterapia) and PRP, working on the body's biochemical bases to prevent, optimise and recover "antes de que algo falle". "No es medicina convencional. Es la ciencia como herramienta de bienestar cotidiano, no de emergencia."

**Qué resuelve** — "La brecha entre no estar enfermo y sentirse verdaderamente bien." Persistent tiredness, low energy, stress, poor sleep, falling performance: real symptoms that conventional medicine does not address because the tests "dan bien". Sanalys works exactly there.

**Público** — active adults, healthy or with conditions, who take an active role in their health and do not wait to be ill. They value precision, personalisation and concrete results. Profile: urban, willing to invest in their body, evidence-oriented.

**Servicios** — full medical evaluation (interview, physical exam, biomarkers, targeted studies); individual protocols (oral supplementation + IV therapy); PRP, platelet-rich plasma, facial, body and hair; habit and lifestyle follow-up oriented to longevity and performance. Also mentioned by one founder: mesotherapy, medical peels. "Los sueros y las salas de aplicación son lo distintivo de Sanalys."

**Diferenciales** (three, as the client numbers them):

| | |
|---|---|
| 01 · Espacio | Massage chairs, laptop-friendly. "El paciente no soporta la espera — la disfruta." |
| 02 · Filosofía | Preventive and optimising medicine, not reactive. "Actuamos antes de la enfermedad." |
| 03 · Método | Protocols personalised by biomarkers. "No protocolos genéricos." |

**El espacio** — consulting rooms in Santa Fe, "casona recuperada, materiales cálidos, nada que se lea como clínica". Four real photographs shown in chat on 2026-09-11: the facade (restored house, arched doors), the application room (massage chairs, warm light), the individual boxes (separated by curtains, laptop-friendly) and the interior patio (original mosaic floor). **The files are not in the repo yet**: they are needed for the "Espacio" section of the Home, and are the first real photographs of CR-01.

**Where it is used today** — Home hero, left column (D-031, form D-032): the hook "No esperamos que algo falle para intervenir." and three points, one line each: "Medicina preventiva, no reactiva" · "Protocolos por biomarcadores" · "Un espacio nada clínico" (the client's three differentiators, tightened). Every phrase comes from the paragraphs above.
Home services section (D-033): title "Una estrategia de salud diseñada para tu organismo." (a founder's phrase); cards "Evaluación médica completa", "Protocolos individuales", "PRP", "Seguimiento de hábitos" with one-liners tightened from the services list above. Source file: `web/src/content/servicios.ts`.
Home services section (D-034, replaces the D-033 bento): title "Nuestros servicios", line "Para conocer, prevenir y optimizar tu salud."; four cards "Evaluación médica completa", "Protocolos individuales", "PRP", "Seguimiento de hábitos", each with a one-liner, a longer description and four "incluye" points taken from the services list and the founders' paragraphs above; button "Reservar este servicio". Source file: `web/src/content/servicios.ts`.
