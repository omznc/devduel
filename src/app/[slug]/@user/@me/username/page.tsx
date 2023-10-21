'use client';

import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
	checkUsername,
	getUsernameSuggestion,
	setUsername as setRemoteUsername,
} from './actions.tsx';
import { useDebounce } from '@/src/lib/hooks.ts';
import LoadingDots from '@components/loading-dots.tsx';
import { toast } from 'react-hot-toast';

type UsernameStatus = {
	ok: boolean;
	message: string;
};
export default function Page() {
	const [usernameStatus, setUsernameStatus] = useState<
		UsernameStatus | undefined
	>();
	const { data: session, update } = useSession();
	const user = session?.user;

	const [username, setUsername] = useState(user?.username ?? '');
	const debouncedUsername = useDebounce(username, 500);
	const [isPending, setIsPending] = useState(false);

	const router = useRouter();
	useEffect(() => {
		if (
			debouncedUsername.length < 3 ||
			debouncedUsername === user?.username
		) {
			setUsernameStatus(undefined);
			return;
		}

		setIsPending(true);

		checkUsername(debouncedUsername).then(exists => {
			setUsernameStatus(exists);
			setIsPending(false);
		});
	}, [debouncedUsername, user?.username]);

	useEffect(() => {
		if (user?.username) return;
		getUsernameSuggestion()
			.then(u => setUsername(u ?? ''))
			.catch(() => setUsername(''));
	}, [user?.username]);

	if (!user) {
		return redirect('/');
	}

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-center gap-4'>
			<div
				className={
					'flex w-fit max-w-full flex-col items-center gap-8 text-center'
				}
			>
				<h2 className='fit-text bg-colored after:bg-blue-500 after:opacity-60'>
					{"let's set your username"}
				</h2>

				<div className='inline-flex w-fit max-w-full items-center justify-center gap-1 rounded-md bg-black px-4 text-2xl text-white opacity-80 transition-all transition-all duration-300 hover:opacity-100 dark:bg-white dark:text-black dark:opacity-80 dark:hover:opacity-100 md:text-4xl'>
					<span>{'>'}</span>
					<input
						type='text'
						placeholder={user?.username ?? 'username'}
						value={username ?? undefined}
						onChange={async e => {
							e.target.value = e.target.value
								.replace(/\s/g, '-')
								.toLowerCase();
							e.target.value = e.target.value.replace(
								/[^a-z0-9-]/g,
								''
							);
							setUsername(e.target.value);
						}}
						className='min-w-[50px] bg-transparent  px-2 py-2 text-white placeholder-white selection:bg-white selection:text-black placeholder:opacity-50 focus:outline-none dark:text-black dark:placeholder-black dark:selection:bg-black dark:selection:text-white'
					/>
				</div>
			</div>
			<h3
				className={
					'inline-flex w-fit flex-col gap-2 text-center text-2xl md:flex-row'
				}
			>
				{isPending && (
					<span className={'cursor-pointer transition-all'}>
						[<LoadingDots />]
					</span>
				)}
				{!isPending && <span>{usernameStatus?.message}</span>}
				{usernameStatus?.ok && !isPending && (
					<span
						className={'cursor-pointer transition-all'}
						onClick={async () => {
							await toast.promise(setRemoteUsername(username), {
								loading: 'Just a moment...',
								success: () => {
									update().then(() => {
										router.push('/@me');
									});
									return `You are now ${username}!`;
								},
								error: 'Something went wrong.',
							});
						}}
					>
						{'[use]'}
					</span>
				)}
				{user.username && (
					<span
						className={'cursor-pointer transition-all'}
						onClick={async () => {
							router.push('/@me');
						}}
					>
						{'[profile]'}
					</span>
				)}
			</h3>
		</div>
	);
}
