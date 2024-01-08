"use client";

import { toast } from "sonner";
import { subscribeToNewsletter } from "@/src/actions/newsletter.ts";
import { isValidEmail } from "@lib/utils.ts";
import { useEffect, useState } from "react";

export default function SubscribeToNewsletter() {
	const [subscribed, setSubscribed] = useState(
		localStorage.getItem("subscribed") === "true",
	);

	// on enter click subscribe
	useEffect(() => {
		const onEnter = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				const button = document.getElementById("subscribe");
				if (button) button.click();
			}
		};
		document.addEventListener("keydown", onEnter);
		return () => {
			document.removeEventListener("keydown", onEnter);
		};
	}, []);

	return (
		<>
			<div className="pointer-events-auto flex items-center justify-center gap-2 mt-8">
				{!subscribed && (
					<>
						<input
							type="email"
							id="email"
							className="border-normal rounded-sm bg-white p-2 transition-all dark:bg-black dark:text-white"
							placeholder="your email"
							pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
						/>
						<button
							id={"subscribe"}
							className="border-normal rounded-sm bg-white p-2 transition-all dark:bg-black dark:text-white"
							onClick={async () => {
								const email = (
									document.getElementById("email") as HTMLInputElement
								).value;
								if (!email) {
									toast.error("Please enter an email");
									return;
								}
								if (!isValidEmail(email)) {
									toast.error("Please enter a valid email");
									return;
								}
								toast.promise(subscribeToNewsletter(email), {
									loading: "Subscribing...",
									success: () => {
										localStorage.setItem("subscribed", "true");
										setSubscribed(true);
										return "Subscribed!";
									},
									error: (e) => e?.message ?? "Something went wrong",
								});
							}}
						>
							{"notify me"}
						</button>
					</>
				)}
			</div>
			<p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
				{subscribed
					? "we'll let you know when devduel is live"
					: "you'll only get a single email when we launch"}
			</p>
		</>
	);
}
