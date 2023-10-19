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
			<h2>hi</h2>
		</div>
	)
}