import { Submission, Task } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';

type SubmissionEntryProps = {
	submission: Submission & { task: Task };
};

export function SubmissionEntry({ submission }: SubmissionEntryProps) {
	return (
		<Link
			href={`/submission/${submission.id}`}
			className='border-normal flex h-fit max-h-[300px] w-auto flex-col gap-2 rounded-lg bg-black bg-opacity-5 p-4 backdrop-blur-[2px] transition-all hover:bg-opacity-20 dark:bg-white dark:bg-opacity-5 dark:hover:bg-opacity-20 md:w-[500px] md:flex-row md:gap-8'
		>
			{submission.image && (
				<Image
					src={submission.image}
					alt={submission.title}
					width={200}
					height={200}
					className='z-20 aspect-video h-auto max-h-[150px] w-full rounded-lg object-cover md:h-32 md:w-auto'
				/>
			)}
			<div className='flex flex-col gap-2 text-center md:text-left'>
				<h3 className='text-2xl  font-bold'>{submission.title}</h3>
				<p className='text-lg'>{submission.shortDescription}</p>
				{submission.winner && <p className='text-lg'>{'🏆 Winner'}</p>}
			</div>
		</Link>
	);
}
