# 13 — SKILLS MAP

> Which skill is for what, what to take from it, when in a unit it is consulted, and how it is loaded. The build chat **reads this before planning any UI, motion, booking or performance work**, records in the plan which skills it will use for which block, and records in the WORKLOG entry which it actually used. Designing or animating without the skill named here is a FAIL, not a shortcut.

## 0. The protocol — before, during, after

1. **Before the plan.** Find every block of the unit in the table of §2. Load the skills it names (§3 tells how). Read the referenced sections in full; do not skim. Then write the plan; each block in the plan cites the skill and the section it applies (`Hero → motion-web-senior/text-animation.md §SplitText lines; web-distintiva step 1 stance`).
2. **During.** When a block needs a reference (a component, a carousel behaviour, a text effect), go and **look at it** with the browsing protocol in §4 before writing code. Adapt to the brand tokens; never paste.
3. **After.** The WORKLOG entry lists, per block, which skill and which reference was used, and any recommendation the skill made that was rejected and why. If a skill turned out useless for a block, say so — the map is corrected here.

4. **Nothing is HECHO until it has been looked at.** Before reporting a UI block done, open the running page in the Browser pane, screenshot it at **375 and 1440**, and read your own screenshot against `docs/05` §10 and §11 line by line. Attach both screenshots to the report. A block reported done without them is a FAIL and gets sent back unread. Reasoning in a code comment about why something is correct is **not** evidence that it renders; the first hero shipped with the H1 half invisible while the file carried a paragraph explaining why that could not happen (G-040).

Never load more than two skills in the same pass; finish applying one before opening the next.

## 1. How to load

| Kind | How |
|---|---|
| Registered skill (`web-distintiva`, `ui-ideas`, `impeccable`, `motion-web-senior`) | `Skill` tool, e.g. `Skill(web-distintiva)`; or the router `/diseno` and `/motion`, which print the menu and load the right one |
| Library skill (everything else below) | Read `C:\Users\mateo\.claude\skills-library\arsenal\<name>\SKILL.md` **in full** and follow it as if loaded; its `references/`, `scripts/`, `assets/` live in that folder |
| A skill that does not load or does not exist | Stop, report to Mateo, do not proceed on that block from memory |

## 2. Need → skill → what to take from it

### Design of the public site

| Need | Skill | What to take | When |
|---|---|---|---|
| Any new page, section, hero, component in `web/` | **`web-distintiva`** (registered) | Step 1 stance (already signed in `docs/05` §1 — restate it, do not re-decide), step 2 veto checklist, step 3 tokens before components, step 4 vetted libraries only, step 6 self-critique before "done" | Start of every UI unit; step 6 before every PR |
| Ideas, options, the real name of a pattern, a reference to look at | **`ui-ideas`** (registered) + its `COMPONENT-INDEX.md` (heros, text effects, cards, scroll, nav, buttons, carousels, backgrounds, forms, transitions, signature moments) | 2–4 named options with demo links, `→ MI PICK`, anti-generic filter. Then **go see the demo** (§4) and extract the pattern, adapted to tokens | Before designing any block; mandatory for hero, Drip card, carousel, CTA band, booking widget |
| Polish, critique, audit of something already built | **`impeccable`** (registered; sub-commands `critique`, `polish`, `audit`, `animate`, `adapt`, `harden`, `optimize`) | The critique before Mateo reviews; `adapt` for responsive passes | End of every UI unit, before screenshots |
| Should this animate at all, what purpose, which curve/duration, how it interrupts and exits | **`animate`** (library) | The decision order; concrete values | Before writing any GSAP timeline |
| Where motion is missing or excessive on a built page | **`find-animation-opportunities`** (library, read-only) | The proposals with exact values; the rejections | After a page is built, before the review |
| Review of motion code against a craft bar | **`review-animations`** (library) | Default is to flag; approval is earned | Review pass of every motion PR |
| Physical, spring, gesture feel; typography optical sizing; reduced-motion | **`apple-design`** (library) | Interruptible transitions, spring values, `opsz`/tracking rules for Roboto Flex | Booking widget steps, sheet/drawer on mobile, headline typography |
| Invisible details, component polish | **`emil-design-eng`** (library) | The checklist of details | Before "done" on Nav, buttons, cards |
| Mobile-first layout, touch targets, container queries, responsive images, mobile nav, safe areas, mobile performance | **`tailwindcss-mobile-first`** (library, ~980 lines) | §touch targets, §container queries, §responsive images, §mobile nav, §safe area, §performance, final checklist | Every public unit; the checklist before screenshots at 375 |
| Complex grids, named lines, full-bleed breakouts | **`tailwindcss-advanced-layouts`** (library) | The named-line grid for the hero and section breakouts (`docs/05` §10) | WU-04, WU-05 |
| Generic anti-AI baseline (Anthropic) | **`frontend-design`** (plugin, auto) | Background; `web-distintiva` wins on conflict | — |
| Web interface guidelines compliance | **`web-design-guidelines`** (library) | The review list | Review pass |

### Motion, carousels, 3D

| Need | Skill | What to take | When |
|---|---|---|---|
| GSAP timelines, SplitText, ScrollTrigger, Lenis, Embla, page transitions, motion a11y and performance | **`motion-web-senior`** (registered) | `references/text-animation.md` (SplitText hero reveal), `references/carousels.md` (Embla: dots with real state, progress bar, lazy per visible slide, scale/opacity tween, reduced-motion autoplay rule), `references/gsap-core.md`, `references/gsap-scrolltrigger.md`, `references/lenis.md`, `references/nextjs-react-integration.md` (`useGSAP`, cleanup), `references/page-transitions.md`, `references/performance.md`, `references/accessibility-motion.md`, `references/anti-patterns.md` | WU-04 (hero, carousel, CTA), WU-05 (shell, transitions), WU-06–07, WU-08 (step transitions, status panel) |
| Scroll-linked motion, pinning, scrub | **`gsap-scrolltrigger`** (library, official GSAP) | Trigger/scrub patterns, cleanup, mobile caveats | Process steps, proof strip reveals |
| Shared-element route morph (Drip card → Drip page) | **`react-view-transitions`** (library) | `<ViewTransition>` usage, CSS pseudo-elements | WU-07 |
| Motion that stutters | **`fixing-motion-performance`** (library) | Compositor-only properties, layout thrash, blur costs | Whenever INP or scroll cost exceeds `docs/05` §5 |
| Anything 3D | **`threejs-webgl-senior`** (library) | Mobile GPU budget, DPR cap, degradation | Only if `docs/05` §7 is reopened by a `D-NNN`; not by default |

### Booking, accessibility, performance, security

| Need | Skill | What to take | When |
|---|---|---|---|
| Calendar and slot grid keyboard/screen-reader behaviour, focus, live regions, form errors | **`fixing-accessibility`** (library) | ARIA grid pattern, focus management, error announcement | WU-08; WU-12 forms |
| Pending / error / success states of a control | `docs/05` §5 + the vault rule quoted in `KICKOFF.md` (text change + opacity, `--dur-1`, one reserved message slot, `role="status"`) | — | Every form |
| Slow, laggy, heavy, Core Web Vitals | **`optimize`** (library) | Diagnosis order: loading, rendering, animation, images, bundle | Any unit whose lab numbers miss `docs/05` §6; all of `sistema/` (A5 gates block) |
| Installing any package; handling input, sessions, files | **`security-and-hardening`** (library) | Supply-chain checklist; input/session rules | Every install; WU-08, WU-12+ |
| Review of a diff for vulnerabilities | **`security-review`** (built-in) | — | Before every PR that touches auth, input, files, money |

### Not for this project
`react-native-skills`, `animate-expo`, `mobile-touch`, `mobile-*-design`, `flutter-*` (native), `nextjs-supabase-auth`, `supabase-postgres-best-practices` (Supabase is prohibited), `shadcn` (no shadcn here), `google-*`, `stitch-*`, `imagegen-*`, `playground` (it produces a standalone HTML page nobody ships — that is a mockup under D-017).

> **`prototype` was on this list until 2026-09-10 and that was a misreading (D-019).** It does not produce mockups. It builds three to five **fully working** versions of one component, in this project's stack and with `@sanalys/brand` tokens, each diverging on a declared axis, behind a picker Mateo flips through live; then the winner is promoted into `web/src/` and the rest deleted. That is D-017 satisfied, not violated: real code, real motion, on the real page. Its own hard rule 1 already forbids touching production code during exploration.

## 3. Browsing protocol for `ui-ideas` — look before you build

An idea the chat cannot see is a paragraph. When `ui-ideas` returns a demo link, or when a block needs a reference (carousel behaviour, a text reveal, a card hover), **open it and look**, in this order:

1. **Claude's Browser pane** (built into the desktop app, zero install): `navigate` to the demo URL, `screenshot`, `get_page_text` / `read_page` to read the markup, `javascript_tool` only to inspect, never to build. Take one screenshot per reference into the PR description so Mateo sees what was adapted.
2. **Apify web fetch** (MCP connector on Mateo's account): `apify--web-fetch` or `apify--rag-web-browser` to get a page as Markdown when only the code/props matter, or when the Browser pane is not available.
3. **`playwright-cli`** (library skill, already in `C:\Users\mateo\.claude\skills-library\arsenal\playwright-cli\SKILL.md`): scripted navigation, snapshots, `find`, `eval` to pull a component's markup and computed styles when a gallery needs interaction (tabs, code panels, "copy" buttons). Requires the `playwright-cli` binary: if `playwright-cli --version` fails, install the official Microsoft package only after opening its npm page and checking publisher, name and date (`docs/02-STACK.md` §7) — **never** via a third-party `npx skills add`; the skill itself is already installed and must not be re-added (it would re-expose it in the `/` menu, which Mateo keeps short on purpose).

Rules: adapt to `@sanalys/brand` tokens, never paste; vet any library the reference uses against `docs/02-STACK.md` §6 before adding it; record the reference URL and what was taken in the WORKLOG entry; the anti-generic filter of `ui-ideas` applies — a reference that is itself a centred-hero-fade-up template is not a reference.

## 4. Maintenance

When a skill is added to Mateo's arsenal or one here proves useless, this file changes in the same PR that used it, with one line in `docs/10-MEMORY.md` if the change is a decision. This file never lists a skill that is not on disk.
