import prisma from '@/src/lib/prisma.ts';
import Client from './client.tsx';
import { redirect } from 'next/navigation';
import { Submission } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

export default async function Profile({
	params,
}: {
	params: { username: string };
}) {
	const username = params.username?.replace('%40', '');

	if (!username) return redirect('/');
	const user = await prisma.user.findUnique({
		where: {
			username: username,
		},
		include: {
			submissions: true,
		},
	});
	if (!user) return redirect('/');

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-center gap-4'>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				this is @{user.username}
			</div>
			<div className='flex flex-col gap-4'>
				<h2 className='text-center text-3xl'>{'Submissions'}</h2>
				<div className='flex flex-col gap-2'>
					{user.submissions.map((submission: Submission) => (
						<SubmissionEntry
							submission={submission}
							key={submission.id}
						/>
					))}
				</div>
			</div>
			<Client user={user} />
		</div>
	);
}

type SubmissionEntryProps = {
	submission: Submission;
};

function SubmissionEntry({ submission }: SubmissionEntryProps) {
	return (
		<Link
			href={`/s/${submission.id}`}
			className='border-normal z-20 flex h-fit w-full flex-col gap-2 rounded-lg bg-black bg-opacity-5 p-4 backdrop-blur-[2px] transition-all hover:bg-opacity-20 dark:bg-white dark:bg-opacity-5 dark:hover:bg-opacity-20 md:w-[500px] md:flex-row md:gap-8'
		>
			{submission.image && (
				<Image
					src={submission.image}
					alt={submission.title}
					width={200}
					height={200}
					className='aspect-video h-auto w-full rounded-lg object-cover md:h-32 md:w-auto'
				/>
			)}
			<div className='flex flex-col gap-2'>
				<h3 className='text-2xl font-bold'>{submission.title}</h3>
				<p className='text-lg'>
					{submission.description?.slice(0, 100) ?? 'No description'}
				</p>
				<p className='text-lg'>{'🏆 Winner'}</p>
				{submission.winner && <p className='text-lg'>{'🏆 Winner'}</p>}
			</div>
		</Link>
	);
}
