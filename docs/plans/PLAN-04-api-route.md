# PLAN-04 — API Route (Anthropic Proxy)

**Depends on:** PLAN-01  
**Output:** `/api/claude` route handler that proxies requests to Anthropic server-side

---

## Why a Proxy

The HTML calls Anthropic directly from the browser (key visible in DevTools).  
The new app proxies all calls through a Next.js Route Handler so the API key is **server-side only** in production.  
In dev/preview, if `ANTHROPIC_API_KEY` env var is empty, the route falls back to the key sent in the request header.

---

## File to Create

### `src/app/api/claude/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Use server env var in production; fall back to client-supplied key for dev
  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    req.headers.get('x-client-api-key') ||
    ''

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 401 })
  }

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error?.message ?? 'Anthropic API error' },
      { status: res.status }
    )
  }

  return NextResponse.json(data)
}
```

**Key points:**
- `ANTHROPIC_API_KEY` env var → production (Vercel)
- `x-client-api-key` header → dev fallback (user enters key in UI)
- Returns the full Anthropic response as-is (client parses it)
- Only supports `POST` (no `GET` handler needed)

---

## Client Service

### `src/services/claude.ts`

Wraps the fetch to `/api/claude`. Used by `useClaudeApi` hook.

```ts
import type { ClaudeRequest, ClaudeResponse } from '@/types'
import { useApiKeyStore } from '@/stores/apiKeyStore'

export interface ClaudeCallOptions {
  messages: { role: 'user' | 'assistant'; content: string | object[] }[]
  system?: string
  maxTokens?: number
  model?: string
}

export async function callClaude(options: ClaudeCallOptions): Promise<string> {
  const apiKey = useApiKeyStore.getState().getKey()

  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'x-client-api-key': apiKey } : {}),
    },
    body: JSON.stringify({
      model: options.model ?? 'claude-sonnet-4-20250514',
      max_tokens: options.maxTokens ?? 2000,
      system: options.system,
      messages: options.messages,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error ?? 'API error')
  }

  return data.content
    .map((b: { type: string; text?: string }) => b.text ?? '')
    .join('')
    .trim()
}
```

---

## Hook — `src/hooks/useClaudeApi.ts`

Shared hook used by all tool containers and the chat panel.

```ts
'use client'

import { useState } from 'react'
import { callClaude, ClaudeCallOptions } from '@/services/claude'
import { toast } from 'sonner'

interface UseClaudeApiReturn {
  isLoading: boolean
  call: (options: ClaudeCallOptions) => Promise<string | null>
}

export function useClaudeApi(): UseClaudeApiReturn {
  const [isLoading, setIsLoading] = useState(false)

  const call = async (options: ClaudeCallOptions): Promise<string | null> => {
    setIsLoading(true)
    try {
      return await callClaude(options)
    } catch (err) {
      toast.error('Lỗi: ' + (err instanceof Error ? err.message : 'Unknown error'))
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, call }
}
```

**Usage in a container:**

```ts
const { isLoading, call } = useClaudeApi()

const handleSubmit = async (data: FormValues) => {
  const result = await call({
    messages: [{ role: 'user', content: buildPrompt(data) }],
    system: SYSTEM_PROMPT + '\n\n' + settingsStore.getContext('ta_ctx_jd'),
    maxTokens: 2000,
  })
  if (result) setOutput(result)
}
```

---

## System Prompt — `src/lib/prompts.ts`

Extract the static system prompt from the HTML:

```ts
export const BASE_SYSTEM_PROMPT = `Bạn là trợ lý TA cá nhân của Hue Nguyen — TA Manager chuyên Tech Hiring tại Masan Group, TP.HCM, Việt Nam.

Hồ sơ người dùng:
- Tên: Hue Nguyen (chị Hue)
- Role: Talent Acquisition Manager — Technology Transformation
- Công ty: Masan Group (tập đoàn lớn, nhiều entity: Masan Tech, Masan Consumer, etc.)
- Chuyên môn: Tuyển dụng tech roles (Data, Software Engineering, Cloud/Infra, Security, ERP)
- Kinh nghiệm: 10+ năm TA, đã làm tại VNG Corporation 10 năm
- Phong cách làm việc: IC, hands-on, data-driven

Nguyên tắc hoạt động:
1. Ngôn ngữ: Trả lời bằng Tiếng Việt, tự nhiên và thân thiện
2. Tone: Semi-formal — chuyên nghiệp nhưng gần gũi, như đồng nghiệp thân thiết
3. Output: Tùy từng việc — ngắn gọn khi cần thông tin nhanh, chi tiết khi soạn nội dung
4. Bảo mật: Không lưu, không chia sẻ thông tin ứng viên hay nội dung công việc ra bên ngoài
5. Chính xác: Khi không chắc (đặc biệt salary data), nêu rõ là ước tính dựa trên market knowledge đến 2025
6. Luôn nhớ context: Hue đang tuyển tech roles cho Masan Group — tech market HCM/VN

Khi soạn JD: Dùng format chuẩn, tech-savvy, hấp dẫn với developer/engineer. Không quá corporate cứng nhắc.
Khi viết email: Semi-formal, cá nhân hóa, không template cứng.
Khi đánh giá CV: Khách quan, nêu rõ điểm mạnh/yếu, fit score, câu hỏi nên hỏi thêm.
Khi tóm tắt candidate: Súc tích, highlight key points cho hiring manager bận rộn.
Khi tư vấn salary: Dựa trên market VN 2024-2025, TP.HCM, tech sector.`

export function buildSystemPrompt(businessContext?: string): string {
  if (!businessContext?.trim()) return BASE_SYSTEM_PROMPT
  return `${BASE_SYSTEM_PROMPT}\n\n---\nBusiness Context:\n${businessContext}`
}
```

All tool prompt builders (for JD, Email, etc.) will also live in this file — added in each tool's plan.

---

## Verification Checklist

- [ ] `POST /api/claude` with valid API key in header returns a 200
- [ ] `POST /api/claude` without API key returns 401
- [ ] `callClaude()` service function resolves to text string
- [ ] `useClaudeApi` hook sets `isLoading` correctly during call
- [ ] Errors surface as `toast.error` notifications
- [ ] `buildSystemPrompt` with context appends correctly
