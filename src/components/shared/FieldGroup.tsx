interface FieldGroupProps {
	label: string;
	required?: boolean;
	children: React.ReactNode;
}

export default function FieldGroup({
	label,
	required,
	children,
}: FieldGroupProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className="text-[11px] font-mono text-ink-3 uppercase tracking-[0.8px]">
				{label}
				{required && " *"}
			</label>
			{children}
		</div>
	);
}
