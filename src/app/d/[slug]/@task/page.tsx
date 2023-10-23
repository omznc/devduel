import prisma from '@lib/prisma.ts';
import { redirect } from 'next/navigation';
import { getTaskCached } from '@app/d/[slug]/@task/cache.ts';

type TaskProps = {
	params: {
		slug: string;
	};
};
export default async function Task({ params }: TaskProps) {
	if (!params.slug) return redirect('/');

	const task = await getTaskCached(params.slug);
	if (!task) {
		console.log('task not found');
	}

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-center gap-4'>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				{task!.title}
			</div>
			<p className='rounded-lg bg-white p-4 dark:bg-black dark:text-white'>
				{task!.description}
			</p>
		</div>
	);
}
