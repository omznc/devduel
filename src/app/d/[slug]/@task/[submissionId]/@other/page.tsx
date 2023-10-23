import { getSubmissionCached } from '@app/d/[slug]/@task/cache.ts';
import { RoundLink } from '@components/buttons.tsx';

export default async function Profile({
	params,
}: {
	params: { submissionId: string; slug: string };
}) {
	// This will always return a submission.
	// The actual submission is checked in the layout.
	const submission = await getSubmissionCached(
		params.slug,
		params.submissionId
	);

	return (
		<div className='mt-16 flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 md:mt-0'>
			<RoundLink href={`/${submission!.taskId}`}>
				Task: {submission!.task?.title}
			</RoundLink>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				{submission!.title}
			</div>
			<p className='rounded-lg bg-white p-4 dark:bg-black dark:text-white'>
				{submission!.user?.username}
			</p>
		</div>
	);
}
