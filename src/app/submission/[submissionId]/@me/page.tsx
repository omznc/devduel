import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { getSubmissionCached } from '@app/submission/cache.ts';
import { RoundButton, RoundLink } from '@components/buttons.tsx';
import Client from '@app/submission/[submissionId]/@me/client.tsx';
import Link from 'next/link';

export default async function Profile({
	params,
}: {
	params: { submissionId: string };
}) {
	// @ts-ignore
	const session = await getServerSession(authOptions);

	if (!session) return redirect('/');

	if (!session?.user?.username) {
		return redirect('/user/@me/username');
	}

	const submission = await getSubmissionCached(params.submissionId);
	if (!submission) return redirect('/');

	return (
		<div className='flex  h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			<div className='flex w-full max-w-4xl flex-col items-center justify-center gap-4 md:flex-row'>
				<RoundLink href={`/task/${submission!.taskId}`}>
					Task: {submission!.task?.title}
				</RoundLink>
				{submission.source && (
					<RoundLink href={submission.source}>Source Code</RoundLink>
				)}
				{submission.winner && <RoundButton>🏆 Winner</RoundButton>}
			</div>
			<Link
				className='fit-text bg-colored text-center after:bg-yellow-500'
				href={submission.url}
				target='_blank'
				rel='noopener noreferrer'
			>
				{submission!.title}
			</Link>
			<Client submission={submission} />
		</div>
	);
}
