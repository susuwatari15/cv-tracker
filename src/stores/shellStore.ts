import { create } from "zustand";

/**
 * Layout state for the app shell. Kept in a store rather than AppShell local
 * state because the nav drawer is opened from the mobile top bar and closed
 * from inside the sidebar, which are siblings, not parent/child.
 */
interface ShellStore {
	/** Off-canvas navigation drawer (below the lg breakpoint). */
	navOpen: boolean;
	/**
	 * Assistant visibility as an explicit user choice.
	 * `null` means "not chosen yet" — fall back to the per-breakpoint default
	 * (docked open on wide screens, closed where it would cover the tool).
	 * One boolean can't carry two defaults, hence the third state.
	 */
	chatOpen: boolean | null;
	setNavOpen: (open: boolean) => void;
	setChatOpen: (open: boolean | null) => void;
}

export const useShellStore = create<ShellStore>((set) => ({
	navOpen: false,
	chatOpen: null,
	setNavOpen: (navOpen) => set({ navOpen }),
	setChatOpen: (chatOpen) => set({ chatOpen }),
}));
