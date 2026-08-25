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
	const isEmpty =
		value === null || value === undefined || value === "" ||
		(Array.isArray(value) && value.length === 0);

	const renderValue = () => {
		if (isEmpty) {
			return (
				<span className="text-[12.5px] italic text-ink-4">
					Không tìm thấy trong CV
				</span>
			);
		}

		if (Array.isArray(value)) {
			return (
				<span className="flex flex-wrap gap-1.5">
					{value.map((item, i) => (
						<span
							key={i}
							className="rounded-full border border-border-default bg-canvas-2 px-2 py-0.5 text-[11.5px] font-medium text-ink-2"
						>
							{item}
						</span>
					))}
				</span>
			);
		}

		if (fieldKey === "name") {
			return (
				<span className="text-[15px] font-bold leading-snug text-ink">
					{String(value)}
				</span>
			);
		}

		// Contact and numeric fields get tabular figures so columns line up.
		const isData = ["phone", "email", "years_exp", "expected_salary"].includes(
			fieldKey,
		);
		return (
			<span
				className={`text-[13px] leading-snug text-ink ${isData ? "tabular" : ""}`}
			>
				{String(value)}
			</span>
		);
	};

	return (
		<div className="rounded-lg border border-border-default bg-surface p-3">
			<dt className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-3">
				{label}
			</dt>
			<dd className="block">{renderValue()}</dd>
		</div>
	);
}
