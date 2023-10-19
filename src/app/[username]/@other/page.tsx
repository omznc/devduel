import prisma from '@/src/lib/prisma.ts';
import Client from './client.tsx';
import { redirect } from 'next/navigation';
import { Submission } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

export default async function Profile({ params }: {params: {username: string}}) {
	const username = params.username?.replace("%40", "")

	if (!username) return redirect('/')
	const user = await prisma.user.findUnique({
		where: {
			username: username
		},
		include: {
			submissions: true
		}
	});
	if (!user) return redirect('/');


	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-center gap-4'>
			<div className='fit-text text-center bg-colored after:bg-yellow-500'>
				this is @{user.username}
			</div>
			<div className='flex flex-col gap-4'>
				<h2 className='text-3xl text-center'>
					{'Submissions'}
				</h2>
				<div className='flex flex-col gap-2'>
					{user.submissions.map((submission: Submission) => (
						<SubmissionEntry submission={submission} key={submission.id} />
					))}
				</div>
			</div>
			<Client user={user} />
		</div>
	)
}


type SubmissionEntryProps = {
	submission: Submission
}
function SubmissionEntry({submission}: SubmissionEntryProps) {
	return (
		<Link
			href={`/s/${submission.id}`}
			className='flex md:flex-row flex-col gap-2 md:gap-8 w-full md:w-[500px] z-20 border-normal backdrop-blur-[2px] transition-all dark:bg-opacity-5 dark:hover:bg-opacity-20 hover:bg-opacity-20 bg-black dark:bg-white bg-opacity-5 h-fit p-4 rounded-lg'>
				{submission.image && <Image src={submission.image} alt={submission.title} width={200} height={200} className='rounded-lg h-auto md:h-32 md:w-auto w-full aspect-video object-cover' />}
				<div className='flex flex-col gap-2'>
					<h3 className='text-2xl font-bold'>{submission.title}</h3>
					<p className='text-lg'>{submission.description?.slice(0, 100) ?? 'No description'}</p>
					<p className='text-lg'>{'🏆 Winner'}</p>
					{
						submission.winner && <p className='text-lg'>{'🏆 Winner'}</p>
					}
				</div>
		</Link>
	)
}