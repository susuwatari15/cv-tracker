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
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      rows={1}
      placeholder={disabled ? "Nhập API key để chat..." : "Hỏi chị Hue..."}
      className="flex-1 resize-none bg-canvas border border-border-default rounded-[12px] px-4 py-3 text-[13px] text-ink placeholder:text-ink-3 outline-none focus:border-border-strong transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ minHeight: "44px", maxHeight: "140px" }}
    />
  );
}
