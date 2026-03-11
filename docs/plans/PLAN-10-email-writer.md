# PLAN-10 — Email Writer Tool (Viết Email UV)

**Depends on:** PLAN-02, PLAN-03, PLAN-04, PLAN-05  
**Output:** Email Writer tool in Column 2 — fill form, generate candidate emails

---

## What to Build

Mirrors HTML's `#tool-email` section.

Inputs:

- Email type (select: 5 types)
- Candidate name (required)
- Applied position
- Language (Vietnamese / English)
- Additional context (textarea, optional)

Output: Full email with subject line.

---

## Files to Create

### `src/features/email-writer/types/index.ts`

```ts
import { z } from "zod";

export const EMAIL_TYPES = [
  { value: "invite", label: "Mời phỏng vấn" },
  { value: "reject", label: "Từ chối ứng viên" },
  { value: "offer", label: "Thông báo offer" },
  { value: "followup", label: "Follow-up sau PV" },
  { value: "pipeline", label: "Giữ pipeline (on hold)" },
] as const;

export type EmailType = (typeof EMAIL_TYPES)[number]["value"];

export const emailFormSchema = z.object({
  type: z.enum(["invite", "reject", "offer", "followup", "pipeline"]),
  candidate: z.string().min(1, "Nhập tên ứng viên trước nhé!"),
  position: z.string(),
  language: z.enum(["vi", "en"]),
  extra: z.string(),
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;

export const EMAIL_TYPE_LABELS: Record<EmailType, string> = {
  invite: "mời phỏng vấn",
  reject: "từ chối nhẹ nhàng",
  offer: "thông báo offer",
  followup: "follow-up sau phỏng vấn",
  pipeline: "giữ candidate trong pipeline (on hold)",
};
```

---

### `src/features/email-writer/components/EmailForm.tsx`

Presentational form.

Layout: 2-column grid for type+candidate and position+language, full-width for extra context textarea.

```tsx
<FormSection title="Thông tin email" icon="📧">
  <div className="grid grid-cols-2 gap-3.5">
    <FieldGroup label="Loại email" required>
      <Select
        onValueChange={(v) => form.setValue("type", v as EmailType)}
        defaultValue="invite"
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {EMAIL_TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldGroup>

    <FieldGroup label="Tên ứng viên" required>
      <Input
        {...form.register("candidate")}
        placeholder="VD: Anh Minh / Chị Lan"
      />
      {/* error message */}
    </FieldGroup>

    <FieldGroup label="Vị trí ứng tuyển">
      <Input
        {...form.register("position")}
        placeholder="VD: Senior Data Engineer"
      />
    </FieldGroup>

    <FieldGroup label="Ngôn ngữ email">
      <Select
        onValueChange={(v) => form.setValue("language", v as "vi" | "en")}
        defaultValue="vi"
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="vi">Tiếng Việt</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
    </FieldGroup>
  </div>

  <div className="mt-3.5">
    <FieldGroup label="Thông tin thêm (tuỳ chọn)">
      <Textarea
        {...form.register("extra")}
        placeholder="VD: PV Round 2 vào 10h sáng 15/4, Google Meet..."
        rows={3}
      />
    </FieldGroup>
  </div>
</FormSection>
```

---

### Prompt builder — add to `src/lib/prompts.ts`

```ts
export function buildEmailPrompt(data: EmailFormValues): string {
  const typeLabel = EMAIL_TYPE_LABELS[data.type];
  return `Viết email ${typeLabel} cho ứng viên.
Tên ứng viên: ${data.candidate}
${data.position ? "Vị trí: " + data.position : ""}
Ngôn ngữ: ${data.language === "vi" ? "Tiếng Việt" : "English"}
${data.extra ? "Thông tin thêm: " + data.extra : ""}

Yêu cầu:
- Tone: Semi-formal, thân thiện, chuyên nghiệp — đúng phong cách của chị Hue
- Cá nhân hóa theo tên ứng viên
- Không quá template, có cảm xúc thật
- Người gửi: Hue Nguyen, TA Manager
- Viết email đầy đủ gồm subject line`;
}
```

---

### `src/features/email-writer/containers/EmailWriterContainer.tsx`

**Client component.** Same pattern as `JdWriterContainer`.

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiKeyStore } from "@/stores/apiKeyStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { buildSystemPrompt, buildEmailPrompt } from "@/lib/prompts";
import { formatText } from "@/lib/formatText";
import { emailFormSchema, EmailFormValues } from "../types";

export default function EmailWriterContainer() {
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  const { status } = useApiKeyStore();
  const { getContext } = useSettingsStore();
  const { isLoading, call } = useClaudeApi();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      type: "invite",
      candidate: "",
      position: "",
      language: "vi",
      extra: "",
    },
  });

  const handleSubmit = async (data: EmailFormValues) => {
    setShowOutput(false);
    const result = await call({
      messages: [{ role: "user", content: buildEmailPrompt(data) }],
      system: buildSystemPrompt(getContext("ta_ctx_email")),
      maxTokens: 2000,
    });
    if (result) {
      setOutput(result);
      setShowOutput(true);
    }
  };

  return (
    <div className="max-w-[720px]">
      <EmailForm form={form} onSubmit={handleSubmit} />
      <RunButton
        isLoading={isLoading}
        disabled={status !== "valid"}
        label="Viết email ngay"
        onClick={form.handleSubmit(handleSubmit)}
      />
      <OutputBox
        show={showOutput}
        html={formatText(output)}
        actions={
          <>
            <CopyButton getText={() => output} />
            <button onClick={() => setShowOutput(false)} className="...">
              ✕ Xóa
            </button>
          </>
        }
      />
    </div>
  );
}
```

---

## BRD Requirements Covered

| ID       | Requirement                          |    Covered     |
| -------- | ------------------------------------ | :------------: |
| EMAIL-01 | Email type select                    |       ✅       |
| EMAIL-02 | Candidate name (required) + position |       ✅       |
| EMAIL-03 | Language select (Vi / En)            |       ✅       |
| EMAIL-04 | Optional extra context               |       ✅       |
| EMAIL-05 | Full email with subject line         | ✅ (in prompt) |
| EMAIL-06 | Semi-formal, personalized tone       | ✅ (in prompt) |
| EMAIL-07 | Sender: Hue Nguyen                   | ✅ (in prompt) |
| EMAIL-08 | Copyable output                      |       ✅       |

---

## Verification Checklist

- [ ] All 5 email types available in select
- [ ] Submitting without candidate name shows validation error
- [ ] Language switch changes output language
- [ ] Generated email includes Subject line
- [ ] Output is formatted correctly (paragraphs, bold)
- [ ] Copy and clear buttons work
