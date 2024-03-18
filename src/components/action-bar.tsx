"use client";

import { cn } from "@lib/utils.ts";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type ActionBarProps = {
	children: ReactNode;
	className?: string;
};

export default function ActionBar({ children, className }: ActionBarProps) {
	const path = usePathname();
	return (
		<div
			className={cn(
				"flex fly-in-from-top w-full max-w-4xl transition-all duration-500 flex-row flex-wrap items-center justify-center gap-4",
				className,
				{
					"opacity-80 hover:opacity-100 !transition-all": !path.startsWith("/submission"),
				},
			)}
		>
			{children}
		</div>
	);
}
