interface ParsedResultCardProps {
	label: string;
	fieldKey: string;
	value: string | string[] | number | null;
}

export default function ParsedResultCard({
	label,
	fieldKey,
	value,
}: ParsedResultCardProps) {
	const isEmpty = value === null || value === undefined || value === "";

	const renderValue = () => {
		if (isEmpty) {
			return (
				<span className="text-ink-3 italic text-[12px]">— không tìm thấy</span>
			);
		}

		if (fieldKey === "skills" && Array.isArray(value)) {
			return (
				<div className="flex flex-wrap gap-1.5 mt-1">
					{value.map((skill, i) => (
						<span
							key={i}
							className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-ta-accent-2/10 text-ta-accent-2 border border-ta-accent-2/30"
						>
							{skill}
						</span>
					))}
				</div>
			);
		}

		if (fieldKey === "name") {
			return (
				<span className="text-ta-accent font-semibold text-[15px] ">
					{String(value)}
				</span>
			);
		}

		return (
			<span className="text-ink text-[13px] ">
				{Array.isArray(value) ? value.join(", ") : String(value)}
			</span>
		);
	};

	return (
		<div className="bg-surface border border-border-default rounded-[10px] p-3.5">
			<p className="text-[10px] font-mono text-ink-3 uppercase tracking-[0.8px] mb-1.5">
				{label}
			</p>
			{renderValue()}
		</div>
	);
}
