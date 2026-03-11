import type { Metadata } from "next";
import {  Montserrat, Roboto_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

 
const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
});

const robotoMono = Roboto_Mono({
	subsets: ["latin"],
	variable: "--font-roboto-mono",
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700"],
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
		<html lang="vi" className={`${robotoMono.variable} ${montserrat.variable}`}>
			<body>
				{children}
				<Toaster position="bottom-right" />
			</body>
		</html>
	);
}
