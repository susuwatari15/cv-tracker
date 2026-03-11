import { Input } from "@/components/ui/input";
import ApiStatusDot from "@/components/shared/ApiStatusDot";

interface ApiKeyFieldProps {
	value: string;
	status: "empty" | "valid" | "invalid";
	onChange: (value: string) => void;
}

export default function ApiKeyField({
	value,
	status,
	onChange,
}: ApiKeyFieldProps) {
	return (
		<div className="flex items-center gap-3">
			<ApiStatusDot status={status} />
			<Input
				type="password"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="sk-ant-api03-..."
				className="flex-1 font-mono text-[13px]"
			/>
		</div>
	);
}
