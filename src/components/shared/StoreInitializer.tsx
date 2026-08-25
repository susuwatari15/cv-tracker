"use client";

import { useEffect } from "react";
import { initStores } from "@/lib/initStores";

let initialized = false;

/**
 * Hydrates the zustand stores from localStorage.
 *
 * This must happen in an effect, not during render. Reading storage in the
 * render pass meant the server emitted default state ("Chưa cấu hình", the
 * default provider, no saved profiles) while the client's very first render
 * already had the persisted values — a hydration mismatch that React resolves
 * by throwing away and re-rendering the tree.
 *
 * The module-level guard keeps it to one pass even under StrictMode's
 * double-invoked effects.
 */
export default function StoreInitializer() {
	useEffect(() => {
		if (initialized) return;
		initialized = true;
		initStores();
	}, []);

	return null;
}
