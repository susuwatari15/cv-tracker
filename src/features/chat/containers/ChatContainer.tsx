"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles, X } from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import { useProviderStore } from "@/stores/providerStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useToolStore } from "@/stores/toolStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { buildSystemPrompt } from "@/lib/prompts";
import MessageList from "../components/MessageList";
import QuickPrompts from "../components/QuickPrompts";
import ChatInput from "../components/ChatInput";

export default function ChatContainer({
	onClose,
}: {
	/** Present only when the panel is rendered as an overlay. */
	onClose?: () => void;
}) {
	const [inputValue, setInputValue] = useState("");
	const listRef = useRef<HTMLDivElement>(null);

	const { messages, isThinking, addMessage, setThinking, getApiMessages } =
		useChatStore();
	const status = useProviderStore((s) => s.status);
	const { getContext } = useSettingsStore();
	const setActiveTool = useToolStore((s) => s.setActiveTool);
	const { call } = useClaudeApi();

	const blocked = status !== "valid";

	// Follow the tail of the conversation as it grows.
	useEffect(() => {
		const el = listRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [messages.length, isThinking]);

	const handleSend = async () => {
		const text = inputValue.trim();
		if (!text || blocked) return;

		addMessage("user", text);
		setInputValue("");
		setThinking(true);

		const reply = await call({
			messages: getApiMessages(),
			system: buildSystemPrompt(getContext("ta_ctx_chat")),
			maxTokens: 2000,
		});

		setThinking(false);
		if (reply) addMessage("assistant", reply);
	};

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<header className="flex shrink-0 items-center gap-2.5 border-b border-border-default px-4 py-3.5">
				<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ta-accent-soft text-ta-accent">
					<Sparkles className="size-3.5" aria-hidden="true" />
				</span>
				<div className="min-w-0 flex-1">
					<h2 className="truncate text-[13.5px] font-semibold leading-tight text-ink">
						Trợ lý AI
					</h2>
					<p className="truncate text-[11.5px] leading-tight text-ink-3">
						Hỏi tự do về công việc tuyển dụng
					</p>
				</div>
				{onClose ? (
					<button
						type="button"
						onClick={onClose}
						aria-label="Đóng trợ lý"
						className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-canvas-2 hover:text-ink"
					>
						<X className="size-4" aria-hidden="true" />
					</button>
				) : null}
			</header>

			<MessageList
				messages={messages}
				isThinking={isThinking}
				listRef={listRef}
			/>

			<div className="shrink-0 border-t border-border-default px-4 pb-4 pt-3">
				{blocked ? (
					<div className="mb-2.5 rounded-lg border border-warning-border bg-warning-soft px-3 py-2.5">
						<p className="text-[12px] leading-relaxed text-ink-2">
							Chưa có API key hợp lệ.{" "}
							<button
								type="button"
								onClick={() => setActiveTool("settings")}
								className="cursor-pointer font-semibold text-ta-accent underline underline-offset-2"
							>
								Mở Cấu hình
							</button>{" "}
							để kết nối.
						</p>
					</div>
				) : (
					<QuickPrompts onSelect={setInputValue} disabled={isThinking} />
				)}

				<div className="flex items-end gap-2">
					<ChatInput
						value={inputValue}
						onChange={setInputValue}
						onSend={handleSend}
						disabled={blocked}
					/>
					<button
						type="button"
						onClick={handleSend}
						disabled={blocked || !inputValue.trim() || isThinking}
						aria-label="Gửi tin nhắn"
						className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-ta-accent text-ta-accent-fg transition-colors hover:bg-ta-accent-hover disabled:cursor-not-allowed disabled:bg-border-strong disabled:text-ink-3"
					>
						<ArrowUp className="size-4" aria-hidden="true" />
					</button>
				</div>
			</div>
		</div>
	);
}
