import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { getCurrentTask } from '@lib/task.ts';
import Form from '@app/submit/form.tsx';
import prisma from '@lib/prisma.ts';
import { RoundButton, RoundLink } from '@components/buttons.tsx';
import { revalidatePath } from 'next/cache';
import { PiTrashDuotone } from 'react-icons/pi';
import { isAuthorized } from '@lib/server-utils.ts';

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
	title = submission ? `${submission.title}` : title;

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			<div className='flex h-full w-fit flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]'>
				<div className='flex w-full max-w-4xl flex-col items-center justify-center gap-4 md:flex-row'>
					<RoundLink href={`/task/${task?.id}`}>
						Task: {task?.title}
					</RoundLink>
					<RoundButton>
						<form
							action={async () => {
								'use server';
								const deleted = await prisma.submission.delete({
									where: {
										id: submission?.id,
									},
								});
								if (deleted) {
									revalidatePath('/submit');
									redirect('/submit');
								}
							}}
						>
							<button
								type='submit'
								className='inline-flex items-center gap-2'
							>
								<PiTrashDuotone />
								Delete
							</button>
						</form>
					</RoundButton>
				</div>
				<span className='fit-text w-full text-center transition-all'>
					{title}
				</span>
				{task && (
					<Form
						submission={submission}
						key={submission?.id ?? 'submit'}
					/>
				)}
			</div>
		</div>
	);
}
