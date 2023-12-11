import "@app/markdown.css";
import { getSubmissionCached } from "@app/submission/cache.ts";
import { RoundButton, RoundLink } from "@components/buttons.tsx";
import dynamic from "next/dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PiArrowUpRightDuotone, PiCircleDashedDuotone } from "react-icons/pi";
import { TaskStatus } from "@prisma/client";
const Markdown = dynamic(() => import("@app/submission/Markdown.tsx"), {
	ssr: false,
	loading: () => (
		<div className="flex w-full items-center justify-center">
			<PiCircleDashedDuotone className="h-24 w-24 animate-spin" />
		</div>
	),
});

export default async function Page({
	params,
}: {
	params: { slug: string };
}) {
	const submission = await getSubmissionCached(params.slug);
	if (!submission) return redirect("/");

	const visible = submission.task.status === TaskStatus.VOTING || submission.task.status === TaskStatus.CLOSED;

	return (
		<div className="flex  h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<div className="flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4">
				<RoundLink href={`/task/${submission.task.slug}`}>
					Task: {submission?.task?.title}
				</RoundLink>
				<RoundLink href={`/user/${submission.user.username}`}>
					User: {submission.user?.name}
				</RoundLink>
				{visible && submission.source && (
					<RoundLink href={submission.source}>Source Code</RoundLink>
				)}
				{visible && submission.winner && <RoundButton>🏆 Winner</RoundButton>}
			</div>
			{visible && (
				<>
					<Link
						className="fit-text bg-colored text-center after:bg-yellow-500 hover:underline"
						href={submission.website}
						target="_blank"
						rel="noopener noreferrer"
					>
						{submission.title}
						<PiArrowUpRightDuotone className="ml-2 inline" />
					</Link>
					<Markdown submission={submission} />
				</>
			)}
			{!visible && (
				<div className="flex w-full items-center justify-center flex-col gap-2">
					<h2 className="fit-text bg-colored text-center after:bg-yellow-500 hover:underline">
						{"You can't see this, yet"}
					</h2>
					<p className="text-center text-2xl">
						{"Wait until the voting period opens"}
					</p>
				</div>
			)}
		</div>
	);
}
