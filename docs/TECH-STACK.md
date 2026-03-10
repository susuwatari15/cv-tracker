# TA Assistant — Tech Stack

**Document Version:** 1.0  
**Date:** March 2026  
**Target:** Vercel deployment

---

## 1. Overview

use pnpm cli

| Layer              | Technology                               |
| ------------------ | ---------------------------------------- |
| **Framework**      | Next.js 15 (App Router)                  |
| **Language**       | TypeScript                               |
| **Styling**        | Tailwind CSS                             |
| **UI Components**  | shadcn/ui                                |
| **Forms**          | react-hook-form + zod                    |
| **State**          | Zustand                                  |
| **Date utilities** | date-fns                                 |
| **API**            | Next.js Route Handlers (Anthropic proxy) |

---

## 2. Core Technologies

### 2.1 Next.js 15 (App Router)

- **Why:** Vercel-native, server components, built-in API routes, optimal DX for deployment
- **App Router:** Use `app/` directory structure with layouts and route groups
- **Route Handlers:** Proxy Anthropic API calls server-side to keep API key secure

### 2.2 TypeScript

- Strict mode enabled
- Prefer interfaces for object shapes
- Colocate types in `features/[feature]/types/` or `src/types/`

### 2.3 Tailwind CSS

- Mobile-first responsive design using `sm:`, `md:`, `lg:` prefixes
- Design tokens via CSS variables where needed
- No inline styles; use Tailwind utility classes

### 2.4 shadcn/ui

- **Why:** Copy-paste components, Tailwind-based, full control, no runtime bundle bloat
- **Usage:** Install components via CLI; customize in `components/ui/`
- **Loading states:** Use Skeleton components from shadcn/ui
- **No antd:** Do not use Ant Design

### 2.5 Forms: react-hook-form + zod

- All forms use `react-hook-form` for state and validation
- Schemas defined with `zod`; pass to `@hookform/resolvers/zod`
- No uncontrolled form state

### 2.6 State: Zustand

- Global/shared state in `stores/`
- Feature-local state in containers or hooks
- Prefer derived state over storing redundant data

### 2.7 Date utilities: date-fns

- Use `date-fns` for parsing, formatting, and date arithmetic
- No `moment` or `dayjs`

---

## 3. Exclusions

| Do not use                            | Reason                                                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **i18n**                              | No internationalization. Use plain strings in app language (Vietnamese primary, English for tech terms). |
| **Ant Design**                        | Replaced by shadcn/ui.                                                                                   |
| **useMemo / useCallback / useEffect** | Per project rules; prefer composition and derived state.                                                 |
| **moment / dayjs**                    | Use date-fns.                                                                                            |

---

## 4. Architecture

### 4.1 Container / Presentational Pattern

- **Containers:** `features/[feature]/containers/` — state, data fetching, business logic
- **Presentational:** `features/[feature]/components/` or `components/ui/` — pure rendering, props only
- **Hooks:** `hooks/` or `features/[feature]/hooks/` — reusable logic

### 4.2 Dependency Direction

```
hooks ← services
containers ← hooks + presentational
presentational ← props only
```

### 4.3 File Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       └── claude/route.ts    # Anthropic API proxy
├── components/
│   ├── ui/                    # shadcn primitives
│   └── shared/                # Layout, Header, etc.
├── features/
│   └── [feature]/
│       ├── components/
│       ├── containers/
│       ├── hooks/
│       ├── types/
│       └── index.tsx
├── hooks/
├── lib/
├── services/
├── stores/
└── types/
```

---

## 5. Deployment (Vercel)

- **Platform:** Vercel
- **Build:** `next build`
- **Environment:** `ANTHROPIC_API_KEY` in Vercel env vars (server-side only)
- **Static assets:** Served via Next.js; no separate CDN config needed

---

## 6. API Integration

- **Anthropic Claude:** Calls proxied through `app/api/claude/route.ts`
- **Client:** Sends requests to `/api/claude`; server adds API key and forwards to Anthropic
- **Settings:** API key input in UI for dev/preview; production uses server env var
