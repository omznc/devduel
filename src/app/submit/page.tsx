import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { getCurrentTask } from '@lib/task.ts';
import Form from '@app/submit/form.tsx';
import prisma from '@lib/prisma.ts';
import { RoundButton, RoundLink } from '@components/buttons.tsx';
import { revalidatePath } from 'next/cache';
import {
	PiEyeDuotone,
	PiFolderDuotone,
	PiFolderPlusDuotone,
	PiPaperclipDuotone,
	PiTrashDuotone,
} from 'react-icons/pi';
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
	title = task?.status === 'VOTING' ? 'Voting is open!' : title;

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			<div className='flex h-full w-fit flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]'>
				<div className='flex w-full max-w-4xl flex-col items-center justify-center gap-4 md:flex-row'>
					<RoundLink href={`/task/${task?.id}`}>
						Task: {task?.title}
					</RoundLink>
					{task?.status === 'VOTING' && (
						<>
							{submission && (
								<RoundLink
									href={`/submission/${submission.id}`}
								>
									<PiFolderDuotone />
									{'Go to your submission'}
								</RoundLink>
							)}
							<RoundLink href={`/explore`}>
								<PiEyeDuotone />
								{'Explore'}
							</RoundLink>
						</>
					)}
				</div>
				<span className='fit-text w-full text-center transition-all'>
					{title}
				</span>
				{task?.status === 'OPEN' && (
					<Form
						submission={submission}
						key={submission?.id ?? 'submit'}
					/>
				)}
				{task?.status === 'VOTING' && (
					<p className='text-center text-xl transition-all'>
						{
							"It's the weekend! That means it's up to YOU to vote for this week's best submission."
						}
					</p>
				)}
			</div>
		</div>
	);
}
