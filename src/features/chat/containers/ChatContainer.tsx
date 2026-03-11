"use client";

import { useState, useRef } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useApiKeyStore } from "@/stores/apiKeyStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { buildSystemPrompt } from "@/lib/prompts";
import MessageList from "../components/MessageList";
import QuickPrompts from "../components/QuickPrompts";
import ChatInput from "../components/ChatInput";

export default function ChatContainer() {
	const [inputValue, setInputValue] = useState("");
	const listRef = useRef<HTMLDivElement>(null);

	const { messages, isThinking, addMessage, setThinking, getApiMessages } =
		useChatStore();
	const { status } = useApiKeyStore();
	const { getContext } = useSettingsStore();
	const { call } = useClaudeApi();

	const scrollToBottom = () => {
		if (listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	};

	const handleSend = async () => {
		const text = inputValue.trim();
		if (!text || status !== "valid") return;

		addMessage("user", text);
		setInputValue("");
		setThinking(true);
		scrollToBottom();

		const apiMessages = getApiMessages();
		const system = buildSystemPrompt(getContext("ta_ctx_chat"));

		const reply = await call({
			messages: apiMessages,
			system,
			maxTokens: 2000,
		});

		setThinking(false);
		if (reply) {
			addMessage("assistant", reply);
			scrollToBottom();
		}
	};

	return (
		<div className="flex flex-col h-full overflow-hidden">
			{/* Panel Header */}
			<div className="px-5 py-4 border-b border-border-default shrink-0">
				<div className=" text-[16px] font-semibold text-ink">Trợ lý AI</div>
				<div className="text-[11px] font-mono text-ink-3 mt-0.5">
					Chat tự do — hỏi bất cứ điều gì liên quan đến công việc TA
				</div>
			</div>

			{/* Message list */}
			<MessageList
				messages={messages}
				isThinking={isThinking}
				listRef={listRef}
			/>

			{/* Input area */}
			<div className="px-4 pb-4 pt-3 border-t border-border-default shrink-0">
				<QuickPrompts onSelect={setInputValue} />
				<div className="flex gap-2.5 items-end">
					<ChatInput
						value={inputValue}
						onChange={setInputValue}
						onSend={handleSend}
						disabled={status !== "valid"}
					/>
					<button
						onClick={handleSend}
						disabled={status !== "valid" || !inputValue.trim()}
						className="w-11 h-11 rounded-[12px] bg-ta-accent hover:bg-ta-accent-hover disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all"
					>
						➤
					</button>
				</div>
			</div>
		</div>
	);
}
