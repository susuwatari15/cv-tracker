import { create } from "zustand";

type ApiKeyStatus = "empty" | "valid" | "invalid";

interface ApiKeyStore {
  key: string;
  status: ApiKeyStatus;
  setKey: (key: string) => void;
  getKey: () => string;
}

const validate = (k: string): ApiKeyStatus => {
  if (!k) return "empty";
  return k.startsWith("sk-ant-") ? "valid" : "invalid";
};

export const useApiKeyStore = create<ApiKeyStore>((set, get) => ({
  key: "",
  status: "empty",

  setKey: (key: string) => {
    const trimmed = key.trim();
    if (trimmed) localStorage.setItem("ta_api_key", trimmed);
    else localStorage.removeItem("ta_api_key");
    set({ key: trimmed, status: validate(trimmed) });
  },

  getKey: () => get().key,
}));

export function initApiKeyStore() {
  const saved = localStorage.getItem("ta_api_key") ?? "";
  useApiKeyStore.getState().setKey(saved);
}
