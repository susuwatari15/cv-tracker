"use client";

import { useEffect } from "react";
import ChatContainer from "@/features/chat/containers/ChatContainer";
import { useShellStore } from "@/stores/shellStore";
import { useMediaQuery, WIDE_QUERY } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/**
 * The assistant is a docked third column on wide screens and a right-side
 * overlay below that. Both presentations share one visibility state, so the
 * floating button toggles it at every size — previously the docked column had
 * no way to be hidden at all, and a 380px column is a lot to give up when
 * you're filling in a form.
 */
export default function AIChatPanel() {
	const { chatOpen, setChatOpen } = useShellStore();
	const isWide = useMediaQuery(WIDE_QUERY);
	const isOpen = chatOpen ?? isWide;

	const asOverlay = !isWide;

	useEffect(() => {
		if (!isOpen || !asOverlay) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setChatOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [isOpen, asOverlay, setChatOpen]);

	// Docked column: takes real layout space, so it is mounted only when open.
	if (!asOverlay) {
		if (!isOpen) return null;
		return (
			<aside
				id="assistant-panel"
				aria-label="Trợ lý AI"
				className="flex w-[380px] min-w-[380px] shrink-0 flex-col overflow-hidden border-l border-border-default bg-surface"
			>
				<ChatContainer onClose={() => setChatOpen(false)} />
			</aside>
		);
	}

	// Overlay: kept mounted so the slide transition has something to animate.
	return (
		<div
			className={cn(
				"fixed inset-0 z-50 overflow-hidden",
				isOpen ? "pointer-events-auto" : "pointer-events-none",
			)}
			aria-hidden={!isOpen}
		>
			<div
				onClick={() => setChatOpen(false)}
				className={cn(
					"absolute inset-0 bg-black/50 transition-opacity duration-200",
					isOpen ? "opacity-100" : "opacity-0",
				)}
			/>
			<aside
				id="assistant-panel"
				role="dialog"
				aria-modal={isOpen}
				aria-label="Trợ lý AI"
				className={cn(
					"absolute inset-y-0 right-0 flex w-[420px] max-w-[92vw] flex-col overflow-hidden",
					"border-l border-border-default bg-surface shadow-e4",
					"transition-transform duration-200 ease-out",
					isOpen ? "translate-x-0" : "translate-x-full",
				)}
			>
				<ChatContainer onClose={() => setChatOpen(false)} />
			</aside>
		</div>
	);
}
