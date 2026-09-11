# Sanalys — operating instructions for this repository

You are building Sanalys: a public site (`web/`) and the rebuild of a clinic's internal system (`sistema/`) on one Postgres. Everything was decided before this build; this file routes, it does not repeat. **If it is not in `docs/`, not in `KICKOFF.md`, and not verifiable in the code, say so instead of guessing.**

## Read order (every fresh chat, before any work)

1. `docs/09-WORKLOG.md` §1 — where the project is, what is waiting on whom, what the next action is.
2. `KICKOFF.md` — the whole project expanded in one file.
3. `docs/11-ROADMAP.md` — find the work unit for this chat; its declared file list is your boundary.
4. `docs/10-MEMORY.md` — decisions, gotchas, open questions. Never re-decide what is there.
5. The docs the unit touches:

| If you are going to… | Read |
|---|---|
| Touch anything about scope, users, what is out, client inputs | `docs/00-BRIEF.md` |
| Add a route, a job, an integration, decide rendering | `docs/01-ARQUITECTURA.md` |
| Install or upgrade a package, pick a version | `docs/02-STACK.md` (§6 is the prohibited list) |
| Touch `packages/db`, a migration, a query, money, dates | `docs/03-DATOS.md` |
| Build or change a page or screen, a block, a state | `docs/04-INTERFAZ.md` |
| Touch colour, type, spacing, motion, images, 3D | `docs/05-DISENO.md` |
| Need an image, a headline, an icon, a composition reference, or anything from the identity folder | `docs/14-MARCA.md` — the brand folder mined: renders to export, copy bank, composition rules, what is never used |
| Touch auth, permissions, input, headers, secrets, files, PII | `docs/06-SEGURIDAD.md` |
| Add a file, a script, a workflow, a branch | `docs/07-REPO.md` |
| **Build or review any internal-system screen** | `docs/08-REGLAS-SISTEMA.md` — the parity contract, verbatim |

## Working model

- One operator, main thread. Reading may be delegated to the `explorador` subagent; nothing else is delegated. No workflows, no other subagents unless Mateo names them in the message.
- **One work unit per chat.** State the plan as literals (files, components, schema, texts, design constraints, R-class, DoD), then wait for Mateo's written `GO-AHEAD` before touching any file. Multi-file work never starts without it.
- Spanish to Mateo, English in every `.md`; technical terms stay in English. Short, concrete, no filler.
- Review before "done": diff vs. the unit's declared file list; `preflight/06` §3 checklist; for `sistema/` screens, parity vs. `docs/08-REGLAS-SISTEMA.md` rule by rule; screenshots mobile + desktop for any UI.

## Session protocol — how memory and context survive across chats

**Start.** Read in the order above. Then write back to Mateo, in Spanish, five lines: unit, what the WORKLOG says is pending, the declared file list, the docs sections that govern this unit, and the plan as literals. Wait for `GO-AHEAD`.

**During.** Before creating or editing each file, re-read the plan line that names it and the doc section it implements; if the file is not in the declared list, stop and report. Every time the context is compacted, or after roughly ten tool calls, re-anchor: re-read `docs/09-WORKLOG.md` §1 and the plan, and check the four things that never drift — the **structure** (`docs/04-INTERFAZ.md` block sequence for the page), the **design** (`docs/05-DISENO.md` §1 stance, §2 tokens, §5 motion inventory), the **objective** (`docs/00-BRIEF.md` §5, bookings on `/turnos/confirmado/`), and the **inherited behaviour** (`docs/08-REGLAS-SISTEMA.md`, verbatim). Ambiguity is a stop-and-report, never a guess. A "better idea" outside the plan is a note for `docs/10-MEMORY.md`, not code.

**End (mandatory, even if the unit is unfinished).** Append one entry to `docs/09-WORKLOG.md` §2 using its template and overwrite §1 STATE; append any `D-/G-/TD-/OQ-` to `docs/10-MEMORY.md`; then one short Spanish message: done, failed, next. A chat that ends without the WORKLOG entry has lost its memory.

## Skills per unit — mandatory, loaded before the plan is written

The design and motion knowledge is not in this repo; it is in Mateo's skills, available in every chat on his machine. **`docs/13-SKILLS.md` is the map: need → skill → what to take → when.** Read it before planning any UI, motion, booking or performance work; cite the skill per block in the plan; record which were used in the WORKLOG entry. When a block needs a reference, go and look at it first (`docs/13-SKILLS.md` §3: Browser pane, Apify, `playwright-cli`). Load with the `Skill` tool or by reading the file; **if one cannot be loaded, stop and report — never design or animate from memory.** The table below is the short version.

| Units | Load, in this order | How |
|---|---|---|
| WU-04, WU-05, WU-06, WU-07, WU-09, WU-10, WU-11 (public UI) | `web-distintiva` (anti-generic protocol, self-critique pass) · `ui-ideas` (real component references) · `impeccable` (polish/critique when asked) | `Skill(web-distintiva)`, `Skill(ui-ideas)` |
| Same units | `animate`, `find-animation-opportunities`, `tailwindcss-mobile-first` | Read `C:\Users\mateo\.claude\skills-library\arsenal\<name>\SKILL.md` in full and follow it |
| WU-04, WU-05, WU-06, WU-07, WU-08 (motion, carousels, calendar) | `motion-web-senior` + its `references/carousels.md`, text-animation and performance references · `gsap-scrolltrigger` | `Skill(motion-web-senior)`; `C:\Users\mateo\.claude\skills-library\arsenal\gsap-scrolltrigger\SKILL.md` |
| WU-08 (booking) | `fixing-accessibility` | library, same path pattern |
| WU-12 onwards (`sistema/`) | `optimize` for UI performance; `security-review` before each PR | library / built-in |
| Any unit that installs a package | `security-and-hardening` §supply chain | library |

**Prohibited in every unit:** mockups, wireframes, Miro/Figma boards, "reference sheets", self-contained HTML files, playgrounds outside the app. Design is done in the running app, reviewed in the browser at 375 and 1440, with the motion running. Approval happens on the real page (D-010).

**`prototype` is allowed and is the tool for divergence (D-019).** When a block has no obvious composition and the brief is adjectives ("minimalista", "que juegue con las imágenes"), do not average the adjectives into a layout — run `prototype`: three to five working versions in this stack with `@sanalys/brand` tokens, each diverging on a declared axis, behind its picker, and Mateo picks on the real page. The winner is promoted into `web/src/` and the rest deleted. It was on the prohibited list until 2026-09-10 by mistake.

**Nothing is HECHO until it has been looked at (G-040).** Before reporting any UI block done: open the running page in the Browser pane, screenshot at **375 and 1440**, and check your own screenshot against `docs/05` §10 and §11 line by line. Both screenshots go in the report. A block reported done without them is sent back unread. A comment in the code explaining why something is correct is not evidence that it renders.

## How to talk to Mateo — strict rule

Every message to Mateo has this shape and nothing else, in Spanish, as **rendered markdown — never inside a code block** (2026-09-11: in the app a code block is monospace, long lines wrap under the labels and the sections run together; Mateo called it illegible):

> **Hecho**
> - what exists now, one short bullet per item
>
> **Falta**
> - what is missing, one bullet per item, with who unblocks it
>
> **Sigue**
> - the next single action
>
> **De vos**
> - exactly what you need from Mateo, or "nada"

Rules: no preamble, no recap of what Mateo said, no reasoning narrative, no options he did not ask for. A plan is the only long message and it is a table (`archivo | qué contiene | doc que lo gobierna`) followed by the four lines above. Numbers go in tables, never in prose. If a message needs more than ~15 lines outside a table, it is two messages or it is too much. Questions to Mateo: at most three, numbered, each one answerable with one word. Mateo must be able to understand the whole state of the build from the last message alone.

**Never.** Never redesign a page that already matches its block sequence. Never "improve" a rule of the inherited system. Never move a decision from `docs/10-MEMORY.md` without a new `D-NNN`. Never carry more than one unit in one chat.

## Non-negotiables an executor could violate without noticing

1. **Parity.** Every rule, formula, text, template, PDF and default of the internal system is reproduced exactly. Where the inherited code contradicts itself (`docs/08-REGLAS-SISTEMA.md` §0), the client's answer is applied; if it has not arrived, `{{CONFIRMAR}}` in the UI and stop.
2. **No invented data.** Prices, matrículas, addresses, phones, claims, journey steps → `{{CONFIRMAR}}`. Never a "typical" value.
3. **Authorization in the DAL** (`sistema/src/dal/guard.ts`) on every Server Action and route handler. Hiding UI is not security. Roles come from the `usuarios` row, never from the request, never from Clerk metadata.
4. **Money** is `numeric(12,2)` / `Decimal` / string on the wire. Never a JS `number`. **Time** is `timestamptz` UTC, rendered in `America/Argentina/Buenos_Aires`.
5. **Invariants live in Postgres** (`EXCLUDE` for chairs, sequences for comprobantes, triggers for period lock and state transitions, append-only consent and audit). App validation is for messages, not for safety.
6. **`web/` never touches clinical tables.** It uses `packages/db/src/web-queries` and the `sanalys_web` role only.
7. **Secrets** only in the Vercel env store; names in `docs/06-SEGURIDAD.md` §6; **never a `.env.example`** (hookify blocks it); post-build grep for secret values.
8. **Prohibited**: Supabase, Firebase, Railway, Netlify, Tailwind CDN, `xlsx` npm, Framer Motion, tokens in `localStorage`, paid plans, Inter/Geist, untouched shadcn, packages installed without opening their registry page (`docs/02-STACK.md` §6).
9. **Performance gates**: CLS ≤ 0.1 blocks everywhere; LCP ≤ 2.5 s and INP ≤ 200 ms at p75 block on `sistema/`. PDF/Excel/Chart libraries load lazily on click. No whole-table loads; queries bounded by day/period.
10. **Photos**: placeholders live in `web/public/img/placeholder/` under the duotone treatment; they never ship to production without written client acceptance.
11. **Nothing in `sistema-interno/` or `brandign-sanalys/` is edited.** The first is the read-only parity reference; the second is git-ignored source material.

## Commands (once WU-01 creates them)

`pnpm --filter web dev` · `pnpm --filter sistema dev` · `pnpm build` · `pnpm typecheck` · `pnpm lint` · `pnpm test` · `pnpm db:generate` · `pnpm db:migrate` · `pnpm db:seed`

## When something is not decided

Do not decide it silently. Write it as an `OQ-NN` in `docs/10-MEMORY.md`, put `{{CONFIRMAR}}` where it lands, tell Mateo in one line, and continue with everything that does not depend on it.
