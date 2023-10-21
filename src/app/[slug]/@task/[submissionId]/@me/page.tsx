import { PiArrowLeftDuotone } from 'react-icons/pi';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { getSubmission } from '@app/[slug]/@task/[submissionId]/cache.ts';
import { RoundLink } from '@components/buttons.tsx';

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
	const submission = await getSubmission(params.slug, params.submissionId);
	const user = submission?.user;

	return (
		<div className='mt-16 flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 md:mt-0'>
			<RoundLink href={`/${submission!.taskId}`}>
				Task: {submission!.task?.title}
			</RoundLink>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				{`Hey ${user!.name?.split(' ')[0]}!`}
			</div>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				{submission!.title}
			</div>
		</div>
	);
}
