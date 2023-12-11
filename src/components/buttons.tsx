"use client";

import { cn } from "@/src/lib/utils.ts";
import Link from "next/link";
import { HTMLAttributes, ReactNode, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";

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
			toast.loading("Are you sure?", {
				id: "confirm",
				position: "bottom-center",
				duration: 3000,
			});
		}
	}, [confirm]);

	const { confirmClick, ...rest } = props;

	return (
		<button
			{...rest}
			onClick={(e) => {
				if (props.confirmClick && !confirm) {
					e.preventDefault();
					setConfirm(true);
					setTimeout(() => {
						setConfirm(false);
					}, 3000);
					return;
				}

				toast.dismiss("confirm");
				setConfirm(false);
				if (props.onClick) props.onClick(e);
			}}
			className={cn(
				"border-normal h-12 group inline-flex items-center gap-1 rounded-full bg-white px-2 py-2 transition-all dark:bg-black dark:text-white",
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
				"border-normal h-12 group inline-flex items-center gap-1 rounded-full bg-white px-2 py-2  transition-all dark:bg-black dark:text-white",
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
				"border-normal rounded-sm bg-white p-2 transition-all disabled:opacity-50 dark:bg-black dark:text-white",
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
