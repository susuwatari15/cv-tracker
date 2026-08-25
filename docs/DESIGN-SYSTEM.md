# TA Assistant — Design System

This is the design system the app actually implements. It is **derived from
`DESIGN.md`**, which documents Miro's system, but deliberately departs from it
on the identity layer. Read this file, not `DESIGN.md`, when building UI here.

## Why we diverged from DESIGN.md

`DESIGN.md` describes a consumer-creative brand: canary-yellow wordmark,
pastel sticky-note feature cards, 28px corners, an 80px marketing hero. That
vocabulary signals *playful collaboration*. This product is an internal system
of record for recruiting — it holds candidate PII, drives reject/offer letters,
and produces salary guidance a hiring manager acts on. It has to read as
considered and accountable, not fun.

So we kept the **architecture** and replaced the **identity**:

| Dimension | DESIGN.md (Miro) | TA Assistant | Rationale |
|---|---|---|---|
| Brand colour | Canary yellow | Navy rail `#0f172a` + action blue `#0b5cad` | Yellow-on-white reads consumer; navy/blue is the register HR tooling works in |
| Typeface | Roobert PRO (geometric, rounded) | Plus Jakarta Sans | Legible at the 12–15px this app renders at; full Vietnamese diacritic coverage |
| Feature cards | Pastel fills, 28px radius | Flat white, 10–12px radius, hairline border | Data-dense dashboard style; colour is reserved for meaning |
| Hero | 80px marketing display | None | This is an app, not a landing page |
| Pill radius | Every button | Chips, badges and filters only | Pills aid scanning in a chip row; 8–10px reads more settled on primary actions |
| Accent usage | Yellow for decoration | Colour only carries state | In a screening tool a coloured element should mean something |

**Kept from DESIGN.md:** 4px spacing base, the 0–4 elevation ladder
(flat by default, depth reserved for overlays), the radius scale, three border
weights (`soft` / `default` / `strong`), the ink text ramp, semantic tokens over
raw hex, and the "document default and pressed states, not hover" discipline.

## Tokens

All tokens live in `src/app/globals.css`. **Never write a hex in a component** —
add a token. Every token is defined for both themes; the shadcn primitive
variables (`--primary`, `--border`, `--input`, …) are *mapped onto* these
tokens so `ui/` primitives and custom components can't drift apart.

### Surfaces
`canvas` (app background) · `canvas-2` (recessed) · `surface` (cards) ·
`surface-2` (card headers, footers, inset panels) · `rail` (navigation, always
dark in both themes) · `rail-raised`

### Text ramp
`ink` (primary) · `ink-2` (secondary) · `ink-3` (tertiary, hints) ·
`ink-4` (placeholders only)

### Borders
`border-soft` (inside a card) · `border-default` (card edge, dividers) ·
`border-strong` (input edge, chips)

### Action
`ta-accent` (the single CTA colour, both themes) · `ta-accent-hover` ·
`ta-accent-fg` · `ta-accent-soft` (icon tiles, selected chips) · `ta-navy`

### Semantic status
`success` · `warning` · `danger` · `info`, each with a `-soft` background and a
`-border`. Status is **never colour-only**: `StatusPill` always pairs the tone
with an icon and text.

### Elevation
`shadow-e1` (resting card) · `e2` (result panel) · `e3` (hover lift) ·
`e4` (drawer, modal)

## Verified accessibility floors

These were measured, not estimated:

- Every foreground/background pair in both themes meets **4.5:1**; placeholders
  and decorative glyphs meet **3:1**. `ink-4` was darkened from `#94a3b8` to
  `#7d8da4` to clear that floor.
- Navigation-rail labels were raised from `white/35`–`white/45` (3.2–4.5:1) to
  `white/55` (≥6.2:1).
- `scrollWidth === viewport` at 390 / 768 / 1180 / 1600 — no horizontal scroll.
- No unlabeled icon buttons, no inputs without a label, in any tool screen.
- `prefers-reduced-motion` collapses all animation; `prefers-color-scheme`
  drives the default theme with an explicit three-state override.

### Known, deliberate deviations

- **Field chips are 36px tall with a 24px remove button**, below the 44px touch
  guidance. A recruiter toggles eleven of these at once; full-size targets would
  push the row to three lines. The remove button is now *always visible* rather
  than hover-revealed, which was the actual blocker on touch.
- **Inline text links inside a sentence** (e.g. "mở Cấu hình") stay at text
  height, per the WCAG 2.5.8 inline exception.

## Iconography

Lucide only, via the registry in `src/lib/toolMeta.ts`. **No emoji anywhere in
the UI.** Emoji were previously doing structural work — the entire sidebar, every
form-section heading, and every button. They render differently per OS and font,
can't take a design token, and read as consumer chat rather than a work tool.

`toolMeta.ts` is the single source of a tool's icon, label and description, so
the sidebar, the tool header and the overview hub can't disagree.

## Typography

One family, four weights. Monospace (`font-mono`) is reserved for **machine
data**: API keys, model ids, JSON field keys. It is no longer used for field
labels or helper text — mono at 11px reads as a terminal readout, which is
exactly the wrong register for a form an HR lead fills in daily.

Numeric columns carry `.tabular` (or `data-numeric`) so figures don't reflow.

## Layout

Three columns at ≥1280px: rail (264px) · content · assistant (380px).
Below that the assistant becomes a right overlay; below 1024px the rail becomes
an off-canvas drawer reached from the header. Both overlays trap `Escape` and
use a 50% scrim.

The previous shell was a fixed 280px + 400px pair with no collapse, which left
roughly 340px for the actual tool on a 1024px laptop.

## Assistant visibility

The AI assistant is one panel with two presentations, sharing a single
visibility state so a floating button can toggle it at every width:

- **≥1536px** it docks as a third column, taking real layout space (mounted
  only when open).
- **Below that** it is a right-side overlay with a scrim.

`AssistantFab` is anchored to the bottom-right of the *content column*, not the
viewport, so on wide screens it sits beside the docked panel rather than on top
of it. While the assistant is an overlay the button is **not rendered at all**:
the drawer covers that corner, so it would be unclickable yet still focusable —
a control announcing "Ẩn trợ lý AI" that does nothing. The drawer closes from
its own X, Escape, or the scrim (all three verified).

Two details that are easy to get wrong:

- **`chatOpen` is `boolean | null`, not `boolean`.** `null` means "the user
  hasn't chosen", which falls back to the per-breakpoint default — open when it
  can dock, closed where it would cover the tool. A single boolean cannot carry
  two defaults, and initialising from `matchMedia` during render would be a
  hydration mismatch. The breakpoint is read via `useMediaQuery`
  (`useSyncExternalStore` with a defined `false` server snapshot).
- **The scroll area needs bottom padding** (`pb-24 md:pb-28`) so content
  scrolled to the end clears the floating button instead of hiding under it.
  Toasts get a matching `offset` in `layout.tsx`, since they share that corner.

Only one control per action: adding the floating button meant **removing** the
assistant button from the tool header rather than having two.

### Known gap

Neither drawer (navigation or assistant) implements a focus trap. They set
`aria-modal` and handle Escape, but background content stays reachable by Tab
and by screen-reader traversal. Worth fixing properly rather than partially.

## Patterns

- **One primary action per screen** (`RunButton`). When it is disabled it states
  *why* (`disabledHint`) instead of just greying out.
- **Waits over ~300ms show a skeleton** (`OutputSkeleton`), not a spinner, and
  the skeleton reserves the final height.
- **Every field has a visible label**, and persistent helper text rather than
  placeholder-only guidance (`FieldGroup`).
- **Empty states explain the next action** (`EmptyState`), never a blank pane.
- AI output is HTML-escaped before markdown conversion in `formatText`, because
  it round-trips untrusted text (uploaded CVs, pasted JDs) into
  `dangerouslySetInnerHTML`.

## Secondary navigation (settings)

Screens with more than one distinct configuration area use a **secondary rail**
rather than stacking sections vertically. Settings is the reference
implementation (`SettingsNav` + one pane component per section):

- It is a real `role="tablist"` with `aria-orientation="vertical"`, roving
  `tabIndex`, and Arrow/Home/End traversal — it swaps panels within one screen,
  so tab semantics match what keyboard users expect. The panel carries
  `aria-labelledby` pointing at its tab.
- The panel itself gets **no** `tabIndex={0}`: it is full of focusable inputs,
  so an extra tab stop would be noise. Add it only for a panel with nothing
  focusable inside.
- **Vertical rail from `md` up, horizontal segmented row below** — a nested
  drawer inside an already-drawered layout is a dead end on a phone. Tabs are
  44px tall in the horizontal form.
- **Form state is hoisted above the panes.** Switching sections unmounts a
  pane, so any `useForm` living inside it would silently discard edits in
  progress.
- A section that batches edits owns its own save affordance and shows an
  **unsaved-changes dot on its nav item**, so pending work stays visible from
  the other section. A section that saves on change (the AI connection) has no
  save button — one would imply the value isn't live until pressed.
- Keep nav descriptions short enough to fit one line at the rail width;
  uneven tab heights read as a rendering bug.

## Saved connection profiles

`ConnectionProfiles` stores named provider + key + model triples so a recruiter
can keep, say, a company GreenNode key and a personal Anthropic key side by
side and switch without re-pasting. Rules the implementation follows:

- **Applying a profile writes through to the per-provider key/model maps**, so
  the "loose" configuration and the profile can't drift out of sync.
- **The active profile shows a "Đã sửa" badge when the live config differs**
  from what was stored, with a `Cập nhật` action to write it back. Silently
  letting them diverge would make the profile list lie.
- **Keys are masked** to `prefix…last4` in the list. Enough to tell two keys
  apart, not enough to read one off a shared screen.
- **Delete asks for confirmation** and says explicitly that the current
  connection is not dropped — deleting a profile is not disconnecting.
- **Duplicate names are refused**, since the name is the only thing
  distinguishing two masked keys.
- Profiles live in `localStorage` alongside the keys themselves. The panel says
  so plainly, including that it does not sync across machines and shouldn't be
  used on a shared computer.

### Custom endpoint

The connection panel exposes an **Endpoint** field so a provider can be pointed
at a corporate gateway, an Azure/proxy deployment, or a local model server
(Ollama, LM Studio, vLLM). Empty means "use the provider registry default", and
typing the default back in clears the override rather than storing a redundant
copy of it.

**This is a server-side security boundary, not just a form field.** A
user-supplied endpoint means the client decides which URL the *server* fetches
— the definition of SSRF. So `src/lib/ai/endpoint.ts` validates on the server
in both API routes, never trusting the form:

- `https` only, with `http` permitted solely for localhost (blocking it would
  kill the local-model-server use case, which is a main reason to set this).
- No credentials embedded in the URL — they end up in logs.
- Cloud instance-metadata hosts (`169.254.169.254`, `metadata.google.internal`,
  …) are rejected outright; they are never a legitimate AI endpoint.
- Optional `AI_ENDPOINT_ALLOWLIST` env var (comma-separated hosts) locks
  overrides down at deploy time. Unset means "any host that passed validation",
  which keeps local development workable. Host matching is exact-or-subdomain,
  so `openai.com` does not admit `notopenai.com`.
- A rejected endpoint returns 400 with the reason; it never silently falls back
  to the default, which would hide a misconfiguration.

Stored endpoints are re-validated on hydration, so a value that was legal when
saved but is no longer accepted gets dropped instead of failing at request time.

The endpoint is part of a connection profile, shown on its own line in the
profile row **only when it differs from the default** — otherwise it is noise on
every row.

### Store hydration

`StoreInitializer` hydrates every store **inside an effect**, never during
render. Reading `localStorage` in the render pass made the server emit default
state while the client's first render already had persisted values — a
hydration mismatch that React resolves by discarding and re-rendering the tree.
Any new persisted store must be hydrated the same way, via `initStores`.
