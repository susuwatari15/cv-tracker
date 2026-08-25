import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/components/shared/ThemeProvider";
import "./globals.css";

/**
 * Plus Jakarta Sans — enterprise-SaaS legibility at the 12–15px sizes this
 * app actually renders at, with full Vietnamese diacritic coverage.
 * Weights are deliberately limited to the four the design system uses.
 */
const jakarta = Plus_Jakarta_Sans({
	subsets: ["latin", "latin-ext", "vietnamese"],
	variable: "--font-jakarta",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

/** Mono is reserved for machine data: API keys, model ids, field keys. */
const mono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono-face",
	display: "swap",
	weight: ["400", "500"],
});

export const metadata: Metadata = {
	title: "TA Assistant — Talent Acquisition Toolkit",
	description:
		"Bộ công cụ AI cho tuyển dụng: sàng lọc CV, soạn JD, đánh giá ứng viên, benchmark lương.",
	applicationName: "TA Assistant",
	manifest: "/site.webmanifest",
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
			{ url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
		],
		apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
		{ media: "(prefers-color-scheme: dark)", color: "#0a1018" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="vi"
			className={`${jakarta.variable} ${mono.variable}`}
			suppressHydrationWarning
		>
			<body>
				<ThemeProvider>
					{children}
					{/* Clears the floating assistant button in the same corner. */}
					<Toaster
						position="bottom-right"
						offset={{ bottom: 80, right: 16 }}
						mobileOffset={{ bottom: 80, right: 16 }}
					/>
				</ThemeProvider>
			</body>
		</html>
	);
}
