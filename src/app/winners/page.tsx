import prisma from '@lib/prisma.ts';
import { SubmissionEntry } from '@components/submission/submission-list.tsx';
import {
	PiFolderSimpleDuotone,
	PiPersonDuotone,
	PiUserDuotone,
} from 'react-icons/pi';
import InfiniteSubmissions from '@app/winners/infinite-submissions.tsx';
import InfinitePeople from '@app/winners/infinite-people.tsx';

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
		<div className='flex h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4'>
			<div className='flex h-full w-full flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]'>
				<div className='flex h-1/2 w-full flex-col gap-4 overflow-hidden transition-all md:h-full md:flex-row lg:w-1/2'>
					<div className='flex h-full w-full flex-col items-center gap-4'>
						<h2 className='text-2xl font-bold'>
							<PiFolderSimpleDuotone className='mb-1 mr-2 inline' />
							Submissions
						</h2>
						<div className='flex h-full w-full snap-y flex-col items-center gap-4 overflow-y-scroll'>
							<InfiniteSubmissions />
						</div>
					</div>
					<div className='flex h-full w-full flex-col items-center justify-start gap-4'>
						<h2 className='text-2xl font-bold'>
							<PiUserDuotone className='mb-1 mr-2 inline' />
							People
						</h2>
						<div className='flex h-full w-full snap-y flex-col items-center justify-start gap-4 overflow-y-scroll'>
							<InfinitePeople />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
