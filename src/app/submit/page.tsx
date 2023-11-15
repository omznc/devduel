import { redirect } from 'next/navigation';
import { getCurrentTask } from '@lib/task.ts';
import Form from '@app/submit/form.tsx';
import prisma from '@lib/prisma.ts';
import { RoundButton, RoundLink } from '@components/buttons.tsx';
import { PiEyeDuotone, PiFolderDuotone, PiTrashDuotone } from 'react-icons/pi';
import { isAuthorized } from '@lib/server-utils.ts';
import { deleteSubmission } from '@/src/actions/submission.ts';
import { SubmissionEntry } from '@components/submission/submission-list.tsx';

export default async function Page() {
	const session = await isAuthorized(true);
	const user = session?.user;
	if (!user) return redirect('/');

	const task = await getCurrentTask();
	const submission =
		task &&
		(await prisma.submission.findFirst({
			where: {
				taskId: task.id,
				userId: user.id,
			},
		}));

	let title = task ? `Ready? Let's go.` : 'No task yet.';
	title = submission ? `Edit` : title;
	title = task?.status === 'VOTING' ? 'Voting is open!' : title;

	return (
		<div className='flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4'>
			<div className='flex h-full w-fit max-w-4xl flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]'>
				<div className='flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4'>
					<RoundLink href={`/task/${task?.id}`}>
						Task: {task?.title}
					</RoundLink>
					{task?.status === 'VOTING' && (
						<RoundLink href={`/explore`}>
							<PiEyeDuotone />
							{'Explore'}
						</RoundLink>
					)}
					{submission && (
						<>
							<RoundButton>
								<form
									action={async () => {
										'use server';
										await deleteSubmission(submission.id);
									}}
								>
									<button
										type='submit'
										className='inline-flex items-center gap-2'
									>
										<PiTrashDuotone />
										Delete your submission
									</button>
								</form>
							</RoundButton>
						</>
					)}
				</div>
				<span className='fit-text w-full text-center transition-all'>
					{title}
				</span>
				{task?.status === 'OPEN' && (
					<Form
						submission={submission}
						key={submission?.id ?? 'submit'}
					/>
				)}
				{task?.status === 'VOTING' && (
					<>
						<p className='text-center text-xl transition-all'>
							{
								"It's the weekend! That means it's up to YOU to vote for this week's best submission."
							}
						</p>

						{submission && (
							<>
								<span className='w-full text-center text-4xl transition-all'>
									Your submission
								</span>
								<SubmissionEntry submission={submission} />
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
