import { useId } from "react";

interface FieldGroupProps {
	label: string;
	required?: boolean;
	/** Persistent guidance — survives typing, unlike a placeholder. */
	hint?: string;
	/** Validation message; rendered below the field and announced. */
	error?: string;
	children: React.ReactNode;
}

/**
 * Wraps one field with a real <label>, persistent helper text and an
 * error slot. The label is a visible sentence-case label rather than the
 * uppercase monospace it replaced — mono at 11px reads as a terminal
 * readout, not a form an HR lead fills in daily.
 *
 * `children` receives `id` + `aria-describedby` via cloning at the call
 * site is avoided: instead the label wraps the control, which associates
 * them without needing ids threaded through every form component.
 */
export default function FieldGroup({
	label,
	required,
	hint,
	error,
	children,
}: FieldGroupProps) {
	const hintId = useId();

	return (
		<div className="flex flex-col gap-1.5">
			<label className="flex flex-col gap-1.5 text-[12.5px] font-medium text-ink-2">
				<span className="flex items-center gap-1">
					{label}
					{required ? (
						<span className="text-danger" aria-label="bắt buộc">
							*
						</span>
					) : null}
				</span>
				<span
					className="font-normal text-ink"
					aria-describedby={hint ? hintId : undefined}
				>
					{children}
				</span>
			</label>

			{hint && !error ? (
				<p id={hintId} className="text-[11.5px] leading-snug text-ink-3">
					{hint}
				</p>
			) : null}

			{error ? (
				<p
					role="alert"
					className="flex items-start gap-1 text-[11.5px] font-medium leading-snug text-danger"
				>
					{error}
				</p>
			) : null}
		</div>
	);
}
