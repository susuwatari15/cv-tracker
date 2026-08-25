"use client";

import StoreInitializer from "./StoreInitializer";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import AIChatPanel from "./AIChatPanel";

export default function AppShell() {
	return (
		<>
			<StoreInitializer />

			{/* Keyboard users shouldn't have to tab the whole nav to reach content */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ta-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ta-accent-fg"
			>
				Bỏ qua điều hướng
			</a>

			{/* dvh, not vh — mobile browser chrome makes 100vh overflow */}
			<div className="flex h-dvh overflow-hidden">
				<Sidebar />
				<ContentArea />
				<AIChatPanel />
			</div>
		</>
	);
}
