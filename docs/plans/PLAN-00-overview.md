# TA Assistant — Migration Plan Overview

**Source:** `ta-assistant.html` (single-file vanilla JS app)  
**Target:** Next.js 15 App Router · TypeScript · Tailwind CSS · shadcn/ui  
**Deployment:** Vercel

---

## Migration Sequence

Execute plans **in order**. Each plan depends on the previous one.

| # | Plan File | What It Covers | MVP Critical |
|---|-----------|---------------|:---:|
| 01 | `PLAN-01-project-setup.md` | Init Next.js 15, install all deps, configure TS/Tailwind/shadcn | ✅ |
| 02 | `PLAN-02-layout-shell.md` | 3-column shell layout, Sidebar, routing logic | ✅ |
| 03 | `PLAN-03-state-stores.md` | Zustand stores: API key, active tool, chat history, settings | ✅ |
| 04 | `PLAN-04-api-route.md` | Next.js Route Handler proxying Anthropic API | ✅ |
| 05 | `PLAN-05-shared-components.md` | OutputBox, Toast, ToolHeader, RunButton, form field primitives | ✅ |
| 06 | `PLAN-06-settings.md` | Settings panel: API key + Business Context per tool | ✅ |
| 07 | `PLAN-07-chat-panel.md` | AI Chat — Column 3 permanent panel | ✅ |
| 08 | `PLAN-08-cv-parser.md` | CV Parser tool | ✅ |
| 09 | `PLAN-09-jd-writer.md` | JD Writer tool | ✅ |
| 10 | `PLAN-10-email-writer.md` | Email Writer tool | ✅ |
| 11 | `PLAN-11-cv-eval.md` | CV vs JD Evaluation tool | ✅ |
| 12 | `PLAN-12-candidate-summary.md` | Candidate Summary tool | ✅ |
| 13 | `PLAN-13-salary-benchmark.md` | Salary Benchmark tool | ✅ |

---

## Final File Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout, fonts, metadata
│   ├── page.tsx                      # Renders AppShell
│   └── api/
│       └── claude/
│           └── route.ts              # Anthropic API proxy
├── components/
│   ├── ui/                           # shadcn primitives (Button, Input, etc.)
│   └── shared/
│       ├── AppShell.tsx              # 3-column shell
│       ├── Sidebar.tsx               # Column 1
│       ├── ContentArea.tsx           # Column 2 router
│       ├── AIChatPanel.tsx           # Column 3 (permanent)
│       ├── ToolHeader.tsx
│       ├── OutputBox.tsx
│       ├── RunButton.tsx
│       └── Toast.tsx
├── features/
│   ├── settings/
│   │   ├── components/
│   │   │   ├── ApiKeyField.tsx
│   │   │   └── BusinessContextForm.tsx
│   │   ├── containers/
│   │   │   └── SettingsContainer.tsx
│   │   └── types/index.ts
│   ├── chat/
│   │   ├── components/
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── QuickPrompts.tsx
│   │   │   └── ChatInput.tsx
│   │   ├── containers/
│   │   │   └── ChatContainer.tsx
│   │   └── types/index.ts
│   ├── cv-parser/
│   │   ├── components/
│   │   │   ├── UploadZone.tsx
│   │   │   ├── FieldChips.tsx
│   │   │   └── ParsedResultCard.tsx
│   │   ├── containers/
│   │   │   └── CvParserContainer.tsx
│   │   └── types/index.ts
│   ├── jd-writer/
│   │   ├── components/JdForm.tsx
│   │   ├── containers/JdWriterContainer.tsx
│   │   └── types/index.ts
│   ├── email-writer/
│   │   ├── components/EmailForm.tsx
│   │   ├── containers/EmailWriterContainer.tsx
│   │   └── types/index.ts
│   ├── cv-eval/
│   │   ├── components/CvEvalForm.tsx
│   │   ├── containers/CvEvalContainer.tsx
│   │   └── types/index.ts
│   ├── candidate-summary/
│   │   ├── components/SummaryForm.tsx
│   │   ├── containers/SummaryContainer.tsx
│   │   └── types/index.ts
│   └── salary-benchmark/
│       ├── components/SalaryForm.tsx
│       ├── containers/SalaryContainer.tsx
│       └── types/index.ts
├── hooks/
│   └── useClaudeApi.ts               # Shared hook wrapping /api/claude
├── lib/
│   ├── prompts.ts                    # All AI prompt builders
│   ├── formatText.ts                 # Markdown → HTML renderer
│   └── localStorage.ts              # Type-safe localStorage helpers
├── services/
│   └── claude.ts                    # fetch wrapper for /api/claude
├── stores/
│   ├── apiKeyStore.ts               # API key + validation state
│   ├── toolStore.ts                 # Active tool navigation
│   ├── chatStore.ts                 # Chat message history
│   └── settingsStore.ts             # Business context per tool
└── types/
    └── index.ts                     # Shared types (Tool, Message, etc.)
```

---

## Design Token Mapping (HTML → Tailwind)

The app uses **shadcn `@ss-themes/modern-minimal`** for base UI. TA Assistant–specific tokens are added in `tailwind.config.ts`:

| CSS Var (HTML) | Hex | Tailwind Key |
|----------------|-----|--------------|
| `--bg` | `#f7f4ef` | `bg-canvas` |
| `--bg2` | `#eee9e0` | `bg-canvas-2` |
| `--surface` | `#ffffff` | `bg-surface` |
| `--border` | `#e0d8cc` | `border-default` |
| `--border2` | `#cec4b4` | `border-strong` |
| `--ink` | `#1a1714` | `text-ink` |
| `--ink2` | `#6b6458` | `text-ink-2` |
| `--ink3` | `#a09890` | `text-ink-3` |
| `--accent` | `#c4673a` | `accent` |
| `--accent2` | `#2d6a4f` | `accent-2` |
| `--accent3` | `#4a6fa5` | `accent-3` |
| `--amber` | `#d4a017` | `amber` |

**Theme:** `pnpm dlx shadcn@latest add @ss-themes/modern-minimal` — see PLAN-01 Step 5 for full CSS variables.  
**Fonts:** `Fraunces` (serif headings), `Epilogue` (body), `DM Mono` (mono) — loaded via `next/font/google`. Override `--font-sans`, `--font-serif`, `--font-mono` in `:root` if using these instead of Geist/JetBrains.

---

## localStorage Keys (unchanged from HTML)

| Key | Purpose |
|-----|---------|
| `ta_api_key` | Anthropic API key |
| `ta_ctx_chat` | Business Context for AI Chat |
| `ta_ctx_jd` | Business Context for JD Writer |
| `ta_ctx_email` | Business Context for Email Writer |
| `ta_ctx_eval` | Business Context for CV Eval |
| `ta_ctx_summary` | Business Context for Candidate Summary |
| `ta_ctx_salary` | Business Context for Salary Benchmark |

---

## MVP Acceptance Criteria

- [ ] 3-column layout renders correctly at desktop (>720px)
- [ ] Sidebar navigation switches tools in Column 2
- [ ] AI Chat Panel (Column 3) persists across tool switches
- [ ] API key saved to localStorage; status dot updates live
- [ ] All 6 run buttons disabled until valid API key present
- [ ] All 6 tools generate AI output and display it
- [ ] CV Parser handles PDF + image upload, renders parsed cards
- [ ] Copy to clipboard works on all output areas
- [ ] Toast notifications appear and auto-dismiss at 3s
- [ ] Settings panel saves Business Context to localStorage
- [ ] Vercel deployment builds without errors (`next build`)
