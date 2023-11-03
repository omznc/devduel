import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import prisma from '@lib/prisma.ts';

export default async function Page() {
	const session = await getServerSession(authOptions);
	const user = session?.user;
	if (!user) return redirect('/');

	async function createTask(formData: FormData) {
		'use server';

		const startDate = new Date(formData.get('startDate') as string);
		const endDate = new Date(formData.get('endDate') as string);
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		const task = await prisma.task.create({
			data: {
				startDate,
				endDate,
				title,
				description,
			},
		});
		console.log(task);
		return task;
	}

	return (
		<div className='mt-16 flex h-full min-h-screen w-full flex-col items-center justify-start'>
			<div className='flex h-full w-fit flex-col items-center justify-start gap-4 font-bold transition-all'>
				<span className='fit-text w-full text-center transition-all'>
					{'Admin Page'}
				</span>
				<span className='w-full text-center text-xl transition-all'>
					{'Create Task'}
				</span>
				<form
					action={createTask}
					className='flex w-full flex-col gap-2'
				>
					<label htmlFor='title'>{'Title'}</label>
					<input
						type='text'
						name='title'
						className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
					/>
					<label htmlFor='description'>{'Description'}</label>
					<input
						type='text'
						name='description'
						className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
					/>
					<label htmlFor='startDate'>{'Start Date'}</label>
					<input
						type='date'
						name='startDate'
						className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
					/>
					<label htmlFor='endDate'>{'End Date'}</label>
					<input
						type='date'
						name='endDate'
						className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
					/>
					<button
						type='submit'
						className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
					>
						{'Create Task'}
					</button>
				</form>
			</div>
		</div>
	);
}
