'use client';

import { signOut, useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { FaAt } from 'react-icons/fa';
import { useEffect, useRef, useState, useTransition } from 'react';
import {
	checkUsername,
	getUsernameSuggestion,
	setUsername as setRemoteUsername,
} from '@app/profile/username/actions.tsx';
import { useDebounce } from '@/src/lib/hooks.ts';
import LoadingDots from '@components/loading-dots.tsx';

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
		<div className='w-full h-full gap-4 min-h-screen items-center flex flex-col justify-center'>
			<div
				className={
					'w-fit max-w-full items-center text-center flex flex-col gap-8'
				}
			>
				<h2 className='fit-text text-6xl'>
					{"let's set your username"}
				</h2>

				<div className='inline-flex w-fit dark:text-black text-white max-w-full gap-1 px-4 items-center transition-all text-2xl md:text-4xl rounded-md justify-center bg-black dark:bg-white selection:bg-white dark:selection:bg-black selection:text-black dark:selection:text-white'>
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
						className='bg-transparent min-w-[50px] px-2 py-2 focus:outline-none'
					/>
				</div>
			</div>
			<h3
				className={
					'w-fit text-2xl flex-col md:flex-row inline-flex gap-2 text-center'
				}
			>
				{isPending && (
					<span
						className={
							'cursor-pointer transition-all opacity-80 hover:opacity-100'
						}
					>
						[<LoadingDots />]
					</span>
				)}
				{!isPending && (
					<span className='opacity-80'>
						{usernameStatus?.message}
					</span>
				)}
				{usernameStatus?.ok && !isPending && (
					<span
						ref={enterRef}
						className={
							'cursor-pointer transition-all opacity-80 hover:opacity-100'
						}
						onClick={async () => {
							await setRemoteUsername(username);
							await update();
							router.push('/profile');
						}}
					>
						{'[use]'}
					</span>
				)}
				<span
					className={
						'cursor-pointer transition-all opacity-80 hover:opacity-100'
					}
					onClick={async () => {
						router.push('/profile');
					}}
				>
					{'[profile]'}
				</span>
			</h3>
		</div>
	);
}
