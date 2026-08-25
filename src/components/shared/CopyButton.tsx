"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import GhostButton from "./GhostButton";

interface CopyButtonProps {
	getText: () => string;
	label?: string;
}

export default function CopyButton({
	getText,
	label = "Copy",
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(getText());
			setCopied(true);
			toast.success("Đã copy vào clipboard");
			// Confirm inline for ~2s, then return to the resting label.
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Không copy được — trình duyệt đã chặn clipboard");
		}
	};

	return (
		<GhostButton
			onClick={handleCopy}
			icon={copied ? Check : Copy}
			tone={copied ? "success" : "default"}
		>
			{copied ? "Đã copy" : label}
		</GhostButton>
	);
}
