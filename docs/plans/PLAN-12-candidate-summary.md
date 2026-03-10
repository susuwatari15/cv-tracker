# PLAN-12 — Candidate Summary Tool (Tóm tắt Candidate)

**Depends on:** PLAN-02, PLAN-03, PLAN-04, PLAN-05  
**Output:** Candidate Summary tool — generate concise executive-friendly candidate brief

---

## What to Build

Mirrors HTML's `#tool-summary` section.

Inputs:
- Target position (optional)
- Candidate info / CV (required, tall textarea)
- Interview round results and feedback (optional textarea)

Output: ~150–200 word bullet-point summary for CTO / Tech Director.

---

## Files to Create

### `src/features/candidate-summary/types/index.ts`

```ts
import { z } from 'zod'

export const summaryFormSchema = z.object({
  position: z.string(),
  cv: z.string().min(1, 'Nhập thông tin ứng viên trước nhé!'),
  interviewResult: z.string(),
})

export type SummaryFormValues = z.infer<typeof summaryFormSchema>
```

---

### `src/features/candidate-summary/components/SummaryForm.tsx`

Presentational. Three stacked fields.

```tsx
<FormSection title="Tóm tắt Candidate cho Hiring Manager" icon="📋">
  <div className="flex flex-col gap-3.5">
    <FieldGroup label="Vị trí đang tuyển">
      <Input
        {...form.register('position')}
        placeholder="VD: Senior Data Engineer, Masan Tech"
      />
    </FieldGroup>

    <FieldGroup label="Thông tin ứng viên" required>
      <Textarea
        {...form.register('cv')}
        placeholder="Paste CV hoặc ghi tóm tắt: tên, kinh nghiệm, skills, điểm mạnh/yếu, kết quả phỏng vấn..."
        className="min-h-[120px]"
      />
      {/* error */}
    </FieldGroup>

    <FieldGroup label="Kết quả các vòng PV (nếu có)">
      <Textarea
        {...form.register('interviewResult')}
        placeholder="VD: Round 1 Technical - Passed. Feedback: Strong in Spark, weak in system design..."
        rows={3}
      />
    </FieldGroup>
  </div>
</FormSection>
```

---

### Prompt builder — add to `src/lib/prompts.ts`

```ts
export function buildSummaryPrompt(data: SummaryFormValues): string {
  return `Tóm tắt profile ứng viên cho hiring manager.

${data.position ? 'Vị trí: ' + data.position : ''}
Thông tin CV:
${data.cv}
${data.interviewResult ? 'Kết quả phỏng vấn: ' + data.interviewResult : ''}

Viết tóm tắt ngắn gọn (~150-200 từ) dành cho CTO/Tech Director đang bận:
- Một câu tổng quan về candidate
- Background & kinh nghiệm nổi bật
- Skills match với vị trí
- Điểm cần lưu ý
- Kết quả PV (nếu có)
- Đề xuất next step
Format: súc tích, bullet points, dễ scan nhanh`
}
```

---

### `src/features/candidate-summary/containers/SummaryContainer.tsx`

**Client component.** Same pattern as other containers.

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApiKeyStore } from '@/stores/apiKeyStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useClaudeApi } from '@/hooks/useClaudeApi'
import { buildSystemPrompt, buildSummaryPrompt } from '@/lib/prompts'
import { formatText } from '@/lib/formatText'
import { summaryFormSchema, SummaryFormValues } from '../types'

export default function SummaryContainer() {
  const [output, setOutput] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  const { status } = useApiKeyStore()
  const { getContext } = useSettingsStore()
  const { isLoading, call } = useClaudeApi()

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summaryFormSchema),
    defaultValues: { position: '', cv: '', interviewResult: '' },
  })

  const handleSubmit = async (data: SummaryFormValues) => {
    setShowOutput(false)
    const result = await call({
      messages: [{ role: 'user', content: buildSummaryPrompt(data) }],
      system: buildSystemPrompt(getContext('ta_ctx_summary')),
      maxTokens: 2000,
    })
    if (result) {
      setOutput(result)
      setShowOutput(true)
    }
  }

  return (
    <div className="max-w-[720px]">
      <SummaryForm form={form} onSubmit={handleSubmit} />
      <RunButton
        isLoading={isLoading}
        disabled={status !== 'valid'}
        label="Tóm tắt ngay"
        onClick={form.handleSubmit(handleSubmit)}
      />
      <OutputBox
        show={showOutput}
        html={formatText(output)}
        actions={
          <>
            <CopyButton getText={() => output} />
            <button onClick={() => setShowOutput(false)} className="...">✕ Xóa</button>
          </>
        }
      />
    </div>
  )
}
```

---

## BRD Requirements Covered

| ID | Requirement | Covered |
|----|-------------|:-------:|
| SUM-01 | Target position (optional) + candidate info (required) | ✅ |
| SUM-02 | Optional interview results | ✅ |
| SUM-03 | ~150–200 word summary for CTO / Tech Director | ✅ (in prompt) |
| SUM-04 | Sections: snapshot, background, skills, notes, PV results, next step | ✅ (in prompt) |
| SUM-05 | Bullet point, scannable format | ✅ (in prompt) |
| SUM-06 | Copyable output | ✅ |

---

## Verification Checklist

- [ ] Submitting without CV content shows validation error
- [ ] Position field is optional (no error when empty)
- [ ] Output is ~150–200 words in bullet point format
- [ ] Interview results section only appears in output when filled
- [ ] Copy and clear work correctly
