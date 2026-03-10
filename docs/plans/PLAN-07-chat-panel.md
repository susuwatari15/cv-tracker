# PLAN-07 — AI Chat Panel (Column 3)

**Depends on:** PLAN-02, PLAN-03, PLAN-04, PLAN-05  
**Output:** Permanent AI Chat panel in Column 3, fully functional

---

## What to Build

The chat panel is **always visible** in Column 3 regardless of active tool.  
It maintains full session history. Mirrors the HTML's `.chat-wrap` behavior.

Structure:
1. Panel header ("Trợ lý AI" title + description)
2. Message list (scrollable, grows upward)
3. Thinking indicator (3 bouncing dots)
4. Quick prompt chips
5. Auto-resizing textarea + Send button

---

## Files to Create

### `src/features/chat/types/index.ts`

```ts
export const QUICK_PROMPTS = [
  '📝 Soạn JD Data Engineer Senior',
  '📧 Email mời phỏng vấn',
  '💰 Salary range Cloud Architect HCM',
  '🔍 Candidate fit checklist cho ERP BA',
  '📋 Template reject email thân thiện',
] as const
```

---

### `src/features/chat/components/MessageBubble.tsx`

Presentational. Renders a single chat message.

Props:
```ts
interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string  // raw markdown text
}
```

- Assistant: white bubble, left-aligned, `✦` avatar in accent orange circle
- User: dark (`bg-ink`) bubble, right-aligned, `H` avatar in gradient circle
- Content rendered via `dangerouslySetInnerHTML` using `formatText(content)`
- Animate in: `animate-fade-up` CSS class

```tsx
<div className={`flex gap-3 animate-fade-up ${role === 'user' ? 'flex-row-reverse' : ''}`}>
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] shrink-0 mt-0.5 font-semibold text-white font-fraunces
    ${role === 'assistant' ? 'bg-accent' : 'bg-gradient-to-br from-accent to-amber'}`}>
    {role === 'assistant' ? '✦' : 'H'}
  </div>
  <div
    className={`max-w-[72%] px-[18px] py-[14px] text-[13.5px] leading-[1.65] rounded-2xl
      ${role === 'assistant'
        ? 'bg-surface border border-border-default rounded-tl-[4px] text-ink shadow-sm'
        : 'bg-ink text-[#f7f4ef] rounded-tr-[4px]'}`}
    dangerouslySetInnerHTML={{ __html: formatText(content) }}
  />
</div>
```

---

### `src/features/chat/components/ThinkingIndicator.tsx`

3 animated bouncing dots.

```tsx
<div className="flex gap-3 animate-fade-up">
  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-[13px] shrink-0 font-fraunces">
    ✦
  </div>
  <div className="flex items-center gap-[5px] px-[18px] py-[14px] bg-surface border border-border-default rounded-2xl rounded-tl-[4px]">
    {[0, 200, 400].map((delay) => (
      <span
        key={delay}
        className="w-[7px] h-[7px] rounded-full bg-ink-3 animate-blink"
        style={{ animationDelay: `${delay}ms` }}
      />
    ))}
  </div>
</div>
```

CSS for `animate-blink` in `globals.css`:
```css
@keyframes blink {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50%       { opacity: 1;   transform: scale(1);   }
}
.animate-blink { animation: blink 1.2s infinite; }
```

---

### `src/features/chat/components/MessageList.tsx`

Presentational. Renders the list of messages + optional thinking indicator.

Props:
```ts
interface MessageListProps {
  messages: ChatMessage[]
  isThinking: boolean
  listRef: React.RefObject<HTMLDivElement>
}
```

```tsx
<div ref={listRef} className="flex-1 overflow-y-auto pb-5 flex flex-col gap-5">
  {/* Welcome message (static) */}
  <MessageBubble role="assistant" content="Chào **Hue**! ..." />

  {messages.map((msg) => (
    <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
  ))}

  {isThinking && <ThinkingIndicator />}
</div>
```

---

### `src/features/chat/components/QuickPrompts.tsx`

Presentational. Row of clickable pill buttons.

Props:
```ts
interface QuickPromptsProps {
  onSelect: (text: string) => void
}
```

```tsx
<div className="flex flex-wrap gap-[7px] mb-3">
  {QUICK_PROMPTS.map((prompt) => (
    <button
      key={prompt}
      onClick={() => onSelect(prompt.replace(/^[^\s]+ /, ''))}
      className="px-[13px] py-[6px] rounded-full text-[11.5px] border border-border-strong text-ink-2 bg-surface hover:border-accent hover:text-accent hover:bg-accent/5 transition-all whitespace-nowrap font-epilogue"
    >
      {prompt}
    </button>
  ))}
</div>
```

---

### `src/features/chat/components/ChatInput.tsx`

Auto-resizing textarea + Send button.

Props:
```ts
interface ChatInputProps {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  disabled: boolean
}
```

Auto-resize: use a controlled textarea with `rows={1}` and handle resize in onChange by reading `scrollHeight`. Since `useEffect` is not allowed, resize by reading the DOM ref directly in the change handler:

```tsx
const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  onChange(e.target.value)
  // Auto-resize
  e.target.style.height = 'auto'
  e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
}

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    onSend()
  }
}
```

---

### `src/features/chat/containers/ChatContainer.tsx`

**Client component.** All business logic for the chat.

```tsx
'use client'

import { useState, useRef } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { useApiKeyStore } from '@/stores/apiKeyStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useClaudeApi } from '@/hooks/useClaudeApi'
import { buildSystemPrompt } from '@/lib/prompts'
// ... component imports

export default function ChatContainer() {
  const [inputValue, setInputValue] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  const { messages, isThinking, addMessage, setThinking, getApiMessages } = useChatStore()
  const { status } = useApiKeyStore()
  const { getContext } = useSettingsStore()
  const { call } = useClaudeApi()

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }

  const handleSend = async () => {
    const text = inputValue.trim()
    if (!text || status !== 'valid') return

    addMessage('user', text)
    setInputValue('')
    setThinking(true)
    scrollToBottom()

    const apiMessages = getApiMessages()
    const system = buildSystemPrompt(getContext('ta_ctx_chat'))

    const reply = await call({
      messages: apiMessages,
      system,
      maxTokens: 2000,
    })

    setThinking(false)
    if (reply) {
      addMessage('assistant', reply)
      scrollToBottom()
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-border-default shrink-0">
        <div className="font-fraunces text-[16px] font-semibold text-ink">Trợ lý AI</div>
        <div className="text-[11px] font-mono text-ink-3 mt-0.5">
          Chat tự do — hỏi bất cứ điều gì liên quan đến công việc TA
        </div>
      </div>

      {/* Message list */}
      <MessageList messages={messages} isThinking={isThinking} listRef={listRef} />

      {/* Input area */}
      <div className="px-4 pb-4 pt-3 border-t border-border-default shrink-0">
        <QuickPrompts onSelect={setInputValue} />
        <div className="flex gap-2.5 items-end">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            disabled={status !== 'valid'}
          />
          <button
            onClick={handleSend}
            disabled={status !== 'valid' || !inputValue.trim()}
            className="w-11 h-11 rounded-[12px] bg-accent hover:bg-accent-hover disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## BRD Requirements Covered

| ID | Requirement | Covered |
|----|-------------|:-------:|
| CHAT-01 | Permanent in Column 3, always visible | ✅ |
| CHAT-02 | Free-form text messages | ✅ |
| CHAT-03 | Responds in Vietnamese, semi-formal | ✅ |
| CHAT-04 | Maintains history across tool switches | ✅ (Zustand) |
| CHAT-05 | Contextualized as TA assistant for Hue | ✅ (system prompt) |
| CHAT-06 | Quick-prompt chips | ✅ |
| CHAT-07 | Enter sends, Shift+Enter newline | ✅ |
| CHAT-08 | Textarea auto-resizes | ✅ |
| CHAT-09 | Thinking animation | ✅ |
| CHAT-10 | Markdown rendering | ✅ (formatText) |

---

## Verification Checklist

- [ ] Chat panel visible at all times across tool switches
- [ ] Sending a message adds it to the list immediately
- [ ] Thinking indicator appears during API call
- [ ] Assistant response renders with markdown formatting
- [ ] Quick prompts fill the input on click
- [ ] Enter sends, Shift+Enter adds newline
- [ ] Chat history persists during session (survives tool switches)
- [ ] Input is disabled when API key is invalid
