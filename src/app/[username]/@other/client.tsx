'use client';

import { Submission, User } from '@prisma/client';

export default function Client({
	user,
}: {
	user: User & {
		submissions: Submission[];
	};
}) {
	return (
		<div className='inline-flex gap-2'>
			<h2>hi</h2>
		</div>
	);
}
