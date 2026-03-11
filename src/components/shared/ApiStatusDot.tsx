interface ApiStatusDotProps {
  status: "empty" | "valid" | "invalid";
}

const colorMap = {
  empty: "bg-white/20",
  valid: "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]",
  invalid: "bg-red-400",
};

export default function ApiStatusDot({ status }: ApiStatusDotProps) {
  return (
    <div
      className={`w-[7px] h-[7px] rounded-full shrink-0 transition-all ${colorMap[status]}`}
    />
  );
}
