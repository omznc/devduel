import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { getCurrentTask } from '@lib/task.ts';
import SubmitForm from '@app/submit/submitForm.tsx';
import prisma from '@lib/prisma.ts';
import { RoundLink } from '@components/buttons.tsx';

export default async function Page() {
	const session = await getServerSession(authOptions);
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
	title = submission ? `${submission.title}` : title;

	return (
		<div className='mt-16 flex h-full min-h-screen w-full flex-col items-center justify-start'>
			<div className='flex h-full w-fit flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]'>
				{task && (
					<RoundLink href={`/task/${task.id}`}>
						Task: {task.title}
					</RoundLink>
				)}
				<span className='fit-text w-full text-center transition-all'>
					{title}
				</span>
				{task && <SubmitForm submission={submission} />}
			</div>
		</div>
	);
}
