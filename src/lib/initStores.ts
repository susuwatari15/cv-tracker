import { initProviderStore } from "@/stores/providerStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useCvFieldsStore } from "@/stores/cvFieldsStore";

export function initStores() {
	initProviderStore();
	useSettingsStore.getState().loadFromStorage();
	useCvFieldsStore.getState().loadFromStorage();
}
