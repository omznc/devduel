'use client';

import { useSession } from 'next-auth/react';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
	checkUsername,
	getUsernameSuggestion,
	setUsername as setRemoteUsername,
} from './actions.tsx';
import { useDebounce } from '@/src/lib/hooks.ts';
import LoadingDots from '@components/loading-dots.tsx';

type UsernameStatus = {
	ok: boolean;
	message: string;
};
export default function Page({
	params
                             }: {
	params: {
		username: string;
	}
}) {
	const [usernameStatus, setUsernameStatus] = useState<
		UsernameStatus | undefined
	>();
	const { data: session, update } = useSession();
	const user = session?.user;

	const [username, setUsername] = useState(user?.username ?? '');
	const debouncedUsername = useDebounce(username, 500);
	const [isPending, setIsPending] = useState(false);

	const enterRef = useRef<HTMLSpanElement>(null);

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
	}, [debouncedUsername]);

	useEffect(() => {
		document.addEventListener('keydown', e => {
			if (e.key === 'Enter') {
				enterRef.current?.click();
			}
		});

		if (user?.username) return;
		getUsernameSuggestion()
			.then(u => setUsername(u ?? ''))
			.catch(() => setUsername(''));

		return () => {
			document.removeEventListener('keydown', e => {
				if (e.key === 'Enter') {
					enterRef.current?.click();
				}
			});
		};
	}, []);

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
				<h2 className='fit-text bg-colored after:opacity-60 after:bg-blue-500'>
					{"let's set your username"}
				</h2>

				<div className='inline-flex w-fit transition-all duration-300 max-w-full opacity-80 dark:opacity-80 hover:opacity-100 dark:hover:opacity-100 items-center justify-center gap-1 rounded-md bg-black dark:bg-white px-4 text-2xl text-white dark:text-black transition-all md:text-4xl'>
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
						className='min-w-[50px] bg-transparent  px-2 py-2 focus:outline-none text-white dark:text-black selection:bg-white selection:text-black dark:selection:bg-black dark:selection:text-white placeholder-white dark:placeholder-black placeholder:opacity-50'
					/>
				</div>
			</div>
			<h3
				className={
					'inline-flex w-fit flex-col gap-2 text-center text-2xl md:flex-row'
				}
			>
				{isPending && (
					<span
						className={
							'cursor-pointer transition-all'
						}
					>
						[<LoadingDots />]
					</span>
				)}
				{!isPending && (
					<span>
						{usernameStatus?.message}
					</span>
				)}
				{usernameStatus?.ok && !isPending && (
					<span
						ref={enterRef}
						className={
							'cursor-pointer transition-all'
						}
						onClick={async () => {
							await setRemoteUsername(username);
							await update();
							router.push('/u/me');
						}}
					>
						{'[use]'}
					</span>
				)}
				{
					user.username && (
						<span
							className={
								'cursor-pointer transition-all'
							}
							onClick={async () => {
								router.push('/u/me');
							}}
						>
						{'[profile]'}
					</span>
					)
				}
			</h3>
		</div>
	);
}
