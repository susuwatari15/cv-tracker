# PLAN-05 — Shared Components

**Depends on:** PLAN-01, PLAN-02  
**Output:** Reusable UI primitives used by all tool features

---

## Components to Build

### 1. `src/lib/formatText.ts`

Port the `formatText()` function from the HTML. Converts markdown-ish text to HTML string.

```ts
export function formatText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(
      /^### (.*)/gm,
      '<h4 style="font-family:var(--font-fraunces),serif;font-size:14px;margin:12px 0 6px;color:#c4673a">$1</h4>'
    )
    .replace(
      /^## (.*)/gm,
      '<h3 style="font-family:var(--font-fraunces),serif;font-size:15px;margin:14px 0 8px">$1</h3>'
    )
    .replace(/^- (.*)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, (m) => `<ul>${m}</ul>`)
    .split('\n\n')
    .map((p) => (p.trim() ? `<p>${p.replace(/\n/g, '<br>')}</p>` : ''))
    .join('')
}
```

---

### 2. `src/components/shared/OutputBox.tsx`

Animated output display area. Shown/hidden based on `show` prop. Renders `dangerouslySetInnerHTML` for formatted AI output.

Props:
```ts
interface OutputBoxProps {
  show: boolean
  html: string
  actions: React.ReactNode  // copy/clear/download buttons
}
```

Animation: CSS class `animate-fade-up` (define in `globals.css`):
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-up { animation: fadeUp 0.35s ease; }
```

Example:
```tsx
if (!show) return null

return (
  <div className="animate-fade-up bg-canvas-2 border border-border-default rounded-[14px] p-5 mt-4 text-[13.5px] leading-[1.7] text-ink">
    <div dangerouslySetInnerHTML={{ __html: html }} />
    <div className="flex gap-2 mt-3 pt-3 border-t border-border-default">
      {actions}
    </div>
  </div>
)
```

---

### 3. `src/components/shared/RunButton.tsx`

Unified action button used at the bottom of every tool form.

Props:
```ts
interface RunButtonProps {
  isLoading: boolean
  disabled: boolean
  label: string
  loadingLabel?: string
  onClick: () => void
}
```

When `isLoading`: shows spinner text `⏳ Đang xử lý...`  
When `disabled` (no valid API key): opacity 40%, `cursor-not-allowed`

```tsx
<button
  onClick={onClick}
  disabled={disabled || isLoading}
  className="w-full flex items-center justify-center gap-2 px-7 py-[13px] bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-[8px] transition-all font-epilogue"
>
  {isLoading ? `⏳ ${loadingLabel ?? 'Đang xử lý...'}` : `✦ ${label}`}
</button>
```

---

### 4. `src/components/shared/CopyButton.tsx`

Small utility button that copies text and shows a success toast.

Props:
```ts
interface CopyButtonProps {
  getText: () => string
  label?: string
}
```

```tsx
'use client'

import { toast } from 'sonner'

export default function CopyButton({ getText, label = 'Copy' }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(getText()).then(() => {
      toast.success('✓ Đã copy!')
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1.5 rounded-[8px] text-xs font-mono border border-border-strong text-ink-2 bg-surface hover:border-accent-2 hover:text-accent-2 transition-all"
    >
      📋 {label}
    </button>
  )
}
```

---

### 5. `src/components/shared/FormSection.tsx`

White card wrapper for form groups — matches `.form-section` in the HTML.

Props:
```ts
interface FormSectionProps {
  title: string
  icon?: string
  children: React.ReactNode
}
```

```tsx
<div className="bg-surface border border-border-default rounded-[14px] p-6 mb-4 shadow-sm">
  <h3 className="font-fraunces text-[15px] font-semibold mb-4 text-ink flex items-center gap-2">
    {icon && <span>{icon}</span>}
    {title}
  </h3>
  {children}
</div>
```

---

### 6. `src/components/shared/FieldGroup.tsx`

Label + input wrapper. Used in all forms.

Props:
```ts
interface FieldGroupProps {
  label: string
  required?: boolean
  children: React.ReactNode
}
```

```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-[11px] font-mono text-ink-3 uppercase tracking-[0.8px]">
    {label}{required && ' *'}
  </label>
  {children}
</div>
```

---

### 7. `src/components/shared/ApiStatusDot.tsx`

Colored dot indicating API key validity.

Props:
```ts
interface ApiStatusDotProps {
  status: 'empty' | 'valid' | 'invalid'
}
```

```tsx
const colorMap = {
  empty: 'bg-white/20',
  valid: 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]',
  invalid: 'bg-red-400',
}

return <div className={`w-[7px] h-[7px] rounded-full shrink-0 transition-all ${colorMap[status]}`} />
```

---

### 8. `src/lib/localStorage.ts`

Type-safe localStorage helpers that handle SSR gracefully (no `window` errors).

```ts
export function getStorageItem(key: string): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(key) ?? ''
}

export function setStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return
  if (value) localStorage.setItem(key, value)
  else localStorage.removeItem(key)
}
```

---

## Verification Checklist

- [ ] `formatText` converts `**bold**` to `<strong>bold</strong>`
- [ ] `formatText` renders `- item` as `<ul><li>item</li></ul>`
- [ ] `OutputBox` animates in when `show` changes from false to true
- [ ] `RunButton` shows loading text during API call
- [ ] `RunButton` is disabled when API key is invalid
- [ ] `CopyButton` writes to clipboard and shows success toast
- [ ] `FormSection` renders with correct card styling
- [ ] `ApiStatusDot` shows correct color for each status
