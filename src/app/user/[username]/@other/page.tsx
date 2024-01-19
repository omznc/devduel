import { SubmissionEntry } from "@components/submission-list.tsx";
import prisma from "@lib/prisma.ts";
import { TaskStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import Image from "next/image";

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
			<div className="flex items-center justify-center gap-8 bg-colored text-center after:bg-yellow-500">
				<Image
					src={
						user.image ??
						`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.id}`
					}
					width={60}
					height={80}
					className="z-20 h-[80px] w-auto rounded-md"
					alt="user image"
				/>
				<div className="flex flex-col items-start gap-1">
					<span className="text-3xl font-bold">{user.name}</span>
					<span className="text-2xl opacity-80">@{user.username}</span>
				</div>
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
