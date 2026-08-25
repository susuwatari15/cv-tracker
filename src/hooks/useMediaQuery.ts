"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query.
 *
 * Uses useSyncExternalStore so the server snapshot is a defined `false` rather
 * than a guess: during hydration React uses that same value, then re-renders
 * with the real match. Reading matchMedia in an effect + setState would work
 * too, but this keeps it a subscription to an external system, which is what
 * it actually is.
 */
export function useMediaQuery(query: string): boolean {
	const subscribe = useCallback(
		(onChange: () => void) => {
			const mql = window.matchMedia(query);
			mql.addEventListener("change", onChange);
			return () => mql.removeEventListener("change", onChange);
		},
		[query],
	);

	return useSyncExternalStore(
		subscribe,
		() => window.matchMedia(query).matches,
		() => false, // server: assume narrow, the safe default for an overlay
	);
}

/** Matches Tailwind's `2xl` breakpoint — where the assistant can dock. */
export const WIDE_QUERY = "(min-width: 96rem)";
