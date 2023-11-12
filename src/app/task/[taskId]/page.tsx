import { redirect } from 'next/navigation';
import { getTaskCached } from '@app/task/cache.ts';
import prisma from '@lib/prisma.ts';
import { SubmissionEntry } from '@components/submission/submission-list.tsx';
import { RoundLink } from '@components/buttons.tsx';
import { PiEyeDuotone } from 'react-icons/pi';

type TaskProps = {
	params: {
		taskId: string;
	};
};
export default async function Task({ params }: TaskProps) {
	if (!params.taskId) return redirect('/');

	const [task, submissions] = await Promise.all([
		getTaskCached(params.taskId),
		prisma.submission.findMany({
			where: {
				taskId: params.taskId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 10,
		}),
	]);

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			<div className='flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4'>
				<RoundLink href={`/explore`}>
					<PiEyeDuotone />
					Explore
				</RoundLink>
			</div>
			<div className='fit-text text-center'>{task?.title}</div>
			<p className='rounded-lg text-xl'>{task?.description}</p>
			<span className='mt-8 w-full text-center text-4xl transition-all'>
				Latest submissions
			</span>
			<div className='z-20 flex w-fit flex-col items-start justify-center gap-4 sm:flex-row'>
				{submissions.map(submission => {
					return (
						<SubmissionEntry
							submission={submission}
							key={submission.id}
						/>
					);
				})}
			</div>
		</div>
	);
}

export async function generateStaticParams() {
	const latestTasks = await prisma.task.findMany({
		take: 40,
		select: {
			id: true,
		},
		orderBy: {
			endDate: 'desc',
		},
	});

	return latestTasks.map(task => ({
		taskId: task.id,
	}));
}
