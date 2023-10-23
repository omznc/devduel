import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/src/lib/utils.ts';
import Link from 'next/link';

interface RoundButtonProps extends HTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	icon?: ReactNode;
	href?: string;
}

export function RoundButton(props: RoundButtonProps) {
	return (
		<button
			{...props}
			className={cn(
				'border-normal inline-flex items-center gap-1 rounded-full bg-white p-2 px-3 transition-all dark:bg-black dark:text-white',
				props.className
			)}
		>
			{props.icon}
			{props.children}
		</button>
	);
}

interface RoundLinkProps extends HTMLAttributes<HTMLAnchorElement> {
	children: ReactNode;
	href: string;
}

export function RoundLink(props: RoundLinkProps) {
	return (
		<Link
			{...props}
			href={props.href}
			className={cn(
				'border-normal inline-flex items-center gap-1 rounded-full bg-white p-2 px-3 transition-all dark:bg-black dark:text-white',
				props.className
			)}
		>
			{props.children}
		</Link>
	);
}
