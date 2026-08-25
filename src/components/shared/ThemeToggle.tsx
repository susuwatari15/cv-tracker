"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
	{ value: "light", icon: Sun, label: "Sáng" },
	{ value: "dark", icon: Moon, label: "Tối" },
	{ value: "system", icon: Monitor, label: "Theo hệ thống" },
] as const;

/**
 * Three-state theme control on the navigation rail. "System" is a real
 * option, not an implicit default, so the choice is always legible.
 */
export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	// next-themes reads the stored preference on the client only, so the
	// selected state can't be rendered until after hydration. Subscribing to
	// "am I on the client" keeps that out of an effect + setState pair.
	const mounted = useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);

	return (
		<div
			role="radiogroup"
			aria-label="Giao diện"
			className="flex items-center gap-0.5 rounded-full bg-white/5 p-0.5"
		>
			{OPTIONS.map(({ value, icon: Icon, label }) => {
				const active = mounted && theme === value;
				return (
					<button
						key={value}
						type="button"
						role="radio"
						aria-checked={active}
						aria-label={label}
						title={label}
						onClick={() => setTheme(value)}
						className={cn(
							// 44px while the rail is a drawer (touch), compact once docked.
							"flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 lg:size-7",
							active
								? "bg-white/15 text-white"
								: "text-white/50 hover:bg-white/10 hover:text-white/80",
						)}
					>
						<Icon className="size-3.5" aria-hidden="true" />
					</button>
				);
			})}
		</div>
	);
}
