'use client';

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Page() {
	const { data: session } = useSession();
	const user = session?.user;

	if (!user) {
		return redirect('/');
	}

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
			<div className='flex h-full w-fit flex-col items-center justify-start font-bold transition-all'>
				<span className='w-full text-center text-lg transition-all md:text-4xl'>
					{"This week's task"}
				</span>
				<span className='fit-text w-full text-center text-6xl transition-all'>
					{'Create a landing page'}
				</span>
				<span
					className='mt-4 w-full gap-2 text-center text-lg transition-all md:text-4xl'
					suppressHydrationWarning
				>
					{"but you can't submit yet"}
				</span>
			</div>
		</div>
	);
}
