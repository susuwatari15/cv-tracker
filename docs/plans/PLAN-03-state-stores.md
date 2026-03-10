# PLAN-03 — State Stores (Zustand)

**Depends on:** PLAN-01  
**Output:** 4 Zustand stores that all components will read/write

---

## Overview

All state lives in `src/stores/`. No `useEffect` for syncing — use Zustand's `subscribe` or direct reads.  
localStorage is accessed directly in store actions (not in React components).

---

## Store 1 — `src/stores/apiKeyStore.ts`

Manages the Anthropic API key and its validation state.

```ts
import { create } from 'zustand'

type ApiKeyStatus = 'empty' | 'valid' | 'invalid'

interface ApiKeyStore {
  key: string
  status: ApiKeyStatus
  setKey: (key: string) => void
  getKey: () => string
}

const validate = (k: string): ApiKeyStatus => {
  if (!k) return 'empty'
  return k.startsWith('sk-ant-') ? 'valid' : 'invalid'
}

export const useApiKeyStore = create<ApiKeyStore>((set, get) => ({
  key: '',
  status: 'empty',

  setKey: (key: string) => {
    const trimmed = key.trim()
    if (trimmed) localStorage.setItem('ta_api_key', trimmed)
    else localStorage.removeItem('ta_api_key')
    set({ key: trimmed, status: validate(trimmed) })
  },

  getKey: () => get().key,
}))

// Initialize from localStorage (call this once in AppShell or a provider)
export function initApiKeyStore() {
  const saved = localStorage.getItem('ta_api_key') ?? ''
  useApiKeyStore.getState().setKey(saved)
}
```

**Used by:**
- `Sidebar` — renders the API key input + dot indicator
- `ApiKeyField` in Settings — second editable field (synced)
- All tool containers — `status === 'valid'` gates the run buttons
- `useClaudeApi` hook — reads key for API calls

---

## Store 2 — `src/stores/toolStore.ts`

Tracks which tool is currently shown in Column 2.

```ts
import { create } from 'zustand'
import type { ToolId } from '@/types'

interface ToolStore {
  activeTool: ToolId
  setActiveTool: (id: ToolId) => void
}

export const useToolStore = create<ToolStore>((set) => ({
  activeTool: 'chat',
  setActiveTool: (id) => set({ activeTool: id }),
}))
```

**Used by:**
- `Sidebar` — highlights active nav item, calls `setActiveTool`
- `ContentArea` — reads `activeTool` to render the correct tool
- `ToolHeader` — reads `activeTool` to show title/description

---

## Store 3 — `src/stores/chatStore.ts`

Holds the full chat conversation history (in-memory, resets on page reload — per BRD constraint).

```ts
import { create } from 'zustand'
import type { ChatMessage } from '@/types'
import { nanoid } from 'nanoid'  // or crypto.randomUUID()

interface ChatStore {
  messages: ChatMessage[]
  isThinking: boolean
  addMessage: (role: 'user' | 'assistant', content: string) => ChatMessage
  setThinking: (v: boolean) => void
  clearMessages: () => void
  // Returns messages in Anthropic API format (role + content only)
  getApiMessages: () => { role: 'user' | 'assistant'; content: string }[]
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isThinking: false,

  addMessage: (role, content) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
    }
    set((s) => ({ messages: [...s.messages, msg] }))
    return msg
  },

  setThinking: (v) => set({ isThinking: v }),

  clearMessages: () => set({ messages: [] }),

  getApiMessages: () =>
    get().messages.map(({ role, content }) => ({ role, content })),
}))
```

**Used by:**
- `ChatContainer` — reads messages, dispatches addMessage, setThinking

---

## Store 4 — `src/stores/settingsStore.ts`

Persists Business Context for each tool, plus exposes the API key (delegated to apiKeyStore).

```ts
import { create } from 'zustand'

export type ContextKey =
  | 'ta_ctx_chat'
  | 'ta_ctx_jd'
  | 'ta_ctx_email'
  | 'ta_ctx_eval'
  | 'ta_ctx_summary'
  | 'ta_ctx_salary'

const DEFAULTS: Record<ContextKey, string> = {
  ta_ctx_chat: 'Hue Nguyen, TA Manager at Masan Group. Specializes in tech roles (Data, Software Engineering, Cloud, Security, ERP). Vietnam market, TP.HCM. 10+ years TA experience.',
  ta_ctx_jd: 'Company: Masan Group — a large conglomerate with entities including Masan Tech, Masan Consumer. Tone: semi-formal, tech-savvy, attractive to engineers. Language: Vietnamese with English tech terms.',
  ta_ctx_email: 'Sender: Hue Nguyen, TA Manager, Masan Group. Tone: semi-formal, warm, personalized. Not a generic template.',
  ta_ctx_eval: 'Focus on tech roles. Provide objective, structured evaluation with fit score, strengths, gaps, and suggested interview questions.',
  ta_ctx_summary: 'Summary audience: CTO or Tech Director. Keep to ~150–200 words. Bullet point format. Scannable.',
  ta_ctx_salary: 'Market: Vietnam tech sector, 2024–2025. Primary location: TP.HCM. Include product company vs outsourcing vs startup comparison.',
}

interface SettingsStore {
  contexts: Record<ContextKey, string>
  setContext: (key: ContextKey, value: string) => void
  getContext: (key: ContextKey) => string
  saveAll: () => void
  loadFromStorage: () => void
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  contexts: { ...DEFAULTS },

  setContext: (key, value) => {
    set((s) => ({ contexts: { ...s.contexts, [key]: value } }))
  },

  getContext: (key) => get().contexts[key] ?? DEFAULTS[key],

  saveAll: () => {
    const { contexts } = get()
    Object.entries(contexts).forEach(([k, v]) => localStorage.setItem(k, v))
  },

  loadFromStorage: () => {
    const loaded = Object.fromEntries(
      Object.keys(DEFAULTS).map((k) => [
        k,
        localStorage.getItem(k) ?? DEFAULTS[k as ContextKey],
      ])
    ) as Record<ContextKey, string>
    set({ contexts: loaded })
  },
}))
```

**Used by:**
- `SettingsContainer` — renders form, calls setContext and saveAll
- `useClaudeApi` — reads context per tool to append to system prompt
- Tool containers — pass context key when calling Claude

---

## Store Initialization

Create `src/lib/initStores.ts`:

```ts
import { initApiKeyStore } from '@/stores/apiKeyStore'
import { useSettingsStore } from '@/stores/settingsStore'

export function initStores() {
  initApiKeyStore()
  useSettingsStore.getState().loadFromStorage()
}
```

Call `initStores()` inside `AppShell` on mount using a one-time pattern — since we cannot use `useEffect`, use a module-level flag:

```ts
// In AppShell.tsx — runs once when module loads on client
if (typeof window !== 'undefined') {
  initStores()
}
```

Or use a `StoreInitializer` client component that calls `initStores()` synchronously in the render phase:

```tsx
// src/components/shared/StoreInitializer.tsx
'use client'
import { initStores } from '@/lib/initStores'

let initialized = false

export default function StoreInitializer() {
  if (!initialized && typeof window !== 'undefined') {
    initStores()
    initialized = true
  }
  return null
}
```

Then render `<StoreInitializer />` inside `AppShell`.

---

## Verification Checklist

- [ ] Typing in API key field updates dot color (gray → green → red)
- [ ] API key persists after page reload
- [ ] Switching nav items updates `activeTool` in toolStore
- [ ] Business Context defaults load correctly on first visit
- [ ] Business Context custom values persist after page reload
- [ ] No `useEffect` used in any store or consumer
