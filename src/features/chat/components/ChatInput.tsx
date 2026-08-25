import { useEffect, useRef } from "react";

interface ChatInputProps {
	value: string;
	onChange: (v: string) => void;
	onSend: () => void;
	disabled: boolean;
}

export default function ChatInput({
	value,
	onChange,
	onSend,
	disabled,
}: ChatInputProps) {
	const ref = useRef<HTMLTextAreaElement>(null);

	// Autosize from state rather than from the change event, so clearing the
	// value after send also collapses the box back to one row.
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
	}, [value]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			onSend();
		}
	};

	return (
		<>
			<label htmlFor="chat-composer" className="sr-only">
				Nội dung tin nhắn
			</label>
			<textarea
				id="chat-composer"
				ref={ref}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				disabled={disabled}
				rows={1}
				aria-describedby="chat-composer-hint"
				placeholder={
					disabled ? "Cần API key để chat" : "Nhập câu hỏi của bạn…"
				}
				className="min-h-11 flex-1 resize-none overflow-hidden rounded-lg border border-border-strong bg-surface px-3.5 py-3 text-sm text-ink transition-colors placeholder:text-ink-4 focus-visible:border-ta-accent disabled:cursor-not-allowed disabled:bg-canvas-2 disabled:text-ink-3"
				style={{ maxHeight: 160 }}
			/>
			<span id="chat-composer-hint" className="sr-only">
				Nhấn Enter để gửi, Shift kèm Enter để xuống dòng.
			</span>
		</>
	);
}
