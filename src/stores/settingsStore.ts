import { create } from "zustand";

export type ContextKey =
  | "ta_ctx_chat"
  | "ta_ctx_jd"
  | "ta_ctx_email"
  | "ta_ctx_eval"
  | "ta_ctx_summary"
  | "ta_ctx_salary";

const DEFAULTS: Record<ContextKey, string> = {
  ta_ctx_chat:
    "Hue Nguyen, TA Manager at Masan Group. Specializes in tech roles (Data, Software Engineering, Cloud, Security, ERP). Vietnam market, TP.HCM. 10+ years TA experience.",
  ta_ctx_jd:
    "Company: Masan Group — a large conglomerate with entities including Masan Tech, Masan Consumer. Tone: semi-formal, tech-savvy, attractive to engineers. Language: Vietnamese with English tech terms.",
  ta_ctx_email:
    "Sender: Hue Nguyen, TA Manager, Masan Group. Tone: semi-formal, warm, personalized. Not a generic template.",
  ta_ctx_eval:
    "Focus on tech roles. Provide objective, structured evaluation with fit score, strengths, gaps, and suggested interview questions.",
  ta_ctx_summary:
    "Summary audience: CTO or Tech Director. Keep to ~150–200 words. Bullet point format. Scannable.",
  ta_ctx_salary:
    "Market: Vietnam tech sector, 2024–2025. Primary location: TP.HCM. Include product company vs outsourcing vs startup comparison.",
};

interface SettingsStore {
  contexts: Record<ContextKey, string>;
  setContext: (key: ContextKey, value: string) => void;
  getContext: (key: ContextKey) => string;
  saveAll: () => void;
  loadFromStorage: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  contexts: { ...DEFAULTS },

  setContext: (key, value) => {
    set((s) => ({ contexts: { ...s.contexts, [key]: value } }));
  },

  getContext: (key) => get().contexts[key] ?? DEFAULTS[key],

  saveAll: () => {
    const { contexts } = get();
    Object.entries(contexts).forEach(([k, v]) => localStorage.setItem(k, v));
  },

  loadFromStorage: () => {
    const loaded = Object.fromEntries(
      Object.keys(DEFAULTS).map((k) => [
        k,
        localStorage.getItem(k) ?? DEFAULTS[k as ContextKey],
      ])
    ) as Record<ContextKey, string>;
    set({ contexts: loaded });
  },
}));
