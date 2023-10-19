import BackgroundDevDuel from '@public/background-devduel.svg';
import BackgroundLatest from '@public/background-latest.svg';
import Image from 'next/image';
import Countdown from '@components/countdown.tsx';
import prisma from '@/src/lib/prisma.ts';
import { Submission, User } from '@prisma/client';
import Link from 'next/link';
import { cn } from '@/src/lib/utils.ts';

export default async function Home() {
	const latestSubmissions = await prisma.submission.findMany({
		take: 10,
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			user: true,
		},
	});

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
			<div className='relative flex h-screen w-full flex-col items-center justify-center'>
				<div className='absolute flex h-screen w-full flex-col items-center justify-center'>
					<BackgroundDevDuel
						className='animate-path h-auto w-full p-2 md:p-24 opacity-50 filter transition-all dark:invert'
						viewBox='0 0 1352 714'
					/>
				</div>
				<div className='pointer-events-none absolute flex h-full w-fit flex-col items-center justify-center font-bold transition-all'>
					<span className='pointer-events-auto w-fit text-center text-lg transition-all md:text-4xl'>
						{"This week's task"}
					</span>
					<span className='pointer-events-auto  fit-text w-fit text-center text-6xl transition-all'>
						{'Create a landing page'}
					</span>
					<span
						className='pointer-events-auto  mt-4 w-fit gap-2 text-center text-lg transition-all md:text-4xl'
						suppressHydrationWarning
					>
						<Countdown
							expires={new Date('2023-12-10T00:00:00.000Z')}
						/>
					</span>
				</div>
			</div>
			<div className='relative flex h-screen w-full flex-col items-center justify-center'>
				<h2 className={'fit-text text-center bg-colored after:opacity-60 after:bg-blue-500'}>{'What is DevDuel?'}</h2>
				<div className='flex w-full max-w-4xl flex-col gap-4'>
					<p className='text-center md:text-left'>
						{'DevDuel is a weekly coding challenge where you compete with other' +
							' developers to create the best project that fits the task.' +
							' Every monday at 00:00 UTC a new task is released, and you have until' +
							' friday at 23:59 UTC to submit your solution.'}
					</p>
					<p className='text-center md:text-left'>
						{'You submit your solution as a public URL to a website, and you can include the source code, among other things.' +
							' After the deadline, the submissions are made public and everyone can vote on their favorite one.' +
							' The voting period starts on saturday at 00:00 UTC and ends on sunday at 23:59 UTC.'}
					</p>
					<p className='text-center md:text-left'>
						{'After the voting period, the winner is announced, and the next task is released.' +
							' The winner is decided by the number of votes, and if there is a tie, the winner is decided randomly.'}
					</p>
					<p className='text-center italic md:text-left'>
						<span className='font-bold'>TL;DR</span>
						{
							' - You have 5 days to create a website, and 2 days to vote on your favorite. Win and get eternal glory in the leaderboard!'
						}
					</p>
				</div>
			</div>
			{latestSubmissions.length > 0 && (
				<div className='relative flex h-fit min-h-[50dvh] w-full flex-col items-center justify-center gap-2 overflow-hidden'>
					<h1 className='block text-4xl font-bold text-white md:hidden'>
						Latest
					</h1>
					<div className='z-10 mt-20 flex w-fit flex-wrap items-start justify-center gap-4'>
						{latestSubmissions.map(submission => (
							<Card submission={submission} key={submission.id} />
						))}
					</div>
					<BackgroundLatest
						viewBox='0 0 1351 1112'
						className='animate-path absolute top-8 h-auto w-full opacity-70 filter dark:invert'
					/>
				</div>
			)}
		</div>
	);
}

function Card({ submission }: { submission: Submission & { user: User } }) {
	return (
		<Link
			href={`/submission/${submission.id}`}
			className='group flex h-fit w-full flex-shrink cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl transition-all md:w-fit'
		>
			<div className='relative flex aspect-video h-fit w-full flex-col items-center justify-center object-cover md:w-fit'>
				{submission.image && (
					<Image
						src={submission.image}
						alt='Background'
						className='relative h-full w-full animate-fade-in rounded-xl object-cover filter transition-all hover:scale-105 hover:blur-sm group-hover:brightness-75'
						width={500}
						height={300}
					/>
				)}
				{!submission.image && (
					<div className='relative h-full w-full animate-fade-in rounded-xl bg-gray-800 object-cover filter transition-all hover:scale-105 hover:blur-sm group-hover:brightness-75' />
				)}
			</div>
			<div className='pointer-events-none absolute flex w-full flex-col gap-1 text-center text-lg font-bold text-white opacity-0 transition-all group-hover:opacity-100'>
				<span className='w-full text-2xl'>{submission.title}</span>
				<span>@{submission.user.username}</span>
			</div>
		</Link>
	);
}