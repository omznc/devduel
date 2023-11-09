import prisma from '@lib/prisma.ts';
import { SubmissionEntry } from '@components/submission/submission-list.tsx';

export default async function Page() {
	const winners = await prisma.submission.findMany({
		where: {
			winner: true,
		},
		include: {
			user: {
				select: {
					name: true,
					image: true,
				},
			},
		},
	});

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			<div className='flex h-full w-fit flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]'>
				<span className='fit-text w-full text-center transition-all'>
					Winners
				</span>
			</div>
			<div className='flex w-full flex-col gap-4 md:w-fit'>
				{winners.map(submission => (
					<SubmissionEntry
						submission={submission}
						key={submission.id}
					/>
				))}
			</div>
		</div>
	);
}
