import { getTaskCached } from "@app/task/cache.ts";
import { RoundLink } from "@components/buttons.tsx";
import { SubmissionEntry } from "@components/submission-list.tsx";
import prisma from "@lib/prisma.ts";
import { TaskStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { PiEyeDuotone } from "react-icons/pi";

type TaskProps = {
	params: {
		slug: string;
	};
};
export default async function Task({ params }: TaskProps) {
	if (!params.slug) return redirect("/");

	const [task, submissions] = await Promise.all([
		getTaskCached(params.slug),
		prisma.submission.findMany({
			where: {
				task: {
					slug: params.slug,
					status: "VOTING",
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 10,
		}),
	]);

	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<div className="flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4">
				{task?.status === TaskStatus.VOTING && (
					<RoundLink href={"/explore"}>
						<PiEyeDuotone />
						Explore
					</RoundLink>
				)}
				{task?.status === TaskStatus.OPEN && <RoundLink href={"/submit"}>Add your entry</RoundLink>}
			</div>
			<div className="fit-text text-center">{task?.title}</div>
			<p className="rounded-lg text-xl">{task?.description}</p>
			{task?.status === TaskStatus.VOTING && (
				<span className="mt-8 w-full text-center text-4xl transition-all">
					{submissions.length > 0 ? "Latest submissions" : "No submissions yet"}
				</span>
			)}
			<div className="z-20 flex w-fit flex-col items-start justify-center gap-4 sm:flex-row">
				{submissions.map((submission) => (
					<SubmissionEntry submission={submission} key={submission.id} />
				))}
			</div>
		</div>
	);
}

// Generate static paths for all tasks that aren't HIDDEN
export async function generateStaticParams() {
	const tasks = await prisma.task.findMany({
		where: {
			status: {
				not: TaskStatus.HIDDEN,
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		select: {
			slug: true,
		},
	});

	return tasks.map((task) => ({ slug: task.slug }));
}
