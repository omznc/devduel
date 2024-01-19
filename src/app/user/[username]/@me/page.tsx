import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";
import Toolbar from "@app/user/[username]/@me/toolbar.tsx";
import { SubmissionEntry } from "@components/submission-list.tsx";
import prisma from "@lib/prisma.ts";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Profile() {
	// @ts-ignore
	const session = await getServerSession(authOptions);

	if (!session) {
		return redirect("/");
	}

	if (!session?.user?.username) {
		return redirect("/user/me/username");
	}

	const user = await prisma.user.findUnique({
		where: {
			username: session?.user?.username,
		},
		include: {
			submissions: {
				include: {
					task: true,
				},
			},
		},
	});

	if (!user?.username) {
		return redirect("/user/me/username");
	}

	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<Toolbar username={user.username} />
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
					<span className="text-2xl">@{user.username}</span>
				</div>
			</div>
			<div className="flex w-full flex-col gap-4 md:w-fit">
				<h2 className="text-center text-3xl">
					Your submissions ({user.submissions.length})
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
