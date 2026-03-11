"use client";

import { toast } from "sonner";

interface CopyButtonProps {
	getText: () => string;
	label?: string;
}

export default function CopyButton({
	getText,
	label = "Copy",
}: CopyButtonProps) {
	const handleCopy = () => {
		navigator.clipboard.writeText(getText()).then(() => {
			toast.success("✓ Đã copy!");
		});
	};

	return (
		<button
			onClick={handleCopy}
			className="px-3 py-1.5 rounded-[8px] text-xs font-mono border border-border-strong text-ink-2 bg-surface hover:border-ta-accent-2 hover:text-ta-accent-2 transition-all"
		>
			📋 {label}
		</button>
	);
}
