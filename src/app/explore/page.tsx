import { RoundButton, RoundLink } from "@components/buttons.tsx";
import { getCurrentTask } from "@lib/task.ts";
import dynamic from "next/dynamic";
import { PiCircleDashedDuotone } from "react-icons/pi";
import InfiniteExplore from "@app/explore/infinite-explore.tsx";
import prisma from "@lib/prisma.ts";
import { TaskStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";
import { getSubmissions } from '@/src/actions/submission.ts';

export default async function Page() {
	const task = await getCurrentTask();
	let adminView = false;

	if (task?.status !== TaskStatus.VOTING) {
		const isAdmin = (await getServerSession(authOptions))?.user?.admin;
		if (!isAdmin) return redirect("/");
		adminView = true;
	}

	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			{task && (
				<div className="flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4">
					<RoundLink href={`/task/${task?.slug}`}>
						Task: {task?.title}
					</RoundLink>
					{adminView && (
						<RoundButton
							style={{
								backgroundColor: "rgba(255, 100, 100, 0.8)",
								color: "white",
							}}
						>
							Admin View
						</RoundButton>
					)}
				</div>
			)}
			{task && (
				<InfiniteExplore
					taskId={task.id}
					data={
						await getSubmissions({
							taskId: task.id,
							take: 10,
							skip: 0,
							includeUser: true,
						})
					}
				/>
			)}
			{!task && (
				<span className="fit-text w-full text-center transition-all">
					{"No task yet"}
				</span>
			)}
		</div>
	);
}
