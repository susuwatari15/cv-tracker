import { create } from "zustand";
import { CV_FIELDS, type CvField } from "@/features/cv-parser/types";

const LS_KEY = "cv_parser_fields";

/**
 * Persisted extraction schema for the CV parser.
 *
 * This lives in a store hydrated by StoreInitializer rather than being read
 * from localStorage during render: reading storage in a render pass makes
 * the server emit the defaults while the client emits the stored list,
 * which is a hydration mismatch.
 */
interface CvFieldsStore {
	fields: CvField[];
	selected: Set<string>;
	addField: (field: CvField) => void;
	removeField: (key: string) => void;
	toggle: (key: string) => void;
	loadFromStorage: () => void;
}

function persist(fields: CvField[]) {
	try {
		localStorage.setItem(LS_KEY, JSON.stringify(fields));
	} catch {
		// Storage full or blocked — the in-memory list still works this session.
	}
}

export const useCvFieldsStore = create<CvFieldsStore>((set, get) => ({
	fields: CV_FIELDS,
	selected: new Set(CV_FIELDS.map((f) => f.key)),

	addField: (field) => {
		const fields = [...get().fields, field];
		persist(fields);
		set((s) => ({ fields, selected: new Set([...s.selected, field.key]) }));
	},

	removeField: (key) => {
		const fields = get().fields.filter((f) => f.key !== key);
		persist(fields);
		set((s) => {
			const selected = new Set(s.selected);
			selected.delete(key);
			return { fields, selected };
		});
	},

	toggle: (key) =>
		set((s) => {
			const selected = new Set(s.selected);
			if (selected.has(key)) selected.delete(key);
			else selected.add(key);
			return { selected };
		}),

	loadFromStorage: () => {
		try {
			const raw = localStorage.getItem(LS_KEY);
			if (!raw) return;
			const stored = JSON.parse(raw) as CvField[];
			if (!Array.isArray(stored) || !stored.length) return;
			set({ fields: stored, selected: new Set(stored.map((f) => f.key)) });
		} catch {
			// Corrupt entry — keep the defaults rather than breaking the tool.
		}
	},
}));
