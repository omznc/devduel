import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { getSubmissionCached } from '@app/d/[slug]/@task/cache.ts';
import { RoundLink } from '@components/buttons.tsx';
import Link from 'next/link';
import { cn } from '@lib/utils.ts';

export default async function Profile({
	params,
}: {
	params: { submissionId: string; slug: string };
}) {
	// @ts-ignore
	const session = await getServerSession(authOptions);
	if (!session) {
		return redirect('/');
	}
	if (!session?.user?.username) {
		return redirect('/@me/username');
	}

	// This will always return a submission.
	// The actual submission is checked in the layout.
	const submission = await getSubmissionCached(
		params.slug,
		params.submissionId
	);

	return (
		<div className='mt-16 flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 md:mt-0'>
			{/*<RoundLink href={`/${submission!.taskId}`}>*/}
			{/*	Task: {submission!.task?.title}*/}
			{/*</RoundLink>*/}
			<Link
				href={`/${submission!.taskId}`}
				className={
					'border-normal inline-flex items-center gap-1 rounded-full bg-white p-2 px-3 transition-all dark:bg-black dark:text-white'
				}
			>
				Task: {submission!.task?.title}
			</Link>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				{submission!.title}
			</div>
			<Link href={`/${submission!.taskId}`} prefetch={true}>
				test
			</Link>
		</div>
	);
}
