# `tools/drips/` — the eight Drip bags, generated

The bags on the site are **not photographs and not stock**. They are rendered here, by this
project, and committed as AVIF frames. This folder is why they can be regenerated instead of
being a one-off export nobody can reproduce.

## Why this exists

There is no designer and no source file for anything in `brandign-sanalys/` — the identity
imagery is AI-generated (G-044). Only two of the eight bags exist as cut-outs, inside two PSDs;
Drips 03–06 live only inside flattened mockups on a gradient background, and **07 and 08 do not
exist in any form** (G-043). The bags could not be asked for and could not be extracted, so they
are built. D-022 records the decision and the measured budget.

## How to run it

```bash
cd tools/drips
python server.py                       # sirve esta carpeta y recibe los cuadros
# abrir http://127.0.0.1:4190/render.html?render=36   -> escribe 288 PNG en frames/
python process.py                      # recorta, codifica AVIF y escribe web/public/img/drips/
```

`render.html?solo=03` renders a single Drip to look at it without writing anything.

Requires Python with Pillow (AVIF support) — nothing else. Three.js comes from the CDN inside
`render.html`; **it is never a dependency of `web/`**. The site ships images, no WebGL
(`docs/05-DISENO.md` §7 stays in force).

## The one thing to understand before editing the model

A fluid pouch is **not an extruded rectangle**. It is two sheets welded around the perimeter.
`render.html` reproduces that with a subdivided plane displaced in Z by an inflation function
that **falls to zero at the edge** — so front and back meet there and form the flat welded rim.
That rim is the single feature that makes the shape read as an IV bag instead of a jerrycan; the
first attempt without it was rejected on sight.

Three things were each found the hard way and should not be "simplified" back:

| In the code | Why |
|---|---|
| Two inflation functions, one with wrinkles and one without | The label and the liquid use the smooth one. With wrinkles the label comes out mottled like camouflage and the liquid throws white specular streaks. |
| The label material is `MeshBasicMaterial` with `toneMapped: false` | ACES tone mapping crushes saturated colour and turned fluo `#D0FF4E` into pale yellow. Fluo is a brand colour (`docs/05` §2.1) and may not drift. Verified by reading the rendered pixel, not by eye. |
| The label sits **outside** the shell | Tried inside, physically correct: the plastic's wrinkles chop the text and it stops being readable. The relief comes from the gradient baked into the label texture instead. |

`process.py` computes **one crop box for all 288 frames**. Per-frame cropping makes the bag
change size and position as it turns — the rotation visibly jumps.

## Data

`drips.json` is the only source. Names, one-liners and label grounds are read from the identity
manual p.28. Liquid colours for 01–06 are sampled from the manual's own renders (p.26–27); **07
and 08 are proposed by this project** and carry `propuesto: true` — if a brand value ever
appears for those two, it wins.
