import { cn } from "@/lib/utils";

/**
 * Shimmer placeholder. Used instead of a blocking spinner for waits over
 * ~300ms, and it reserves the final layout height so nothing shifts when
 * real content lands (CLS).
 */
export function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-canvas-2", className)}
			aria-hidden="true"
		/>
	);
}

/** Multi-line text skeleton sized like a typical AI answer. */
export function OutputSkeleton() {
	return (
		<div
			className="mt-4 space-y-3 rounded-xl border border-border-default bg-surface p-5"
			role="status"
			aria-live="polite"
			aria-label="Đang tạo nội dung"
		>
			<Skeleton className="h-4 w-2/5" />
			<Skeleton className="h-3 w-full" />
			<Skeleton className="h-3 w-11/12" />
			<Skeleton className="h-3 w-4/5" />
			<Skeleton className="h-4 w-1/3" />
			<Skeleton className="h-3 w-full" />
			<Skeleton className="h-3 w-3/4" />
			<span className="sr-only">Đang tạo nội dung, vui lòng đợi…</span>
		</div>
	);
}
