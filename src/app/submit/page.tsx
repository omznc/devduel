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
		<div className='w-full h-full min-h-screen items-center flex flex-col justify-center'>
			<div className='transition-all font-bold w-fit h-full flex flex-col justify-start items-center'>
				<span className='md:text-4xl text-lg transition-all text-center w-full'>
					{"This week's task"}
				</span>
				<span className='fit-text text-6xl transition-all text-center w-full'>
					{'Create a landing page'}
				</span>
				<span
					className='md:text-4xl text-lg gap-2 transition-all mt-4 text-center w-full'
					suppressHydrationWarning
				>
					{"but you can't submit yet"}
				</span>
			</div>
		</div>
	);
}
