import { CheckCircle2, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const TONES: Record<
	Tone,
	{ cls: string; icon: typeof Info | null; label: string }
> = {
	success: {
		cls: "bg-success-soft text-success border-success-border",
		icon: CheckCircle2,
		label: "Thành công",
	},
	warning: {
		cls: "bg-warning-soft text-warning border-warning-border",
		icon: TriangleAlert,
		label: "Cảnh báo",
	},
	danger: {
		cls: "bg-danger-soft text-danger border-danger-border",
		icon: CircleAlert,
		label: "Lỗi",
	},
	info: {
		cls: "bg-info-soft text-info border-info-border",
		icon: Info,
		label: "Thông tin",
	},
	neutral: {
		cls: "bg-canvas-2 text-ink-2 border-border-default",
		icon: null,
		label: "",
	},
};

/**
 * Status chip. Always pairs colour with an icon + text so meaning never
 * rests on hue alone (WCAG 1.4.1 — and ~8% of male reviewers can't
 * separate the red/green pair a fit-score UI leans on).
 */
export default function StatusPill({
	tone = "neutral",
	children,
	className,
	showIcon = true,
}: {
	tone?: Tone;
	children: React.ReactNode;
	className?: string;
	showIcon?: boolean;
}) {
	const { cls, icon: Icon } = TONES[tone];
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none",
				cls,
				className,
			)}
		>
			{showIcon && Icon ? (
				<Icon className="size-3 shrink-0" aria-hidden="true" />
			) : null}
			{children}
		</span>
	);
}
