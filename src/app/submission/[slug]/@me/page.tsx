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
import { vote } from '@/src/actions/vote.ts';
import Vote from '@components/vote.tsx';
import Image from 'next/image';

export default async function Page({
	params,
}: {
	params: { slug: string };
}) {
	const session = await getServerSession(authOptions);
	if (!session) return redirect("/");
	if (!session?.user?.username) return redirect("/user/me/username");

	const [submission, task] = await Promise.all([
		getSubmissionCached(params.slug, session.user.id),
		getCurrentTask(),
	]);
	if (!submission) return redirect("/");

	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<div className="flex w-full z-30 max-w-4xl flex-row flex-wrap items-center justify-center gap-4">
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

				<RoundButton
					onClick={async () => {
						"use server";
						console.log("delete submission");
						await deleteSubmission(submission.id);
					}}
					confirmClick={true}
				>
					<PiTrashDuotone />
					Delete
				</RoundButton>
				{submission.winner && <RoundButton>🏆 Winner</RoundButton>}
			</div>
			<Link
				className="fit-text text-center z-30 after:bg-yellow-500 hover:underline"
				href={submission.website}
				target="_blank"
				rel="noopener noreferrer"
			>
				{submission.title}
				<PiArrowUpRightDuotone className="ml-2 inline" />
			</Link>
			<div className="absolute w-full h-full top-0 left-0 -z-10 opacity-fade">
				<Image src={submission.image} width={"1000"} height={"500"} className={
					'w-full h-full object-cover'
				} />
			</div>
			<Markdown submission={submission} />
		</div>
	);
}
