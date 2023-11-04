'use client';

import { Submission, User } from '@prisma/client';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { RoundButton, RoundLink } from '@components/buttons.tsx';
import {
	PiAtDuotone,
	PiDoorDuotone,
	PiTagDuotone,
	PiUserCircleMinusDuotone,
} from 'react-icons/pi';
import { BiCog } from 'react-icons/bi';

export default function Client({
	user,
}: {
	user: User & {
		submissions: Submission[];
	};
}) {
	return (
		<div className='flex w-full max-w-4xl flex-col items-center justify-center gap-4 md:flex-row'>
			<RoundButton
				onClick={async () => {
					await signOut();
				}}
			>
				<PiUserCircleMinusDuotone />
				{'log out'}
			</RoundButton>

			<RoundLink href={'/user/me/username'}>
				<PiAtDuotone />
				{'set username'}
			</RoundLink>
			<RoundLink href={'/user/me/settings'}>
				<BiCog />
				{'settings'}
			</RoundLink>
		</div>
	);
}
