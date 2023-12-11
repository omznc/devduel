import { ReactNode } from "react";
import { cn } from '@lib/utils.ts';

export default function ActionBar({ children, className }: { children: ReactNode, className?: string }) {
	return (
		<div className={
			cn("flex fly-in-from-top w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4", className)
		}>
			{children}
		</div>
	);
}
