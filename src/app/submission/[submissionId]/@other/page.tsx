import { getSubmissionCached } from '@app/submission/cache.ts';
import { RoundButton, RoundLink } from '@components/buttons.tsx';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import '@app/markdown.css';
import Markdown from '@app/submission/Markdown.tsx';
import { PiArrowUpRightDuotone } from 'react-icons/pi';

export default async function Page({
	params,
}: {
	params: { submissionId: string };
}) {
	const submission = await getSubmissionCached(params.submissionId);
	if (!submission) return redirect('/');

	return (
		<div className='flex  h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			<div className='flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4'>
				<RoundLink href={`/task/${submission.taskId}`}>
					Task: {submission!.task?.title}
				</RoundLink>
				<RoundLink href={`/user/${submission.user.username}`}>
					User: {submission.user?.name}
				</RoundLink>
				{submission.source && (
					<RoundLink href={submission.source}>Source Code</RoundLink>
				)}
				{submission.winner && <RoundButton>🏆 Winner</RoundButton>}
			</div>
			<Link
				className='fit-text bg-colored text-center after:bg-yellow-500 hover:underline'
				href={submission.website}
				target='_blank'
				rel='noopener noreferrer'
			>
				{submission.title}
				<PiArrowUpRightDuotone className='ml-2 inline' />
			</Link>
			<Markdown submission={submission} />
		</div>
	);
}
