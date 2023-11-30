import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";
import Client from "@app/user/[username]/@me/client.tsx";
import { SubmissionEntry } from "@components/submission/submission-list.tsx";
import prisma from "@lib/prisma.ts";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
			<Client user={user} />
			<div className="fit-text bg-colored text-center after:bg-yellow-500">
				{`Hey ${user.name?.split(" ")[0]}!`}
			</div>
			<div className="flex w-full flex-col gap-4 md:w-fit">
				<h2 className="text-center text-3xl">{"Your Submissions"}</h2>
				<div className="flex flex-col gap-2">
					{user.submissions.map((submission) => (
						<SubmissionEntry submission={submission} key={submission.id} />
					))}
				</div>
			</div>
		</div>
	);
}
