import { initApiKeyStore } from "@/stores/apiKeyStore";
import { useSettingsStore } from "@/stores/settingsStore";

export function initStores() {
  initApiKeyStore();
  useSettingsStore.getState().loadFromStorage();
}
