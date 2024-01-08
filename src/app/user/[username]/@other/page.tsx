import { SubmissionEntry } from "@components/submission/submission-list.tsx";
import prisma from "@lib/prisma.ts";
import { redirect } from "next/navigation";
import { TaskStatus } from "@prisma/client";

export default async function Profile({
	params,
}: {
	params: { username: string };
}) {
	if (!params.username) return redirect("/");
	const user = await prisma.user.findUnique({
		where: {
			username: params?.username,
		},
		include: {
			submissions: {
				include: {
					task: true,
					user: {
						select: {
							name: true,
							image: true,
						},
					},
				},
				where: {
					task: {
						status: {
							in: [TaskStatus.CLOSED, TaskStatus.VOTING],
						},
					},
				},
			},
		},
	});
	if (!user) return redirect("/");

	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<div className="fit-text bg-colored text-center after:bg-yellow-500">
				{`This is ${user.username}`}
			</div>
			<div className="flex w-full flex-col gap-4 md:w-fit">
				<h2 className="text-center text-3xl">
					{user.submissions.length > 0 ? "Submissions" : "No submissions yet"}
				</h2>
				<div className="flex flex-wrap items-center justify-center gap-2">
					{user.submissions.map((submission) => (
						<SubmissionEntry submission={submission} key={submission.id} />
					))}
				</div>
			</div>
		</div>
	);
}
