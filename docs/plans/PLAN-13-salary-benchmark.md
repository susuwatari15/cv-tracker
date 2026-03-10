# PLAN-13 — Salary Benchmark Tool

**Depends on:** PLAN-02, PLAN-03, PLAN-04, PLAN-05  
**Output:** Salary Benchmark tool — get Vietnam tech salary ranges and market insights

---

## What to Build

Mirrors HTML's `#tool-salary` section.

Inputs:
- Position title (required)
- Level (select: Junior → Director)
- Location (select: TP.HCM, Hà Nội, Đà Nẵng, Remote)
- Years of experience (text input)
- Tech stack / Specialization (textarea, optional)

Output: Salary ranges (Median/Top 25%/Top 10%), market comparison, trend, benefits, recommendation.

---

## Files to Create

### `src/features/salary-benchmark/types/index.ts`

```ts
import { z } from 'zod'
import { JD_LEVELS } from '@/features/jd-writer/types'

export const LOCATIONS = ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Remote'] as const
export type Location = typeof LOCATIONS[number]

export const salaryFormSchema = z.object({
  title: z.string().min(1, 'Nhập tên vị trí trước nhé!'),
  level: z.enum(JD_LEVELS),
  location: z.enum(LOCATIONS),
  experience: z.string(),
  skills: z.string(),
})

export type SalaryFormValues = z.infer<typeof salaryFormSchema>
```

Note: Reuses `JD_LEVELS` from `jd-writer/types` to avoid duplication.  
Alternatively, move `JD_LEVELS` to `src/types/index.ts` if shared across features.

---

### `src/features/salary-benchmark/components/SalaryForm.tsx`

Presentational. 2-column grid for title+level and location+experience, full-width for skills.

```tsx
<FormSection title="Tư vấn Salary Benchmark" icon="💰">
  <div className="grid grid-cols-2 gap-3.5">
    <FieldGroup label="Vị trí" required>
      <Input {...form.register('title')} placeholder="VD: Cloud Architect" />
      {/* error */}
    </FieldGroup>

    <FieldGroup label="Level">
      <Select onValueChange={(v) => form.setValue('level', v as JdLevel)} defaultValue="Senior">
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {JD_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
        </SelectContent>
      </Select>
    </FieldGroup>

    <FieldGroup label="Địa điểm">
      <Select onValueChange={(v) => form.setValue('location', v as Location)} defaultValue="TP.HCM">
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {LOCATIONS.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
        </SelectContent>
      </Select>
    </FieldGroup>

    <FieldGroup label="Số năm kinh nghiệm">
      <Input {...form.register('experience')} placeholder="VD: 5-7 năm" />
    </FieldGroup>
  </div>

  <div className="mt-3.5">
    <FieldGroup label="Tech stack / Specialization">
      <Textarea
        {...form.register('skills')}
        placeholder="VD: AWS, Kubernetes, Terraform, Security..."
        rows={3}
      />
    </FieldGroup>
  </div>
</FormSection>
```

---

### Prompt builder — add to `src/lib/prompts.ts`

```ts
export function buildSalaryPrompt(data: SalaryFormValues): string {
  return `Tư vấn salary benchmark cho vị trí:
- Vị trí: ${data.title} (${data.level})
- Địa điểm: ${data.location}
- Kinh nghiệm: ${data.experience || 'không rõ'}
- Tech stack: ${data.skills || 'general'}

Cung cấp:
1. **Salary range thị trường** (gross/tháng, VNĐ) — chia theo mức Median / Top 25% / Top 10%
2. **So sánh với market**: product company vs outsourcing vs startup
3. **Xu hướng**: mức lương đang tăng/ổn định/cạnh tranh cao không?
4. **Các benefit phổ biến** ngoài lương cơ bản
5. **Lời khuyên** cho chị Hue khi offer vị trí này tại Masan

Lưu ý: Dựa trên market data VN 2024-2025, ghi rõ đây là ước tính thị trường`
}
```

---

### `src/features/salary-benchmark/containers/SalaryContainer.tsx`

**Client component.**

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApiKeyStore } from '@/stores/apiKeyStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useClaudeApi } from '@/hooks/useClaudeApi'
import { buildSystemPrompt, buildSalaryPrompt } from '@/lib/prompts'
import { formatText } from '@/lib/formatText'
import { salaryFormSchema, SalaryFormValues } from '../types'

export default function SalaryContainer() {
  const [output, setOutput] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  const { status } = useApiKeyStore()
  const { getContext } = useSettingsStore()
  const { isLoading, call } = useClaudeApi()

  const form = useForm<SalaryFormValues>({
    resolver: zodResolver(salaryFormSchema),
    defaultValues: {
      title: '',
      level: 'Senior',
      location: 'TP.HCM',
      experience: '',
      skills: '',
    },
  })

  const handleSubmit = async (data: SalaryFormValues) => {
    setShowOutput(false)
    const result = await call({
      messages: [{ role: 'user', content: buildSalaryPrompt(data) }],
      system: buildSystemPrompt(getContext('ta_ctx_salary')),
      maxTokens: 2000,
    })
    if (result) {
      setOutput(result)
      setShowOutput(true)
    }
  }

  return (
    <div className="max-w-[720px]">
      <SalaryForm form={form} onSubmit={handleSubmit} />
      <RunButton
        isLoading={isLoading}
        disabled={status !== 'valid'}
        label="Xem benchmark"
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
| SAL-01 | Position (required), level, location, experience, tech stack | ✅ |
| SAL-02 | Location: TP.HCM, Hà Nội, Đà Nẵng, Remote | ✅ |
| SAL-03 | Salary range (Median/Top25%/Top10%), market comparison, trend, benefits, recommendation | ✅ (in prompt) |
| SAL-04 | Note: data is estimated, 2024–2025 | ✅ (in prompt) |
| SAL-05 | Copyable output | ✅ |

---

## Verification Checklist

- [ ] Submitting without position shows validation error
- [ ] All 4 locations available in select
- [ ] Level defaults to "Senior"
- [ ] Location defaults to "TP.HCM"
- [ ] Output contains 5 numbered sections
- [ ] Output includes market comparison table or breakdown
- [ ] Copy and clear work correctly
