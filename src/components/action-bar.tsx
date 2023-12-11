import { ReactNode } from 'react';

export default function ActionBar({ children }: { children: ReactNode }) {
	return (
		<div className="flex fly-in-from-top w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4">
			{children}
		</div>
		)
}