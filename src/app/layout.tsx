import type { Metadata } from "next";
import { DM_Mono, Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmMono = DM_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
	weight: ["300", "400", "500"],
});

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
});

export const metadata: Metadata = {
	title: "Hue's TA Assistant",
	description: "AI-Powered Talent Acquisition Toolkit — Masan Group",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="vi" className={`${dmMono.variable} ${montserrat.variable}`}>
			<body>
				{children}
				<Toaster position="bottom-right" />
			</body>
		</html>
	);
}
