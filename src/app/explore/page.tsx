import { RoundLink } from "@components/buttons.tsx";
import { getCurrentTask } from "@lib/task.ts";
import dynamic from "next/dynamic";
import { PiCircleDashedDuotone } from "react-icons/pi";
import InfiniteExplore from "@app/explore/infinite-explore.tsx";
import prisma from "@lib/prisma.ts";

export default async function Page() {
	const task = await getCurrentTask();

	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			{task && (
				<div className="flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4">
					<RoundLink href={`/task/${task?.slug}`}>
						Task: {task?.title}
					</RoundLink>
				</div>
			)}
			{task && (
				<InfiniteExplore
					taskId={task.id}
					data={
						await prisma.submission.findMany({
							where: {
								taskId: task.id,
							},
							orderBy: {
								createdAt: "desc",
							},
							take: 10,
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
