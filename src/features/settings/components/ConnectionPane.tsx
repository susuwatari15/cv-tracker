import { Info, KeyRound } from "lucide-react";
import FormSection from "@/components/shared/FormSection";
import ProviderConfig from "./ProviderConfig";
import ConnectionProfiles from "./ConnectionProfiles";

/**
 * Provider / key / model, plus the saved connection profiles built from them.
 * Changes apply through the provider store immediately, so this panel has no
 * save button — one would imply the key isn't live until you press it.
 * "Saving" here means naming a profile, which is a separate action.
 */
export default function ConnectionPane() {
	return (
		<FormSection
			title="Kết nối AI"
			icon={KeyRound}
			hint="Chọn nhà cung cấp, nhập API key và model dùng cho mọi công cụ. Thay đổi có hiệu lực ngay."
		>
			<ProviderConfig />

			<div className="mt-5 border-t border-border-soft pt-5">
				<ConnectionProfiles />
			</div>

			<div className="mt-5 flex gap-2.5 rounded-lg border border-info-border bg-info-soft px-3.5 py-3">
				<Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden="true" />
				<p className="text-[12px] leading-relaxed text-ink-2">
					Key và profile được lưu trong localStorage của trình duyệt này —
					không đồng bộ sang máy khác và không nên dùng trên máy chung. Khi
					triển khai production, nên đặt key ở biến môi trường phía server để
					không lộ ra client.
				</p>
			</div>
		</FormSection>
	);
}
