import { getCurrentTask } from '@lib/task.ts';

export default async function Page() {
	const task = await getCurrentTask();
	const title = task
		? task.status === 'VOTING'
			? 'Voting is open!'
			: `Ready? Let's go.`
		: 'No task yet.';

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			<div className='flex h-full w-fit flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]'>
				<span className='fit-text w-full text-center transition-all'>
					{title}
				</span>
			</div>
		</div>
	);
}
