import { cn } from "@/lib/utils";

interface ApiStatusDotProps {
	status: "empty" | "valid" | "invalid";
	/** Render on the dark navigation rail instead of a light surface. */
	onDark?: boolean;
}

const LABELS: Record<ApiStatusDotProps["status"], string> = {
	empty: "Chưa cấu hình API key",
	valid: "API key hợp lệ",
	invalid: "API key không đúng định dạng",
};

/**
 * The dot is decorative: it carries a text label for screen readers and is
 * always accompanied by visible copy, so the state is never colour-only.
 */
export default function ApiStatusDot({ status, onDark }: ApiStatusDotProps) {
	return (
		<span
			role="img"
			aria-label={LABELS[status]}
			title={LABELS[status]}
			className={cn(
				"size-2 shrink-0 rounded-full ring-2 transition-colors",
				onDark ? "ring-white/10" : "ring-canvas-2",
				status === "valid" && "bg-success",
				status === "invalid" && "bg-danger",
				status === "empty" && (onDark ? "bg-white/25" : "bg-ink-4"),
			)}
		/>
	);
}
