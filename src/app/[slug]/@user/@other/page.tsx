import prisma from '@/src/lib/prisma.ts';
import Client from './client.tsx';
import { redirect } from 'next/navigation';
import { SubmissionEntry } from '@components/submission/submission-list.tsx';

export default async function Profile({
	params,
}: {
	params: { slug: string };
}) {
	const username = params.slug?.replace('%40', '');

	if (!username) return redirect('/');
	const user = await prisma.user.findUnique({
		where: {
			username: username,
		},
		include: {
			submissions: {
				include: {
					task: true,
				},
			},
		},
	});
	if (!user) return redirect('/');

	return (
		<div className='mt-16 flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 md:mt-0'>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				this is @{user.username}
			</div>
			<Client user={user} />
			<div className='flex w-full flex-col gap-4'>
				<h2 className='text-center text-3xl'>{'Submissions'}</h2>
				<div className='flex flex-col gap-2'>
					{user.submissions.map(submission => (
						<SubmissionEntry
							submission={submission}
							key={submission.id}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
