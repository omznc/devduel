"use client";

import { cn } from "@/src/lib/utils.ts";
import Link from "next/link";
import { HTMLAttributes, ReactNode, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

interface RoundButtonProps extends HTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	icon?: ReactNode;
	href?: string;
	confirmClick?: boolean;
}

export function RoundButton(props: RoundButtonProps) {
	const [confirm, setConfirm] = useState(false);

	useEffect(() => {
		if (confirm) {
			toast.warning("Are you sure?", {
				description: "This action cannot be undone.",
				action: {
					label: "Yes",
					onClick: () => {
						toast.dismiss("confirm");
						// @ts-ignore We're never using the actual event data. TODO: Make a non-handler function instead.
						if (props.onClick) props.onClick();
					},
				},
				cancel: {
					label: "No",
					onClick: () => {
						toast.dismiss("confirm");
					},
				},
			});
		}
	}, [confirm]);

	const { confirmClick, ...rest } = props;

	return (
		<button
			type="button"
			{...rest}
			onClick={(e) => {
				if (confirmClick && !confirm) {
					e.preventDefault();
					setConfirm(true);
					setTimeout(() => {
						setConfirm(false);
					}, 3000);
					return;
				}

				if (!confirmClick) {
					if (props.onClick) props.onClick(e);
				}
			}}
			className={cn(
				"border-normal select-none h-12 group inline-flex items-center gap-1 rounded-full bg-white px-2 py-2 transition-all dark:bg-black dark:text-white backdrop-filter backdrop-blur-lg bg-opacity-25 dark:bg-opacity-25",
				props.className,
			)}
		>
			<span className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-center transition-all group-hover:bg-black group-hover:bg-opacity-10 group-hover:dark:bg-white group-hover:dark:bg-opacity-10">
				{props.children}
			</span>
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
				"border-normal select-none h-12 group inline-flex items-center gap-1 rounded-full bg-white px-2 py-2 transition-all dark:bg-black dark:text-white backdrop-filter backdrop-blur-lg bg-opacity-25 dark:bg-opacity-25",
				props.className,
			)}
		>
			<span className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-center transition-all group-hover:bg-black group-hover:bg-opacity-10 group-hover:dark:bg-white group-hover:dark:bg-opacity-10">
				{props.children}
			</span>
		</Link>
	);
}

interface SubmitFormButtonProps extends HTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

export function SubmitFormButton(props: SubmitFormButtonProps) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			className={cn(
				"border-normal select-none rounded-sm bg-white p-2 transition-all disabled:opacity-50 dark:bg-black dark:text-white hover:brightness-95 dark:hover:brightness-150",
				props.className,
			)}
			aria-disabled={pending}
			disabled={pending}
			{...props}
		>
			{props.children}
		</button>
	);
}
