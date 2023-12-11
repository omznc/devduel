import { RoundButton, RoundLink } from "@components/buttons.tsx";
import { getCurrentTask } from "@lib/task.ts";
import InfiniteExplore from "@app/explore/infinite-explore.tsx";
import { TaskStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";
import { getSubmissions } from "@/src/actions/submission.ts";
import ActionBar from "@components/action-bar.tsx";

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
				<ActionBar>
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
				</ActionBar>
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
