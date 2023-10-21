import prisma from '@/src/lib/prisma.ts';
import { redirect } from 'next/navigation';
import { RoundLink } from '@components/buttons.tsx';
import { PiArrowLeftDuotone } from 'react-icons/pi';

type TaskProps = {
	params: {
		slug: string;
	};
};
export default async function Task({ params }: TaskProps) {
	if (!params.slug) return redirect('/');

	const task = await prisma.task.findUnique({
		where: {
			id: params.slug,
		},
	});

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-center gap-4'>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				{task ? task.title : 'Task not found'}
			</div>
			<p className='rounded-lg bg-white p-4 dark:bg-black dark:text-white'>
				{task ? task.description : "This doesn't exist. Go back."}
			</p>
		</div>
	);
}
