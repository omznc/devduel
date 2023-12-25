import { deleteSubmission } from "@/src/actions/submission.ts";
import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";
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
import Image from "next/image";
import ActionBar from "@components/action-bar.tsx";
import DeleteSubmissionButton from "@components/delete-submission-button.tsx";

export default async function Page({
	params,
}: {
	params: { slug: string };
}) {
	const session = await getServerSession(authOptions);
	if (!session) return redirect("/");
	if (!session?.user?.username) return redirect("/user/me/username");

	const [submission, task] = await Promise.all([
		getSubmissionCached(params.slug, session.user.id ?? undefined),
		getCurrentTask(),
	]);
	if (!submission) return redirect("/");

	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<ActionBar>
				<RoundLink href={`/task/${submission.task.slug}`}>
					Task: {submission.task.title}
				</RoundLink>
				{submission.source && (
					<RoundLink href={submission.source}>
						<PiGitBranchDuotone />
						Source Code
					</RoundLink>
				)}
				{task?.id === submission.taskId && task.status === "OPEN" && (
					<RoundLink href={"/submit"}>
						<PiPencilDuotone />
						Edit
					</RoundLink>
				)}
				<DeleteSubmissionButton id={submission.id} />
				{submission.winner && <RoundButton>🏆 Winner</RoundButton>}
			</ActionBar>
			<div className="flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-0">
				<Link
					className="text-6xl group text-center -mb-2 pt-4 after:bg-yellow-500 hover:underline w-full py-4 px-8 rounded-md border-normal bg-white dark:bg-black"
					href={submission.website}
					target="_blank"
					rel="noopener noreferrer"
				>
					{submission.title}
					<PiArrowUpRightDuotone className="-ml-14 group-hover:ml-2 inline opacity-0 group-hover:opacity-100 transition-all duration-100" />
				</Link>
				<Markdown submission={submission} />
			</div>
			<div className="absolute w-full h-full top-0 left-0 -z-10 opacity-fade">
				<Image
					src={submission.image}
					alt={submission.title}
					width={"1000"}
					height={"500"}
					className={"w-full h-full object-cover z-[21]"}
				/>
			</div>
		</div>
	);
}
