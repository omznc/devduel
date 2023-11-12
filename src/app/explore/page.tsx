import { getCurrentTask } from '@lib/task.ts';
import prisma from '@lib/prisma.ts';
import { SubmissionEntry } from '@components/submission/submission-list.tsx';
import { RoundLink } from '@components/buttons.tsx';
import InfiniteSubmissions from '@app/explore/infinite-submissions.tsx';

export default async function Page() {
	const task = await getCurrentTask();

	const submissions =
		task &&
		(await prisma.submission.findMany({
			where: {
				taskId: task.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 10,
		}));

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			{task && (
				<div className='flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4'>
					<RoundLink href={`/task/${task?.id}`}>
						Task: {task?.title}
					</RoundLink>
				</div>
			)}
			{task && <InfiniteSubmissions taskId={task.id} />}
		</div>
	);
}
