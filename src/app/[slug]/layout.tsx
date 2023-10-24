import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getTaskCached } from '@app/task/cache.ts';

// @ts-ignore
export default async function Layout({
	user,
	task,
	params,
}: {
	user: ReactNode;
	task: ReactNode;
	params: {
		slug: string; //@username or @me
	};
}) {
	const slug = params.slug;
	if (!slug) return redirect('/');
	if (slug.startsWith('%40')) return user;
	const taskExists = await getTaskCached(params.slug);
	if (taskExists) return task;

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-center gap-4'>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				404
			</div>
			<p className='rounded-lg bg-white p-4 dark:bg-black dark:text-white'>
				{"I'm not sure what this page is, but it doesn't exist."}
			</p>
		</div>
	);
}
