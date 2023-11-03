import { getSubmissionCached } from '@app/submission/cache.ts';
import { RoundButton, RoundLink } from '@components/buttons.tsx';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Client from '@app/submission/[submissionId]/@me/client.tsx';

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
		<div className='flex  h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			<div className='flex w-full max-w-4xl flex-col items-center justify-center gap-4 md:flex-row'>
				<RoundLink href={`/task/${submission.taskId}`}>
					Task: {submission!.task?.title}
				</RoundLink>
				<RoundLink href={`/user/${submission.userId}`}>
					User: {submission.user?.name}
				</RoundLink>
				{submission.source && (
					<RoundLink href={submission.source}>Source Code</RoundLink>
				)}
				{submission.winner && <RoundButton>🏆 Winner</RoundButton>}
			</div>
			<Link
				className='fit-text bg-colored text-center after:bg-yellow-500'
				href={submission.website}
				target='_blank'
				rel='noopener noreferrer'
			>
				{submission!.title}
			</Link>
			<Client submission={submission} />
		</div>
	);
}
