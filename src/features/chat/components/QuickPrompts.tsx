import { QUICK_PROMPTS } from "../types";

interface QuickPromptsProps {
  onSelect: (text: string) => void;
}

export default function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="flex flex-wrap gap-[7px] mb-3">
      {QUICK_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt.replace(/^[^\s]+ /, ""))}
          className="px-[13px] py-[6px] rounded-full text-[11.5px] border border-border-strong text-ink-2 bg-surface hover:border-ta-accent hover:text-ta-accent hover:bg-ta-accent/5 transition-all whitespace-nowrap "
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
