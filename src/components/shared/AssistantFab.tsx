"use client";

import { MessagesSquare, PanelRightClose } from "lucide-react";
import { useShellStore } from "@/stores/shellStore";
import { useMediaQuery, WIDE_QUERY } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/**
 * Floating toggle for the AI assistant.
 *
 * Anchored to the bottom-right of the content column rather than the viewport,
 * so on wide screens it sits beside the docked panel instead of on top of it.
 *
 * While the assistant is an overlay it is hidden entirely: the drawer covers
 * that corner, so the button would be unclickable yet still focusable — a
 * control that announces "Ẩn trợ lý AI" but does nothing. The drawer closes
 * from its own X, Escape, or the scrim.
 */
export default function AssistantFab() {
	const { chatOpen, setChatOpen } = useShellStore();
	const isWide = useMediaQuery(WIDE_QUERY);

	// Default: docked and open on wide screens, closed where it would cover
	// the tool the user is actually working in.
	const isOpen = chatOpen ?? isWide;

	if (!isWide && isOpen) return null;

	return (
		<button
			type="button"
			onClick={() => setChatOpen(!isOpen)}
			aria-expanded={isOpen}
			aria-controls="assistant-panel"
			aria-label={isOpen ? "Ẩn trợ lý AI" : "Hiện trợ lý AI"}
			title={isOpen ? "Ẩn trợ lý AI" : "Hiện trợ lý AI"}
			className={cn(
				"absolute bottom-4 right-4 z-30 flex size-12 cursor-pointer items-center justify-center",
				"rounded-full shadow-e4 transition-colors duration-200 md:bottom-6 md:right-6",
				isOpen
					? "border border-border-strong bg-surface text-ink-2 hover:text-ink"
					: "bg-ta-accent text-ta-accent-fg hover:bg-ta-accent-hover",
			)}
		>
			{isOpen ? (
				<PanelRightClose className="size-5" aria-hidden="true" />
			) : (
				<MessagesSquare className="size-5" aria-hidden="true" />
			)}
		</button>
	);
}
