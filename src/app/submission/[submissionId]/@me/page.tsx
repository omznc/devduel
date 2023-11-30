import { deleteSubmission } from "@/src/actions/submission.ts";
import "@app/markdown.css";
import Markdown from "@app/submission/Markdown.tsx";
import { getSubmissionCached } from "@app/submission/cache.ts";
import { RoundButton, RoundLink } from "@components/buttons.tsx";
import { getCurrentTask } from "@lib/task.ts";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
	PiArrowUpRightDuotone,
	PiGitBranchDuotone,
	PiPencilDuotone,
	PiTrashDuotone,
} from "react-icons/pi";
import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";

export default async function Page({
	params,
}: {
	params: { submissionId: string };
}) {
	const session = await getServerSession(authOptions);
	if (!session) return redirect("/");
	if (!session?.user?.username) return redirect("/user/me/username");

	const [submission, task] = await Promise.all([
		getSubmissionCached(params.submissionId),
		getCurrentTask(),
	]);
	if (!submission) return redirect("/");

	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<div className="flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4">
				<RoundLink href={`/task/${submission!.taskId}`}>
					Task: {submission!.task?.title}
				</RoundLink>
				{task?.id === submission.taskId && task?.status === "OPEN" && (
					<RoundLink href={`/submit`}>
						<PiPencilDuotone />
						Edit
					</RoundLink>
				)}
				{submission.source && (
					<RoundLink href={submission.source}>
						<PiGitBranchDuotone />
						Source Code
					</RoundLink>
				)}
				<RoundButton
					onClick={async () => {
						"use server";
						await deleteSubmission(submission.id);
					}}
				>
					<PiTrashDuotone />
					Delete
				</RoundButton>
				{submission.winner && <RoundButton>🏆 Winner</RoundButton>}
			</div>
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
		</div>
	);
}
