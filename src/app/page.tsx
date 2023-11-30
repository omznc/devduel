import Countdown from "@components/countdown.tsx";
import { SubmissionEntry } from "@components/submission/submission-list.tsx";
import { getCurrentTask } from "@lib/task.ts";
import { Submission } from "@prisma/client";
import BackgroundDevDuel from "@public/background-devduel.svg";
import BackgroundLatest from "@public/background-latest.svg";
import Image from "next/image";
import Link from "next/link";
import { PiArrowUpRightDuotone, PiEyeDuotone } from "react-icons/pi";

export default async function Home() {
	const task = await getCurrentTask(20);

	return (
		<div className="-mt-24 flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-center">
			<div className="relative flex h-screen w-full flex-col items-center justify-center">
				<div className="absolute flex h-screen w-full flex-col items-center justify-center">
					<BackgroundDevDuel
						className="animate-path hidden h-auto w-full p-2 opacity-50 filter transition-all dark:invert md:block md:p-24"
						viewBox="0 0 1352 714"
					/>
				</div>
				<div className="pointer-events-none absolute flex h-full w-fit flex-col items-center justify-center font-bold transition-all">
					<span className="pointer-events-auto mb-4 w-fit text-center text-lg transition-all md:text-4xl">
						{task?.status === "OPEN"
							? "This week's task"
							: "Voting is open for"}
					</span>
					<span className="fit-text bg-colored pointer-events-auto w-fit text-center text-6xl transition-all after:bg-blue-500 after:opacity-50 md:after:bg-purple-500">
						{task?.title ?? "Coming soon"}
					</span>
					<span
						className="pointer-events-auto mt-4 w-fit gap-2 text-center text-lg transition-all md:text-4xl"
						suppressHydrationWarning
					>
						{task?.status === "OPEN" && (
							<Countdown
								expires={
									new Date(
										new Date().getFullYear(),
										new Date().getMonth(),
										new Date().getDate() + (5 - new Date().getDay()),
										23,
										59,
										59,
									)
								}
							/>
						)}
						{task?.status === "VOTING" && (
							<Link
								href={"/explore"}
								className="inline-flex items-center gap-2 hover:underline"
							>
								<PiEyeDuotone /> {"Let's explore!"}
							</Link>
						)}
					</span>
				</div>
			</div>
			<div className="relative flex h-screen w-full flex-col items-center justify-center">
				<h2
					className={
						"fit-text bg-colored text-center after:bg-blue-500 after:opacity-60"
					}
				>
					{"What is DevDuel?"}
				</h2>
				<div className="flex w-full max-w-4xl flex-col gap-4">
					<p className="text-center md:text-left">
						{"DevDuel is a weekly coding challenge where you compete with other" +
							" developers to create the best project that fits the task." +
							" Every monday at 00:00 UTC a new task is released, and you have until" +
							" friday at 23:59 UTC to submit your solution."}
					</p>
					<p className="text-center md:text-left">
						{"You submit your solution as a public URL to a website, and you can include the source code, among other things." +
							" After the deadline, the submissions are made public and everyone can vote on their favorite one." +
							" The voting period starts on saturday at 00:00 UTC and ends on sunday at 23:59 UTC."}
					</p>
					<p className="text-center md:text-left">
						{"After the voting period, the winner is announced, and the next task is released." +
							" The winner is decided by the number of votes, and if there is a tie, the winner is decided randomly."}
					</p>
					<p className="text-center italic md:text-left">
						<span className="font-bold">TL;DR</span>
						{
							" - You have 5 days to create a website, and 2 days to vote on your favorite. Win and get eternal glory in the leaderboard!"
						}
					</p>
				</div>
			</div>
			{task?.submissions && (
				<div className="relative flex h-fit min-h-[500px] w-full flex-col items-center justify-center gap-4 overflow-hidden">
					<h1 className="block text-5xl font-bold text-white md:hidden">
						Latest
					</h1>
					<div className="z-20 flex w-fit flex-col items-start justify-center gap-4 sm:flex-row md:mt-20">
						{task.submissions.map((submission) => {
							return (
								<SubmissionEntry submission={submission} key={submission.id} />
							);
						})}
					</div>
					<BackgroundLatest
						viewBox="0 0 1351 1112"
						className="animate-path absolute top-8 hidden h-auto w-full opacity-70 filter dark:invert md:block"
					/>
				</div>
			)}
		</div>
	);
}

type CardProps = {
	submission: Submission & {
		user?: {
			name: string | null;
			image: string | null;
		};
	};
};

function Card({ submission }: CardProps) {
	return (
		<Link
			href={`/submission/${submission.id}`}
			className="group relative grid aspect-video w-[20rem] items-end justify-start overflow-hidden overflow-hidden rounded-lg text-center text-gray-700 transition-all  hover:gap-2 hover:bg-gradient-to-t hover:from-black hover:to-transparent"
		>
			<div className="absolute h-full w-full scale-105 bg-transparent bg-cover bg-clip-border bg-center text-gray-700 shadow-none transition-all group-hover:scale-100">
				<Image
					alt="submission image"
					src={submission.image}
					width={200}
					height={200}
					className="absolute h-full w-full object-cover object-center transition-all"
				/>
				<PiArrowUpRightDuotone className="absolute right-0 top-0 m-4 text-4xl text-white opacity-0 drop-shadow-2xl transition-all group-hover:opacity-100" />

				<div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black to-transparent opacity-50 transition-all group-hover:opacity-100" />
			</div>
			<div className="mb-4 ml-4 flex w-full translate-y-[100px] flex-col items-start justify-center gap-16 transition-all group-hover:translate-y-0 group-hover:gap-2">
				<div className="w-full gap-4 text-left font-sans text-2xl font-bold text-white">
					{submission.title}
				</div>
				{submission.user && (
					<div className="flex w-full items-center justify-start gap-4 ">
						<Image
							alt="user image"
							src={
								submission.user.image ??
								`https://ui-avatars.com/api/?name=${submission.user.name}`
							}
							width={50}
							height={50}
							className="relative inline-block h-[50px] w-[50px] rounded-full object-cover object-center transition-all"
						/>
						<h3 className="block font-sans text-lg font-semibold text-white antialiased">
							{submission.user.name}
						</h3>
					</div>
				)}
			</div>
		</Link>
	);
}
