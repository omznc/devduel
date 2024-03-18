import { getSubmissions } from "@/src/actions/submission.ts";
import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";
import InfiniteExplore from "@app/explore/infinite-explore.tsx";
import ActionBar from "@components/action-bar.tsx";
import { RoundButton, RoundLink } from "@components/buttons.tsx";
import { getCurrentTask } from "@lib/task.ts";
import { TaskStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
	const task = await getCurrentTask();
	let adminView = false;

	if (task?.status !== TaskStatus.VOTING) {
		const isAdmin = (await getServerSession(authOptions))?.user?.admin;
		if (!isAdmin) return redirect("/");
		adminView = true;
	}

	if (!task) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="flex flex-col items-center justify-center gap-4">
					<span className="fit-text w-full text-center">{"No task found"}</span>
					<RoundLink href={"/"}>{"Go home"}</RoundLink>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			{task && (
				<ActionBar>
					<RoundLink href={`/task/${task?.slug}`}>Task: {task?.title}</RoundLink>
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
			{!task && <span className="fit-text w-full text-center transition-all">{"No task yet"}</span>}
		</div>
	);
}
