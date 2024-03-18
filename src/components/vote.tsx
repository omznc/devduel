"use client";

import { unvote, vote } from "@/src/actions/vote.ts";
import { RoundButton } from "@components/buttons.tsx";
import { cn } from "@lib/utils.ts";
import type { Submission } from "@prisma/client";
import { useState } from "react";
import { PiArrowUpDuotone, PiXCircleDuotone } from "react-icons/pi";
import { toast } from "sonner";

export function Vote({
	submission,
	hasVoted,
}: {
	submission: Submission;
	hasVoted: boolean;
}) {
	const [voted, setVoted] = useState(hasVoted);

	return (
		<RoundButton
			onClick={async () => {
				if (!voted) {
					setVoted(true);
					await vote(submission.id).catch((e) => {
						setVoted(false);
						toast.error(e.message ?? "Error");
					});
				} else {
					setVoted(false);
					await unvote(submission.id).catch((e) => {
						setVoted(true);
						toast.error(e.message ?? "Error");
					});
				}
			}}
			className={cn("transition-all whitespace-nowrap overflow-hidden", {
				"w-[165px]": voted,
				"w-[100px]": !voted,
			})}
		>
			{voted ? <PiXCircleDuotone /> : <PiArrowUpDuotone />}
			{voted ? "Remove Vote" : "Vote"}
		</RoundButton>
	);
}
