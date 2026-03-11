interface RunButtonProps {
  isLoading: boolean;
  disabled: boolean;
  label: string;
  loadingLabel?: string;
  onClick: () => void;
}

export default function RunButton({
  isLoading,
  disabled,
  label,
  loadingLabel,
  onClick,
}: RunButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full flex items-center justify-center gap-2 px-7 py-[13px] bg-ta-accent hover:bg-ta-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-[8px] transition-all "
    >
      {isLoading
        ? `⏳ ${loadingLabel ?? "Đang xử lý..."}`
        : `✦ ${label}`}
    </button>
  );
}
