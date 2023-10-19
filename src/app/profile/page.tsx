'use client';

import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
	const { data: session } = useSession();
	const user = session?.user;

	if (!user) {
		return redirect('/');
	}

	if (!user.username) {
		return redirect('/profile/username');
	}

	return (
		<div className='w-full h-full min-h-screen gap-4 items-center flex flex-col justify-center'>
			<div className='fit-text text-6xl text-center'>
				{`Hello there ${user.name?.split(' ')[0]}, let's duel!`}
			</div>
			<div className='inline-flex gap-2'>
				<span
					className={
						'cursor-pointer text-2xl transition-all opacity-80 hover:opacity-100'
					}
					onClick={async () => {
						await signOut();
					}}
				>
					{'[log out]'}
				</span>

				<Link
					className={
						'cursor-pointer text-2xl transition-all opacity-80 hover:opacity-100'
					}
					href={'/profile/username'}
				>
					{'[set username]'}
				</Link>
			</div>
		</div>
	);
}
