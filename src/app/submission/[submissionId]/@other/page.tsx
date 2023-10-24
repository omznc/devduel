import { getSubmissionCached } from '@app/submission/cache.ts';
import { RoundLink } from '@components/buttons.tsx';
import { redirect } from 'next/navigation';

export default async function Profile({
	params,
}: {
	params: { submissionId: string };
}) {
	const submission = await getSubmissionCached(params.submissionId);
	if (!submission) {
		return redirect('/');
	}

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-center gap-4'>
			<RoundLink href={`/task/${submission!.taskId}`}>
				Task: {submission.task.title}
			</RoundLink>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				{submission.title}
			</div>
			<p className='rounded-lg bg-white p-4 dark:bg-black dark:text-white'>
				{submission.user.username}
			</p>
		</div>
	);
}
