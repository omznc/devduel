import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { getSubmissionCached } from '@app/submission/cache.ts';
import { RoundLink } from '@components/buttons.tsx';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function Profile({
	params,
}: {
	params: { submissionId: string };
}) {
	// @ts-ignore
	const session = await getServerSession(authOptions);
	if (!session) {
		return redirect('/');
	}
	if (!session?.user?.username) {
		return redirect('/user/@me/username');
	}

	const submission = await getSubmissionCached(params.submissionId);
	if (!submission) {
		return redirect('/');
	}

	console.log(submission);

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-center gap-4'>
			<RoundLink href={`/task/${submission!.taskId}`}>
				Task: {submission!.task?.title}
			</RoundLink>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				{submission!.title}
			</div>
			<Markdown
				remarkPlugins={[remarkGfm]}
				className='border-normal markdown w-full rounded-lg bg-white bg-opacity-10 p-4 filter backdrop-blur-sm dark:bg-black dark:bg-opacity-10 dark:text-white dark:backdrop-blur-sm
				'
			>
				{submission!.description}
			</Markdown>
		</div>
	);
}
