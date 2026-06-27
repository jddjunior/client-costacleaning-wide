# Branch Avenue — Design System

The shared brand + UI system for **Branch Avenue**, a platform company that
runs three products on one foundation, with an operator console — the
**Initial OS** — sitting above all of them.

> **Status:** v0.1. Foundations, core components, and the Initial OS UI kit are
> built. See **Caveats** at the bottom for open items (real logo, font hosting).

---

## 1. What Branch Avenue is

Branch Avenue builds a **multi-tenant platform core** (tenancy · auth · billing ·
events · experiments · AI gateway) and ships three products on top of it:

| Product | What it is |
|---|---|
| **Avenue OS** | Multi-tenant platform for dealership groups (inventory, leads, deals). |
| **Transport App** | Car-shipping & tow marketplace (lanes, carriers, jobs). |
| **Agency Platform** | SEO/CRO "site factory" for agency clients. |

The flagship surface in this design system is the **Initial OS** — the operator
command center that sits *above* the three products. From it, a platform
operator sees every tenant, **approves every AI agent proposal** (agents
propose, humans dispose), watches every CRO experiment, and monitors AI spend.
That human-in-the-loop approval flow is the heart of the product and the kit.

### Design intent (from the founder)
> "I don't want a hyped-up AI-slop UI. I need a workable, nice-looking,
> Figma-premium, clean look."

Everything here is built to that bar: near-monochrome, border-defined,
restrained color, dense but legible. No purple hero gradients, no emoji cards,
no decoration that doesn't carry information.

### Sources
- **Conversation transcript** (pasted by the user) describing the platform
  architecture and the Initial OS console. No codebase or Figma file was
  attached — the brand was defined from scratch against that vision.
- `Platform Core` package README (pasted): the six-package foundation
  (`@platform/tenancy`, `auth`, `billing`, `events`, `experiments`, `ai-gateway`).

No GitHub repo or Figma URL was provided. If you have one, attach it via the
Import menu and we can align the kit to the real product code.

---

## 2. Content fundamentals — how Branch Avenue writes

The console is an **operator tool**, so copy is calm, precise, and factual —
the voice of a dependable control room, not a marketing site.

- **Voice:** plain, declarative, lightly technical. State what is true and what
  needs a decision. *"9 agent proposals are waiting on you."* *"Variant B lifted
  VDP conversion +8.4%."*
- **Person:** address the operator as **you** ("waiting on you", "approve",
  "review queue"). Agents are named third parties ("CRO Agent proposed…").
- **Casing:** **Sentence case** everywhere — buttons, headers, nav, titles.
  ("Approval queue", not "Approval Queue".) The only all-caps is the small
  **eyebrow/label** style (tracked, 11px).
- **Numbers are first-class.** Money, percentages, token counts, IDs and lifts
  are shown precisely and set in **mono with tabular figures** so columns align
  and digits don't jitter. Always sign deltas (`+8.4%`, `-2.1%`).
- **Tone of status:** neutral by default; urgency is earned. "Urgent" and
  "Critical" mean it. "Watch" softens "warning". "All clear" rewards an empty
  queue.
- **Brevity:** labels are 1–3 words; a proposal gets one sentence of rationale,
  not a paragraph. Verbs lead actions: *Approve, Reject, Review, Snooze, Roll
  out, Pause.*
- **No emoji.** Status is carried by a colored dot + word (a Badge), never an
  emoji. **No exclamation marks** in product chrome.
- **IDs stay machine-shaped:** `prp_8841`, `org_ls`, `exp_204` — lowercase,
  underscored, mono. Never prettified.

---

## 3. Visual foundations

The system is **near-monochrome and border-defined**. Structure comes from
hairline borders and a true-neutral gray ramp; a single deep **pine green**
carries identity and action. It should feel like a precise instrument.

### Color
- **Brand — Pine green.** `--green-600 #166848` is primary (buttons, active
  nav, links lean to `--green-700`). Pine reads as *go / healthy / growth* and
  deliberately sidesteps the SaaS blue-purple cliché. Hover darkens
  (`--green-700`), active darkens further (`--green-800`).
- **Neutrals** are a true-neutral, faintly-cool ramp (`--gray-0 … --gray-950`).
  They do all the structural work: text, borders, surfaces, tracks.
- **Status hues are restrained, never neon:** positive=pine, negative=`#bb3a3a`,
  warning=amber `#a8720f`, info=blue `#275ea0`. Each has a tint background +
  border for badges (`--positive-bg/-border`, etc.).
- **AI = violet, used sparingly** (`--violet-600`). This is the *one* place a
  cooler accent appears — reserved for agent/AI affordances (proposals,
  sparkles icon) so "this came from an agent" is instantly legible. It is an
  accent, never a background wash.
- **Categorical / verticals:** Avenue OS = pine, Transport = blue, Agency =
  amber, AI = violet. Used for the dot that tags which product a row belongs to.
- Reach for **semantic aliases** (`--text-primary`, `--surface-card`→
  `--bg-surface`, `--brand`, `--positive`), not raw ramps, in product code.

### Type
- **Geist** for all UI; **Geist Mono** for numbers, IDs, money, code.
- Console default body is **13–14px** (dense), display up to 36px. Headings are
  **semibold (600)** with tight tracking (`-0.01em`); display goes to `-0.02em`.
- **Tabular figures everywhere numbers matter** (`font-feature-settings:'tnum'`).
- Eyebrows/labels: 11px, semibold, uppercase, `0.06em` tracking, tertiary gray.

### Spacing, radius, elevation
- **4px base grid** (`--space-*`). Layout is calm and aligned to it.
- **Moderate radii:** controls 8px (`--radius-md`), cards 12px (`--radius-xl`),
  sheets 16px, pills 999px. Nothing is sharp; nothing is bubbly.
- **Shadows are low-spread and rare.** Structure is *borders*, not shadow.
  Shadows (`--shadow-sm/md/lg`) signal true elevation only — raised cards,
  popovers, modals. Raised surfaces also get a 1px top **highlight**
  (`--highlight-top`) for a crisp "lifted paper" edge.

### Borders & gradients (used with restraint)
The "premium" feel comes from *hairlines and washes*, not saturated gradients:
- `--grad-brand` + `--grad-brand-sheen`: the pine button/brand-mark surface —
  a subtle vertical darkening plus a top sheen. Never a rainbow.
- `.ba-gradient-border`: a brand gradient **hairline ring** around a solid fill
  (used on the "proposals waiting" callout).
- `.ba-raised`: the standard raised card — wash + top highlight + soft shadow.
- `--wash-app`: a barely-there pine radial at the top of the app canvas.
- `--glow-brand` / `--glow-ai`: focus/emphasis glows, not decoration.

### Motion
- Quick and confident: `--duration-fast 120ms` for hovers, `--base 180ms` for
  most transitions. Easing is `--ease-out` (decelerate); the switch knob uses a
  light spring. **No bounces on content, no infinite loops.** Hovers shift
  background a step; presses nudge `translateY(0.5px) scale(0.99)`.

### Interaction states
- **Hover:** background steps one level (transparent→`gray-100`, surface→
  `gray-25/subtle`); primary darkens to `--brand-hover`.
- **Press:** subtle scale-down + downward nudge.
- **Focus:** 3px pine ring (`--focus-ring`); red ring on danger controls.
- **Selected/active nav:** white surface + hairline + xs shadow (a "raised
  chip"), pine icon, semibold label.

### Surfaces & layout
- App canvas is `--gray-50`; cards/panels are white with a 1px `--border`.
- Fixed chrome: 248px sidebar, 52px topbar. Topbar is translucent white with a
  blur (`backdrop-filter`) so content scrolls under it.
- Imagery: none shipped yet. When added, keep it cool/neutral and
  understated — this is an instrument panel, not a landing page.

---

## 4. Iconography

- **The icon system is [Lucide](https://lucide.dev)** — 24px grid, **2px
  stroke, round caps & joins.** It matches the clean, technical, non-decorative
  voice exactly.
- In this system, icons are rendered through the **`<Icon name="…">`**
  component (`components/display/Icon.jsx`), which **vendors the exact Lucide
  glyph path data** for the icons the console uses (gauge, circle-check,
  flask-conical, building-2, sparkles, route, …). This keeps every card and kit
  rendering with **zero network dependency**. The full list is exported as
  `ICON_NAMES`.
- **In production, prefer `lucide-react`** and import icons by name — the
  vendored set is a convenience for these self-contained artifacts, not a fork.
- **Icon color** inherits `currentColor`; pass `color` to tint (e.g. AI violet
  for `sparkles`, positive pine for `circle-check`).
- **No emoji, no unicode-glyph icons, no PNG icons.** One stroke icon system,
  used consistently.
- **Logo:** Branch Avenue has **no supplied logo yet**. The wordmark in the kit
  uses a pine "route/branch" Lucide glyph in a gradient tile as a *placeholder
  brand mark*. ⚠️ Replace with the real logo when available (see Caveats).

---

## 5. Index / manifest

**Root**
- `styles.css` — the single entry point consumers link. `@import` manifest only.
- `readme.md` — this file.
- `SKILL.md` — Agent-Skill front-matter so this system works in Claude Code.

**`tokens/`** (all reached from `styles.css`)
- `fonts.css` — Geist + Geist Mono `@font-face` (via Google Fonts).
- `colors.css` — neutral ramp, pine brand, status hues, semantic aliases.
- `typography.css` — families, sizes, weights, tracking, tabular numerics.
- `spacing.css` — spacing grid, radii, elevation, z-index, motion, layout vars.
- `effects.css` — washes, brand gradients, gradient hairlines, glows, helpers.
- `base.css` — reset + on-brand defaults + scrollbars.

**`components/`** — reusable React primitives (bundled to
`window.BranchAvenueDesignSystem_044fdd`)
- `core/` — **Button**, **IconButton**, **Badge**, **Card** / **CardHeader**.
- `forms/` — **Input** / **Field**, **Switch**.
- `display/` — **Avatar**, **Icon** (Lucide).

**`ui_kits/initial-os/`** — the operator console recreation
- `index.html` — interactive shell (nav between screens, vertical filter,
  live approve/reject flow).
- `data.js` — mock platform data (tenants, approvals, experiments, spend).
- `Chrome.jsx` — Sidebar + Topbar. `shared.jsx` — StatTile, Sparkline, ConfBar.
- `OverviewScreen.jsx`, `ApprovalsScreen.jsx`, `DataScreens.jsx` (Experiments +
  Tenants), `App.jsx`.

**`guidelines/`** — foundation specimen cards (the Design System tab):
colors (brand/neutral/status/surfaces), type (display/body/mono), spacing
(scale/radius/elevation), and borders & gradients.

---

## 6. Caveats & open items

- **No real logo.** A placeholder pine "route" mark stands in. **Please share
  the Branch Avenue logo** (SVG preferred) and I'll wire it into the wordmark,
  favicon, and a brand card.
- **Fonts via Google Fonts CDN.** Geist + Geist Mono are loaded from Google
  Fonts for portability. For production/offline, self-host the `.woff2` files
  and swap the `@import` in `tokens/fonts.css` for local `@font-face` rules.
- **Brand defined from a transcript, not source.** No codebase/Figma was
  attached, so colors, type, and tone are a *proposed* identity matching the
  stated "Figma-premium, no-slop" intent. If real product code or brand assets
  exist, attach them and I'll reconcile.
- **One UI kit so far (Initial OS).** Avenue OS, Transport, and Agency each
  warrant their own kit — happy to build them next.
