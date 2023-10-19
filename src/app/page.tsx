import BackgroundDevDuel from '@public/background-devduel.svg';
import BackgroundLatest from '@public/background-latest.svg';
import Image from 'next/image';
import Countdown from '@components/countdown.tsx';
import prisma from '@/src/lib/prisma.ts';
import { Submission, User } from '@prisma/client';
import Link from 'next/link';

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
		<div className='w-full h-full min-h-screen items-center flex flex-col justify-center'>
			<div className='relative h-screen w-full flex flex-col justify-center items-center'>
				<div className='absolute h-screen w-full flex flex-col justify-center items-center'>
					<BackgroundDevDuel
						className='animate-path opacity-50 w-full p-4 h-auto transition-all filter dark:invert'
						viewBox='0 0 1352 714'
					/>
				</div>
				<div className='absolute pointer-events-none transition-all font-bold w-fit h-full flex flex-col justify-center items-center'>
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
						<Countdown
							expires={new Date('2023-12-10T00:00:00.000Z')}
						/>
					</span>
				</div>
			</div>
			<div className='relative h-screen w-full flex flex-col justify-center items-center'>
				<h2 className='fit-text text-center'>{'What is DevDuel?'}</h2>
				<div className='flex flex-col gap-4 w-full max-w-4xl'>
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
				<div className='relative overflow-hidden min-h-[50dvh] h-fit gap-2 w-full flex flex-col justify-center items-center'>
					<h1 className='block md:hidden text-4xl font-bold text-white'>
						Latest
					</h1>
					<div className='flex mt-20 items-start z-10 justify-center gap-4 flex-wrap w-fit'>
						{latestSubmissions.map(submission => (
							<Card submission={submission} key={submission.id} />
						))}
					</div>
					<BackgroundLatest
						viewBox='0 0 1351 1112'
						className='animate-path opacity-70 w-full absolute h-auto top-8 filter dark:invert'
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
			className='cursor-pointer overflow-hidden group transition-all w-full md:w-fit flex-shrink h-fit flex flex-col justify-center items-center rounded-xl'
		>
			<div className='relative w-full object-cover md:w-fit h-fit aspect-video flex flex-col justify-center items-center'>
				{submission.image && (
					<Image
						src={submission.image}
						alt='Background'
						className='relative rounded-xl object-cover transition-all animate-fade-in w-full h-full hover:blur-sm filter group-hover:brightness-75 hover:scale-105'
						width={500}
						height={300}
					/>
				)}
				{!submission.image && (
					<div className='relative rounded-xl object-cover transition-all animate-fade-in w-full h-full hover:blur-sm filter group-hover:brightness-75 hover:scale-105 bg-gray-800' />
				)}
			</div>
			<div className='flex flex-col w-full gap-1 pointer-events-none text-center absolute opacity-0 group-hover:opacity-100 transition-all text-lg font-bold text-white'>
				<span className='w-full text-2xl'>{submission.title}</span>
				<span>@{submission.user.username}</span>
			</div>
		</Link>
	);
}
