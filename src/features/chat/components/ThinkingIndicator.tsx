export default function ThinkingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-up">
      <div className="w-8 h-8 rounded-full bg-ta-accent flex items-center justify-center text-white text-[13px] shrink-0 ">
        ✦
      </div>
      <div className="flex items-center gap-[5px] px-[18px] py-[14px] bg-surface border border-border-default rounded-2xl rounded-tl-[4px]">
        {[0, 200, 400].map((delay) => (
          <span
            key={delay}
            className="w-[7px] h-[7px] rounded-full bg-ink-3 animate-blink"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
