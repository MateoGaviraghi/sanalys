# Product

> Strategic context for the `impeccable` design skill, which reads this file before any design work. It is a summary, not a source: every line points back to the doc that owns it. If this file and a numbered doc disagree, the numbered doc wins and this file is corrected. Written 2026-09-11 (WU-04, D-026) from `docs/00-BRIEF.md`, `docs/05-DISENO.md` and `docs/06-SEGURIDAD.md`, without a separate interview: every answer below is already written in those docs.

## Register

brand

## Users

Prospective and returning patients of a private IV-therapy clinic in Santa Fe, Argentina, on a phone, on 4G (`docs/00-BRIEF.md` §2, §4). Their job on the public site: understand what a Drip is, pick one, and book a slot from the phone; returning patients rebook, read a news post, or find the address and hours. The clinic is not open yet and there is no behavioural data: direction comes from the identity manual, never from assumed audience preferences (§9).

## Product Purpose

The public site (`web/`) exists to take appointments online. Success is one number: **appointments booked per month**, counted on `/turnos/confirmado/` (`docs/00-BRIEF.md` §5). Everything on the Home serves the path from "what is this" to "Reservar turno".

## Brand Personality

Clinical and confident, lime-bright, human. *La ciencia de estar bien.* is the slogan and the headline. Preventive, evidence-based medicine presented without the sterile white-and-blue of a hospital and without the soft pastel of a spa: a closed brand palette (verde `#0A3D33`, fluo `#D0FF4E`, gris, blanco), radius zero, geometric type as the protagonist (`docs/05-DISENO.md` §1). The product itself, the Drip bag with its printed label, is the hero image and the source of each Drip's colour.

## Anti-references

- The generic AI landing page: text left / photo right, centred gradient hero with two buttons, equal three-column icon grid, fade-up on every section (`docs/05-DISENO.md` §1, §11).
- Inter / Geist, slate neutrals, `rounded-2xl` everywhere, untouched shadcn.
- Static, traditional clinic sites: stock photos of smiling nurses, nothing that moves, nothing that belongs to this brand.
- Motion that decorates instead of saying something: autoplay the visitor did not ask for, bounce and elastic easing, anything that fades when it should travel.

## Design Principles

1. **The product is the hero.** The Drip bag and its label carry the page; colour, layout and motion are derived from the label, not invented around it.
2. **Motion is continuous and chosen by the visitor.** Nothing changes on its own; when it changes, it travels (a wheel turning, a colour flooding) instead of cutting or fading.
3. **One idea per fold.** One headline, one bag, one primary action. Restraint in count, commitment in execution.
4. **Built in the running app, judged in the browser.** No mockups; a block is done only when it has been looked at, at 375 and 1440, with the motion running (`docs/10-MEMORY.md` D-017, G-040).
5. **Nothing invented.** Prices, credentials, addresses, claims and journey steps are `{{CONFIRMAR}}` until the client provides them.

## Accessibility & Inclusion

WCAG 2.2 AA. Text contrast measured, not estimated (`docs/05-DISENO.md` §2.1; hero palettes in `docs/10-MEMORY.md` D-025). `prefers-reduced-motion` is honoured by every animation with a gentler variant, and smooth scroll is not mounted at all under it. Touch targets 44 px minimum. Content is visible in its resting state without JavaScript; entrance motion only enhances it. Health data never reaches the public site (`docs/06-SEGURIDAD.md`).
