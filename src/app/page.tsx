import BackgroundDevDuel from '@public/background-devduel.svg';
import BackgroundLatest from '@public/background-latest.svg';
import Image from 'next/image';
import Countdown from '@components/countdown.tsx';
import { Submission } from '@prisma/client';
import Link from 'next/link';
import { getCurrentTask } from '@lib/task.ts';
import { PiEyeDuotone } from 'react-icons/pi';

export default async function Home() {
	const task = await getCurrentTask(20);

	return (
		<div className='-mt-24 flex h-full min-h-screen w-full flex-col items-center justify-center'>
			<div className='relative flex h-screen w-full flex-col items-center justify-center'>
				<div className='absolute flex h-screen w-full flex-col items-center justify-center'>
					<BackgroundDevDuel
						className='animate-path hidden h-auto w-full p-2 opacity-50 filter transition-all dark:invert md:block md:p-24'
						viewBox='0 0 1352 714'
					/>
				</div>
				<div className='pointer-events-none absolute flex h-full w-fit flex-col items-center justify-center font-bold transition-all'>
					<span className='pointer-events-auto mb-4 w-fit text-center text-lg transition-all md:text-4xl'>
						{task?.status === 'OPEN'
							? "This week's task"
							: 'Voting is open for'}
					</span>
					<span className='fit-text bg-colored pointer-events-auto w-fit text-center text-6xl transition-all after:bg-blue-500 after:opacity-50 md:after:bg-purple-500'>
						{task?.title ?? 'Coming soon'}
					</span>
					<span
						className='pointer-events-auto mt-4 w-fit gap-2 text-center text-lg transition-all md:text-4xl'
						suppressHydrationWarning
					>
						{task?.status === 'OPEN' && (
							<Countdown expires={task.endDate} />
						)}
						{task?.status === 'VOTING' && (
							<Link
								href={`/explore`}
								className='inline-flex items-center gap-2 hover:underline'
							>
								<PiEyeDuotone /> Let's explore!
							</Link>
						)}
					</span>
				</div>
			</div>
			<div className='relative flex h-screen w-full flex-col items-center justify-center'>
				<h2
					className={
						'fit-text bg-colored text-center after:bg-blue-500 after:opacity-60'
					}
				>
					{'What is DevDuel?'}
				</h2>
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
			{task?.submissions && (
				<div className='relative flex h-fit min-h-[50dvh] w-full flex-col items-center justify-center gap-4 overflow-hidden'>
					<h1 className='block text-5xl font-bold text-white md:hidden'>
						Latest
					</h1>
					<div className='z-10 flex w-fit flex-col items-start justify-center gap-4 sm:flex-row md:mt-20'>
						{task.submissions.map(submission => {
							return (
								<Card
									submission={submission}
									key={submission.id}
								/>
							);
						})}
					</div>
					<BackgroundLatest
						viewBox='0 0 1351 1112'
						className='animate-path absolute top-8 hidden h-auto w-full opacity-70 filter dark:invert md:block'
					/>
				</div>
			)}
		</div>
	);
}

type CardProps = { submission: Submission };
function Card({ submission }: CardProps) {
	return (
		<Link
			href={`/submission/${submission.id}`}
			className='group flex aspect-video w-full flex-shrink cursor-pointer flex-col items-center justify-center overflow-hidden overflow-hidden rounded-xl transition-all md:w-[300px]'
		>
			<div className='relative flex aspect-video h-fit w-full flex-col items-center justify-center object-cover'>
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
			</div>
		</Link>
	);
}
