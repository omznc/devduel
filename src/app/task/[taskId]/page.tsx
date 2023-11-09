import { redirect } from 'next/navigation';
import { getTaskCached } from '@app/task/cache.ts';
import prisma from '@lib/prisma.ts';

type TaskProps = {
	params: {
		taskId: string;
	};
};
export default async function Task({ params }: TaskProps) {
	if (!params.taskId) return redirect('/');

	const task = await getTaskCached(params.taskId);

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				{task?.title}
			</div>
			<p className='rounded-lg bg-white p-4 dark:bg-black dark:text-white'>
				{task?.description}
			</p>
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
