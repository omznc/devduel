import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSubmissionCached } from '@app/submission/cache.ts';
import prisma from '@lib/prisma.ts';
import { getCurrentTask } from '@lib/task.ts';

// @ts-ignore
export default async function Layout({
	me,
	other,
	params,
}: {
	me: ReactNode;
	other: ReactNode;
	params: {
		submissionId: string;
		taskId: string;
	};
}) {
	// @ts-ignore
	const session = await getServerSession(authOptions);

	if (!session || !session?.user?.username) return other;

	const submission = await getSubmissionCached(params.submissionId);
	console.log(submission);
	if (!submission) return redirect(`/task/${params.taskId}`);
	if (submission?.user?.username === session?.user?.username) return me;

	return other;
}

export async function generateStaticParams() {
	const currentTask = await getCurrentTask();
	if (!currentTask) return [];

	const posts = await prisma.submission.findMany({
		where: {
			taskId: currentTask.id,
		},
		select: {
			id: true,
		},
	});

	return posts.map(post => ({
		submissionId: post.id,
	}));
}