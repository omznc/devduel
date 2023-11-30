import InfiniteExplore from "@app/explore/infinite-explore.tsx";
import { RoundLink } from "@components/buttons.tsx";
import { getCurrentTask } from "@lib/task.ts";

export default async function Page() {
	const task = await getCurrentTask();

	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			{task && (
				<div className="flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4">
					<RoundLink href={`/task/${task?.id}`}>Task: {task?.title}</RoundLink>
				</div>
			)}
			{task && <InfiniteExplore taskId={task.id} />}
		</div>
	);
}
