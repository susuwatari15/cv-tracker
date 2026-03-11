import type { ContextKey } from "@/stores/settingsStore";

export interface BusinessContextField {
  key: ContextKey;
  label: string;
  placeholder: string;
}

export const BUSINESS_CONTEXT_FIELDS: BusinessContextField[] = [
  {
    key: "ta_ctx_chat",
    label: "Trợ lý AI",
    placeholder: "VD: Hue Nguyen, TA Manager at Masan Group...",
  },
  {
    key: "ta_ctx_jd",
    label: "Soạn JD",
    placeholder: "VD: Company: Masan Group. Tone: semi-formal, tech-savvy...",
  },
  {
    key: "ta_ctx_email",
    label: "Viết Email UV",
    placeholder: "VD: Sender: Hue Nguyen, TA Manager...",
  },
  {
    key: "ta_ctx_eval",
    label: "Đánh giá CV vs JD",
    placeholder:
      "VD: Focus on tech roles. Provide fit score, strengths, gaps...",
  },
  {
    key: "ta_ctx_summary",
    label: "Tóm tắt Candidate",
    placeholder:
      "VD: Summary audience: CTO or Tech Director. ~150-200 words...",
  },
  {
    key: "ta_ctx_salary",
    label: "Salary Benchmark",
    placeholder: "VD: Market: Vietnam tech sector, 2024-2025. TP.HCM...",
  },
];
