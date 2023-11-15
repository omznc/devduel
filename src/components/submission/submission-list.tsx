import { Submission } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { PiArrowUpRightDuotone } from 'react-icons/pi';
import { cn } from '@lib/utils.ts';

type SubmissionEntryProps = {
	submission: Submission & {
		user?: {
			name: string | null;
			image: string | null;
		};
	};
	fullWidth?: boolean;
};

export function SubmissionEntry({
	submission,
	fullWidth,
}: SubmissionEntryProps) {
	return (
		<Link
			href={`/submission/${submission.id}`}
			className={cn(
				'border-normal group relative z-20 grid aspect-video h-[12rem] min-h-[12rem] snap-start items-end justify-start overflow-hidden overflow-hidden rounded-lg text-center text-gray-700 transition-all  hover:gap-2 hover:bg-gradient-to-t hover:from-black hover:to-transparent',
				{
					'w-full': fullWidth,
					'w-[20rem]': !fullWidth,
				}
			)}
		>
			<div className='absolute h-full w-full bg-transparent bg-cover bg-clip-border bg-center text-gray-700 shadow-none transition-all group-hover:scale-100'>
				<Image
					alt='submission image'
					src={submission.image}
					width={200}
					height={200}
					className='absolute h-full w-full object-cover object-center transition-all'
				/>
				<PiArrowUpRightDuotone className='absolute right-0 top-0 m-4 origin-bottom-left scale-125 text-4xl text-white opacity-0 drop-shadow-2xl transition-all group-hover:scale-100 group-hover:opacity-100' />

				<div className='absolute inset-0 h-full w-full bg-gradient-to-t from-black to-transparent opacity-50 transition-all group-hover:opacity-100' />
			</div>
			<div
				className={cn(
					'mb-4 ml-4 flex w-full flex-col items-start justify-center gap-16 transition-all',
					{
						'translate-y-[100px] group-hover:translate-y-0 group-hover:gap-2':
							submission?.user,
						'translate-y-0': !submission?.user,
					}
				)}
			>
				<div className='w-full gap-4 text-left font-sans text-xl font-bold text-white'>
					{submission.title.length > 50
						? submission.title.slice(0, 50) + '...'
						: submission.title}
				</div>
				{submission.user && (
					<div className='flex w-full items-center justify-start gap-4 '>
						<Image
							alt='user image'
							src={
								submission.user.image ??
								`https://ui-avatars.com/api/?name=${submission.user.name}`
							}
							width={50}
							height={50}
							className='relative inline-block h-[50px] w-[50px] rounded-full object-cover object-center transition-all'
						/>
						<h3 className='block font-sans text-lg font-semibold text-white antialiased'>
							{submission.user.name}
						</h3>
					</div>
				)}
			</div>
		</Link>
	);
}
