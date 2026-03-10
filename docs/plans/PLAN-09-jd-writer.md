# PLAN-09 — JD Writer Tool (Soạn JD)

**Depends on:** PLAN-02, PLAN-03, PLAN-04, PLAN-05  
**Output:** JD Writer tool in Column 2 — fill form, generate full Job Description

---

## What to Build

Form inputs + AI-generated JD output. Mirrors HTML's `#tool-jd` section.

Inputs:
- Job title (required)
- Level (select: Junior → Director)
- Entity / BU
- Salary range
- Tech stack / skills (textarea)
- Team / project context (textarea)

Output: Full JD in Vietnamese with standard format sections.

---

## Files to Create

### `src/features/jd-writer/types/index.ts`

```ts
import { z } from 'zod'

export const JD_LEVELS = ['Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Head', 'Director'] as const
export type JdLevel = typeof JD_LEVELS[number]

export const jdFormSchema = z.object({
  title: z.string().min(1, 'Nhập tên vị trí trước nhé!'),
  level: z.enum(JD_LEVELS),
  entity: z.string(),
  salary: z.string(),
  skills: z.string(),
  context: z.string(),
})

export type JdFormValues = z.infer<typeof jdFormSchema>
```

---

### `src/features/jd-writer/components/JdForm.tsx`

Presentational form component.

Props:
```ts
interface JdFormProps {
  form: UseFormReturn<JdFormValues>
  onSubmit: (data: JdFormValues) => void
}
```

Layout: 2-column grid for title+level and entity+salary, full-width for skills and context textareas.

```tsx
<form onSubmit={form.handleSubmit(onSubmit)}>
  <FormSection title="Thông tin vị trí" icon="📝">
    <div className="grid grid-cols-2 gap-3.5">
      <FieldGroup label="Tên vị trí" required>
        <Input {...form.register('title')} placeholder="VD: Senior Data Engineer" />
        {form.formState.errors.title && (
          <span className="text-red-500 text-xs">{form.formState.errors.title.message}</span>
        )}
      </FieldGroup>

      <FieldGroup label="Level">
        <Select onValueChange={(v) => form.setValue('level', v as JdLevel)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {JD_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </FieldGroup>

      <FieldGroup label="Entity / BU">
        <Input {...form.register('entity')} placeholder="VD: Masan Tech / Masan Group" />
      </FieldGroup>

      <FieldGroup label="Mức lương (nếu có)">
        <Input {...form.register('salary')} placeholder="VD: 40-60M gross" />
      </FieldGroup>
    </div>

    <div className="grid grid-cols-1 gap-3.5 mt-3.5">
      <FieldGroup label="Tech stack / Yêu cầu kỹ năng chính">
        <Textarea {...form.register('skills')} placeholder="VD: Spark, Airflow, Python, SQL..." rows={3} />
      </FieldGroup>
      <FieldGroup label="Mô tả ngắn về team / dự án">
        <Textarea {...form.register('context')} placeholder="VD: Team Data Platform, đang build data lake..." rows={3} />
      </FieldGroup>
    </div>
  </FormSection>
</form>
```

---

### Prompt builder — in `src/lib/prompts.ts`

Add:

```ts
export function buildJdPrompt(data: JdFormValues): string {
  return `Soạn JD cho vị trí: ${data.title} (${data.level})
Entity/BU: ${data.entity || 'Masan Group'}
${data.salary ? 'Mức lương: ' + data.salary : ''}
${data.skills ? 'Tech stack/Skills yêu cầu: ' + data.skills : ''}
${data.context ? 'Context về team/dự án: ' + data.context : ''}

Yêu cầu JD:
- Tone: Semi-formal, hấp dẫn với engineer/tech talent
- Format chuẩn: About Us, Role Overview, Responsibilities, Requirements, Nice-to-have, Benefits
- Ngôn ngữ: Tiếng Việt (có thể mix tiếng Anh cho tech terms)
- Highlight culture Masan: transformation, scale, impact`
}
```

---

### `src/features/jd-writer/containers/JdWriterContainer.tsx`

**Client component.**

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApiKeyStore } from '@/stores/apiKeyStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useClaudeApi } from '@/hooks/useClaudeApi'
import { buildSystemPrompt, buildJdPrompt } from '@/lib/prompts'
import { formatText } from '@/lib/formatText'
import { jdFormSchema, JdFormValues, JD_LEVELS } from '../types'
import JdForm from '../components/JdForm'
import RunButton from '@/components/shared/RunButton'
import OutputBox from '@/components/shared/OutputBox'
import CopyButton from '@/components/shared/CopyButton'

export default function JdWriterContainer() {
  const [output, setOutput] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  const { status } = useApiKeyStore()
  const { getContext } = useSettingsStore()
  const { isLoading, call } = useClaudeApi()

  const form = useForm<JdFormValues>({
    resolver: zodResolver(jdFormSchema),
    defaultValues: { title: '', level: 'Senior', entity: '', salary: '', skills: '', context: '' },
  })

  const handleSubmit = async (data: JdFormValues) => {
    setShowOutput(false)
    const result = await call({
      messages: [{ role: 'user', content: buildJdPrompt(data) }],
      system: buildSystemPrompt(getContext('ta_ctx_jd')),
      maxTokens: 2000,
    })
    if (result) {
      setOutput(result)
      setShowOutput(true)
    }
  }

  return (
    <div className="max-w-[720px]">
      <JdForm form={form} onSubmit={handleSubmit} />
      <RunButton
        isLoading={isLoading}
        disabled={status !== 'valid'}
        label="Soạn JD ngay"
        onClick={form.handleSubmit(handleSubmit)}
      />
      <OutputBox
        show={showOutput}
        html={formatText(output)}
        actions={
          <>
            <CopyButton getText={() => output} />
            <button onClick={() => setShowOutput(false)}
              className="px-3 py-1.5 rounded-[8px] text-xs font-mono border border-border-strong text-ink-2 hover:text-accent transition-all">
              ✕ Xóa
            </button>
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
| JD-01 | Title (required), level, entity, salary, tech stack, context | ✅ |
| JD-02 | Level: Junior → Director | ✅ |
| JD-03 | Vietnamese JD with English tech terms | ✅ |
| JD-04 | Standard format sections | ✅ (in prompt) |
| JD-05 | Semi-formal, engineer-friendly tone | ✅ (in prompt) |
| JD-06 | Masan culture highlights | ✅ (in prompt) |
| JD-07 | Copyable output | ✅ |

---

## Verification Checklist

- [ ] Submitting without title shows validation error (not toast)
- [ ] Form submits correctly with title only
- [ ] API key invalid → Run button disabled
- [ ] Output box animates in after response
- [ ] Generated JD includes standard format sections
- [ ] Copy button copies raw text (not HTML) to clipboard
- [ ] Clear button hides the output box
