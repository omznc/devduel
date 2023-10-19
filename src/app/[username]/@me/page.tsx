import prisma from '@/src/lib/prisma.ts';
import Client from '@app/[username]/@me/client.tsx';
import { redirect, usePathname } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';

export default async function Profile() {
	// @ts-ignore
	const session = await getServerSession(authOptions)

	if (!session) {
		return redirect('/');
	}

	if (!session?.user?.username){
		return redirect('/@me/username');
	}

	const user = await prisma.user.findUnique({
		where: {
			username: session?.user?.username
		},
		include: {
			submissions: true
		}
	});

	if (!user) {
		return redirect('/@me/username');
	}


	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-center gap-4'>
			<div className='fit-text text-center bg-colored after:bg-yellow-500'>
				{`Hey ${user.name?.split(" ")[0]}!`}
			</div>
			<Client user={user} />
		</div>
	)
}