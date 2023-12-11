import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";
import { getSubmissionCached } from "@app/submission/cache.ts";
import prisma from "@lib/prisma.ts";
import { getCurrentTask } from "@lib/task.ts";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({
	me,
	other,
	params,
}: {
	me: ReactNode;
	other: ReactNode;
	params: {
		slug: string;
	};
}) {
	const session = await getServerSession(authOptions);

	if (!session || !session?.user?.username) return <>{other}</>;

	const submission = await getSubmissionCached(params.slug);
	if (!submission) return redirect("/");

	if (submission?.user?.username === session?.user?.username) return <>{me}</>;

	return <>{other}</>;
}

export async function generateStaticParams() {
	const currentTask = await getCurrentTask();
	if (!currentTask) return [];

	const submissions = await prisma.submission.findMany({
		where: {
			taskId: currentTask.id,
		},
		select: {
			slug: true,
		},
		orderBy: {
			votes: {
				_count: "desc",
			},
		},
		take: 200,
	});

	return submissions.map((submission) => ({
		slug: submission.slug,
	}));
}
