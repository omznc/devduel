'use client';

import { Submission, User } from '@prisma/client';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function Client({ user }: {
	user: User & {
		submissions: Submission[]
	}
}) {
	return (
		<div className='inline-flex gap-2'>
				<span
					className={
						'cursor-pointer text-2xl transition-all hover:opacity-100'
					}
					onClick={async () => {
						await signOut();
					}}
				>
					{'[log out]'}
				</span>

			<Link
				className={
					'cursor-pointer text-2xl transition-all hover:opacity-100'
				}
				href={'/@me/username'}
			>
				{'[set username]'}
			</Link>
		</div>
	)
}