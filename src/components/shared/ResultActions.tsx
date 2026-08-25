"use client";

import { RotateCcw } from "lucide-react";
import CopyButton from "./CopyButton";
import GhostButton from "./GhostButton";

/**
 * The output toolbar shared by every generative tool. Was duplicated
 * verbatim across five containers, each with its own emoji and its own
 * slightly different button classes.
 */
export default function ResultActions({
	getText,
	onClear,
}: {
	getText: () => string;
	onClear: () => void;
}) {
	return (
		<>
			<CopyButton getText={getText} label="Copy nội dung" />
			<GhostButton onClick={onClear} icon={RotateCcw} tone="danger">
				Xoá kết quả
			</GhostButton>
		</>
	);
}
