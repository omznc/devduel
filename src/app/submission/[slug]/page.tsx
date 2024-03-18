import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";
import { getSubmissionCached } from "@app/submission/cache.ts";
import { RoundButton, RoundLink } from "@components/buttons.tsx";
import { getCurrentTask } from "@lib/task.ts";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import ActionBar from "@components/action-bar.tsx";
import DeleteSubmissionButton from "@components/delete-submission-button.tsx";
import Image from "next/image";
import { PiArrowUpRightDuotone, PiGitBranchDuotone, PiPencilDuotone, PiUserDuotone } from "react-icons/pi";
import prisma from "@/src/lib/prisma";
import Markdown from "../markdown";
import { TaskStatus } from "@prisma/client";
import { Vote } from "@components/vote.tsx";

enum ViewType {
	Private = 0,
	Public = 1,
}

type PageProps = {
	params: {
		slug: string;
	};
};

export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps) {
	const session = await getServerSession(authOptions);

	const [submission, task] = await Promise.all([
		getSubmissionCached(params.slug, session?.user?.id ?? undefined),
		getCurrentTask(),
	]);
	if (!submission) return redirect("/");

	const type = submission?.user?.username === session?.user?.username ? ViewType.Private : ViewType.Public;

	const editable = task?.id === submission.taskId && task.status === "OPEN";

	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<ActionBar>
				<RoundLink href={`/task/${submission.task.slug}`}>Task: {submission.task.title}</RoundLink>

				{submission.source && (
					<RoundLink href={submission.source}>
						<PiGitBranchDuotone />
						Source Code
					</RoundLink>
				)}

				{type === ViewType.Private && (
					<>
						{editable && (
							<RoundLink href={"/submit"}>
								<PiPencilDuotone />
								Edit
							</RoundLink>
						)}
						<DeleteSubmissionButton id={submission.id} />
					</>
				)}

				{
					<RoundLink href={`/user/${submission.user.username}`}>
						<PiUserDuotone />
						{submission.user.name ?? submission.user.username}
					</RoundLink>
				}
				{submission.task.status === TaskStatus.VOTING && submission.userId !== session?.user?.id && (
					<Vote submission={submission} hasVoted={submission.votes.some((vote) => vote.userId === session?.user?.id)} />
				)}

				{submission.winner && <RoundButton>🏆 Winner</RoundButton>}
			</ActionBar>

			<div className="flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-0">
				<Link
					className="text-6xl group text-center -mb-2 pt-4 after:bg-yellow-500 hover:underline w-full py-4 px-8 rounded-md border-normal break-words whitespace-normal bg-white dark:bg-black overflow-ellipsis"
					href={submission.website}
					target="_blank"
					rel="noopener noreferrer"
				>
					{submission.title}
					<PiArrowUpRightDuotone className="-ml-14 group-hover:ml-2 inline opacity-0 group-hover:opacity-100 transition-all duration-100" />
				</Link>
				<Markdown submission={submission} />
			</div>
			<div className="absolute w-full h-full max-h-[100dvh] top-0 left-0 -z-10 opacity-fade">
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

export async function generateStaticParams() {
	const currentTask = await getCurrentTask();
	if (!currentTask) return [];

	const submissions = await prisma.submission.findMany({
		where: {
			taskId: currentTask.id,
		},
		select: {
			slug: true,
		},
		orderBy: {
			votes: {
				_count: "desc",
			},
		},
		take: 200,
	});

	return submissions.map((submission) => ({
		slug: submission.slug,
	}));
}
