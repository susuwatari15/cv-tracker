# PLAN-06 — Settings Panel

**Depends on:** PLAN-02, PLAN-03, PLAN-05  
**Output:** Settings tool view with API key management and Business Context configuration

---

## What to Build

A tool panel (shown in Column 2 when user clicks Settings in sidebar) with:
1. **API Configuration section** — API key input synced with sidebar
2. **Business Context section** — one textarea per tool with labels/placeholders
3. **Save Settings button** — writes all values to localStorage + shows toast

---

## Files to Create

### `src/features/settings/types/index.ts`

```ts
import type { ContextKey } from '@/stores/settingsStore'

export interface BusinessContextField {
  key: ContextKey
  label: string
  placeholder: string
}

export const BUSINESS_CONTEXT_FIELDS: BusinessContextField[] = [
  {
    key: 'ta_ctx_chat',
    label: 'Trợ lý AI',
    placeholder: 'VD: Hue Nguyen, TA Manager at Masan Group...',
  },
  {
    key: 'ta_ctx_jd',
    label: 'Soạn JD',
    placeholder: 'VD: Company: Masan Group. Tone: semi-formal, tech-savvy...',
  },
  {
    key: 'ta_ctx_email',
    label: 'Viết Email UV',
    placeholder: 'VD: Sender: Hue Nguyen, TA Manager, Masan Group...',
  },
  {
    key: 'ta_ctx_eval',
    label: 'Đánh giá CV vs JD',
    placeholder: 'VD: Focus on tech roles. Provide fit score, strengths, gaps...',
  },
  {
    key: 'ta_ctx_summary',
    label: 'Tóm tắt Candidate',
    placeholder: 'VD: Summary audience: CTO or Tech Director. ~150-200 words...',
  },
  {
    key: 'ta_ctx_salary',
    label: 'Salary Benchmark',
    placeholder: 'VD: Market: Vietnam tech sector, 2024-2025. TP.HCM...',
  },
]
```

---

### `src/features/settings/components/ApiKeyField.tsx`

Presentational component — just the API key input row for the settings panel.

Props:
```ts
interface ApiKeyFieldProps {
  value: string
  status: 'empty' | 'valid' | 'invalid'
  onChange: (value: string) => void
}
```

Renders an Input (shadcn) with `type="password"` and a `ApiStatusDot` inline.

---

### `src/features/settings/components/BusinessContextForm.tsx`

Presentational. Renders all 6 context textareas.

```ts
interface BusinessContextFormProps {
  values: Record<ContextKey, string>
  onChange: (key: ContextKey, value: string) => void
}
```

Uses `react-hook-form` + `zod` schema:

```ts
import { z } from 'zod'

const schema = z.object({
  ta_ctx_chat: z.string(),
  ta_ctx_jd: z.string(),
  ta_ctx_email: z.string(),
  ta_ctx_eval: z.string(),
  ta_ctx_summary: z.string(),
  ta_ctx_salary: z.string(),
})

type SettingsFormValues = z.infer<typeof schema>
```

For each field in `BUSINESS_CONTEXT_FIELDS`, render:
```tsx
<FieldGroup label={field.label}>
  <Textarea
    {...register(field.key)}
    placeholder={field.placeholder}
    className="min-h-[80px] resize-y"
  />
</FieldGroup>
```

---

### `src/features/settings/containers/SettingsContainer.tsx`

**Client component.** Business logic layer.

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApiKeyStore } from '@/stores/apiKeyStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { toast } from 'sonner'
// ... imports

export default function SettingsContainer() {
  const { key, status, setKey } = useApiKeyStore()
  const { contexts, setContext, saveAll } = useSettingsStore()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: contexts,
  })

  const onSubmit = (data: SettingsFormValues) => {
    Object.entries(data).forEach(([k, v]) =>
      setContext(k as ContextKey, v as string)
    )
    saveAll()
    toast.success('✓ Settings đã được lưu!')
  }

  return (
    <div className="max-w-2xl">
      <FormSection title="API Configuration" icon="🔑">
        <ApiKeyField value={key} status={status} onChange={setKey} />
        <p className="text-xs font-mono text-ink-3 mt-2">
          Key được lưu trong localStorage. Không bao giờ gửi đến server của chúng tôi.
        </p>
      </FormSection>

      <FormSection title="Business Context per Tool" icon="📋">
        <p className="text-[12px] text-ink-2 mb-4">
          Context này được thêm vào system prompt của từng công cụ. Giữ ngắn gọn (dưới 300 từ mỗi tool).
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <BusinessContextForm
            register={form.register}
            fields={BUSINESS_CONTEXT_FIELDS}
          />
          <button type="submit" className="...run-btn styles...">
            💾 Lưu Settings
          </button>
        </form>
      </FormSection>
    </div>
  )
}
```

---

## BRD Requirements Covered

| ID | Requirement | Covered |
|----|-------------|:-------:|
| SET-01 | API key editable password field in Settings | ✅ |
| SET-02 | API key synced between sidebar and Settings | ✅ |
| SET-03 | Key validation status updates in real time | ✅ |
| SET-04 | Key saved to `ta_api_key` in localStorage | ✅ |
| SET-05 | Business Context textarea per tool | ✅ |
| SET-06 | Descriptive labels and placeholders | ✅ |
| SET-07 | Context persisted independently per tool key | ✅ |
| SET-08 | Context loaded on page load | ✅ |
| SET-09 | Context appended to AI prompt at call time | ✅ (in PLAN-04) |
| SET-10 | User can clear any context field | ✅ (manual clear) |
| SET-11 | Save button triggers success toast | ✅ |
| SET-12 | Sections: API Configuration + Business Context | ✅ |

---

## Verification Checklist

- [ ] API key typed in Settings updates the sidebar dot
- [ ] API key typed in Sidebar updates the Settings input
- [ ] Saving in Settings writes all values to localStorage (verify via DevTools)
- [ ] Success toast appears after save
- [ ] Reloading page restores saved context values in the form
- [ ] Each context textarea has correct placeholder text
