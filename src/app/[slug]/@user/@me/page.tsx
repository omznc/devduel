import prisma from '@/src/lib/prisma.ts';
import Client from '@app/[slug]/@user/@me/client.tsx';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { Submission } from '@prisma/client';
import { SubmissionEntry } from '@components/submission/submission-list.tsx';

export default async function Profile() {
	// @ts-ignore
	const session = await getServerSession(authOptions);

	if (!session) {
		return redirect('/');
	}

	if (!session?.user?.username) {
		return redirect('/@me/username');
	}

	const user = await prisma.user.findUnique({
		where: {
			username: session?.user?.username,
		},
		include: {
			submissions: {
				include: {
					task: true,
				},
			},
		},
	});

	if (!user) {
		return redirect('/@me/username');
	}

	return (
		<div className='mt-16 flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 md:mt-0'>
			<div className='fit-text bg-colored text-center after:bg-yellow-500'>
				{`Hey ${user.name?.split(' ')[0]}!`}
			</div>
			<Client user={user} />
			<div className='flex w-full flex-col gap-4 md:w-fit'>
				<h2 className='text-center text-3xl'>{'Your Submissions'}</h2>
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
