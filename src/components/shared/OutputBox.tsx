import { FileText } from "lucide-react";

interface OutputBoxProps {
	show: boolean;
	html: string;
	actions: React.ReactNode;
	/** Header label — names what the AI produced. */
	title?: string;
}

/**
 * Result panel. Given a heading and a sticky action row so the output
 * reads as a document the recruiter reviews, not raw model spill.
 */
export default function OutputBox({
	show,
	html,
	actions,
	title = "Kết quả",
}: OutputBoxProps) {
	if (!show) return null;

	return (
		<section
			className="animate-fade-up mt-4 overflow-hidden rounded-xl border border-border-default bg-surface shadow-e2"
			aria-live="polite"
		>
			<header className="flex items-center gap-2 border-b border-border-soft bg-surface-2 px-5 py-3">
				<FileText className="size-3.5 text-ink-3" aria-hidden="true" />
				<h2 className="text-[12.5px] font-semibold text-ink-2">{title}</h2>
			</header>

			<div
				className="prose-ai px-5 py-5"
				dangerouslySetInnerHTML={{ __html: html }}
			/>

			<footer className="flex flex-wrap gap-2 border-t border-border-soft bg-surface-2 px-5 py-3">
				{actions}
			</footer>
		</section>
	);
}
