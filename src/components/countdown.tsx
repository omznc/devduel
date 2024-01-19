"use client";

import { TaskStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CurrentTaskProps {
	expires: Date;
	status: TaskStatus;
}

export default function Countdown({ expires, status }: CurrentTaskProps) {
	const [timeLeft, setTimeLeft] = useState(expires.getTime() - Date.now());
	const router = useRouter();

	// TODO: Test refresh
	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(expires.getTime() - Date.now());
		}, 1000);

		if (timeLeft <= 0 && status !== "OPEN") {
			toast.promise(
				(async () => {
					await new Promise((resolve) => setTimeout(resolve, 2000));
					router.refresh();
				})(),
				{
					loading: "Getting next task...",
					success: () => {
						toast.dismiss("next-task");
						return "Loaded!";
					},
					error: (e) => e?.message ?? "Error",
				},
			);
		}

		return () => clearInterval(interval);
	}, [expires]);

	const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24);
	const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
	const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
	const seconds = Math.floor((timeLeft / 1000) % 60);

	return (
		<>
			{days > 0 && `${days} day${days === 1 ? " " : "s "}`}
			{hours > 0 && `${hours} hour${hours === 1 ? " " : "s "}`}
			{minutes > 0 && `${minutes} minute${minutes === 1 ? " " : "s "}`}
			{`${seconds} second${seconds === 1 ? "" : "s"}`}
		</>
	);
}
