# PLAN-11 — CV vs JD Evaluation Tool (Đánh giá CV vs JD)

**Depends on:** PLAN-02, PLAN-03, PLAN-04, PLAN-05  
**Output:** CV evaluation tool — paste JD + CV text, get structured fit analysis

---

## What to Build

Mirrors HTML's `#tool-cv-eval` section.

Inputs:
- JD summary / requirements (required, tall textarea)
- Candidate CV content (required, tall textarea)

Output: Structured evaluation with Fit Score, strengths, gaps, interview questions, recommendation.

---

## Files to Create

### `src/features/cv-eval/types/index.ts`

```ts
import { z } from 'zod'

export const cvEvalFormSchema = z.object({
  jd: z.string().min(1, 'Nhập tóm tắt JD trước nhé!'),
  cv: z.string().min(1, 'Nhập thông tin CV trước nhé!'),
})

export type CvEvalFormValues = z.infer<typeof cvEvalFormSchema>
```

---

### `src/features/cv-eval/components/CvEvalForm.tsx`

Presentational. Simple: two tall textareas stacked vertically.

```tsx
<FormSection title="Đánh giá CV fit với JD" icon="🔍">
  <div className="flex flex-col gap-3.5">
    <FieldGroup label="Tóm tắt JD / Yêu cầu vị trí" required>
      <Textarea
        {...form.register('jd')}
        placeholder="Paste JD hoặc tóm tắt yêu cầu: Level, skills bắt buộc, nice-to-have, kinh nghiệm..."
        className="min-h-[100px]"
      />
      {/* error */}
    </FieldGroup>

    <FieldGroup label="Thông tin CV / Hồ sơ ứng viên" required>
      <Textarea
        {...form.register('cv')}
        placeholder="Paste nội dung CV hoặc tóm tắt: tên, kinh nghiệm, skills, công ty cũ, học vấn..."
        className="min-h-[120px]"
      />
      {/* error */}
    </FieldGroup>
  </div>
</FormSection>
```

---

### Prompt builder — add to `src/lib/prompts.ts`

```ts
export function buildCvEvalPrompt(data: CvEvalFormValues): string {
  return `Đánh giá mức độ phù hợp của ứng viên với vị trí sau.

JD / Yêu cầu vị trí:
${data.jd}

Thông tin CV / Ứng viên:
${data.cv}

Hãy đánh giá theo format:
1. **Fit Score**: X/10 — kèm lý do ngắn gọn
2. **Điểm mạnh**: Top 3-4 điểm match tốt
3. **Điểm cần clarify**: Những gì còn thiếu hoặc chưa rõ
4. **Câu hỏi phỏng vấn gợi ý**: 3-5 câu nên hỏi để đánh giá kỹ hơn
5. **Khuyến nghị**: Nên move forward hay không, lý do`
}
```

---

### `src/features/cv-eval/containers/CvEvalContainer.tsx`

**Client component.** Same pattern as other tool containers.

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApiKeyStore } from '@/stores/apiKeyStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useClaudeApi } from '@/hooks/useClaudeApi'
import { buildSystemPrompt, buildCvEvalPrompt } from '@/lib/prompts'
import { formatText } from '@/lib/formatText'
import { cvEvalFormSchema, CvEvalFormValues } from '../types'

export default function CvEvalContainer() {
  const [output, setOutput] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  const { status } = useApiKeyStore()
  const { getContext } = useSettingsStore()
  const { isLoading, call } = useClaudeApi()

  const form = useForm<CvEvalFormValues>({
    resolver: zodResolver(cvEvalFormSchema),
    defaultValues: { jd: '', cv: '' },
  })

  const handleSubmit = async (data: CvEvalFormValues) => {
    setShowOutput(false)
    const result = await call({
      messages: [{ role: 'user', content: buildCvEvalPrompt(data) }],
      system: buildSystemPrompt(getContext('ta_ctx_eval')),
      maxTokens: 2000,
    })
    if (result) {
      setOutput(result)
      setShowOutput(true)
    }
  }

  return (
    <div className="max-w-[720px]">
      <CvEvalForm form={form} onSubmit={handleSubmit} />
      <RunButton
        isLoading={isLoading}
        disabled={status !== 'valid'}
        label="Đánh giá ngay"
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
| EVAL-01 | JD text input (required) | ✅ |
| EVAL-02 | CV text input (required) | ✅ |
| EVAL-03 | Structured evaluation: Fit Score, strengths, gaps, questions, recommendation | ✅ (in prompt) |
| EVAL-04 | Copyable output | ✅ |

---

## Verification Checklist

- [ ] Both fields required — submitting empty shows errors
- [ ] Output has numbered sections (Fit Score, Điểm mạnh, etc.)
- [ ] Fit score formatted as bold `X/10`
- [ ] Interview questions listed as numbered list
- [ ] Copy and clear work correctly
