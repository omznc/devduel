import { getWinnerUsers } from "@/src/actions/user.ts";
import InfinitePeople from "@app/winners/infinite-people.tsx";
import { PiFolderDuotone, PiUserDuotone, PiUsersDuotone } from "react-icons/pi";
import { cn } from "@lib/utils.ts";
import Link from "next/link";
import { getSubmissions } from "@/src/actions/submission.ts";
import InfiniteSubmissions from "@app/winners/infinite-submissions.tsx";
import { redirect } from 'next/navigation';

export default async function Page({
	searchParams,
}: {
	searchParams: {
		type: string;
	};
}) {

	if (!['submissions', 'people'].includes(searchParams.type)) {
		searchParams.type = 'submissions';
	}

	const [winners, submissions] = await Promise.all([
		getWinnerUsers({
			take: 10,
			skip: 0,
		}),
		getSubmissions({
			take: 10,
			skip: 0,
			includeUser: true,
			winnersOnly: true,
		}),
	]);

	return (
		<div className="flex h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<div className="flex h-full w-full flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]">
				<div
					className={`relative h-fit w-fit gap-2 border-normal group fixed left-0 top-0 rounded-full bg-white bg-opacity-25 p-1.5 opacity-100 backdrop-blur-md transition-all dark:bg-black dark:bg-opacity-25 md:p-2.5 z-30 flex h-24 w-fit items-center justify-center transition-all delay-300`}
				>
					<Link
						className={cn(
							"text-md inline-flex items-center justify-center gap-2 rounded-full px-1.5 py-1 transition-all hover:bg-black hover:bg-opacity-10 hover:dark:bg-white dark:hover:bg-opacity-10 md:px-4 md:py-2 md:text-lg",
							{
								"bg-black text-white hover:bg-opacity-100 dark:bg-white dark:text-black dark:hover:bg-opacity-100":
									searchParams.type === "submissions",
							},
						)}
						href={"?type=submissions"}
					>
						<PiFolderDuotone className="mr-1 inline" />
						{"submissions"}
					</Link>
					<Link
						className={cn(
							"text-md inline-flex items-center justify-center gap-2 rounded-full px-1.5 py-1 transition-all hover:bg-black hover:bg-opacity-10 hover:dark:bg-white dark:hover:bg-opacity-10 md:px-4 md:py-2 md:text-lg",
							{
								"bg-black text-white hover:bg-opacity-100 dark:bg-white dark:text-black dark:hover:bg-opacity-100":
									searchParams.type === "people",
							},
						)}
						href={"?type=people"}
					>
						<PiUsersDuotone className="mr-1 inline" />
						{"people"}
					</Link>
				</div>
				{searchParams.type === "people" && (
					<>
						{winners.length > 0 && (
							<div className="flex w-full flex-wrap gap-4 overflow-hidden transition-all">
								<div className="flex h-full w-full flex-col items-center justify-start gap-4">
									<InfinitePeople
										initial={[...new Array(20).fill(winners).flat()]}
									/>
								</div>
							</div>
						)}
						{winners.length === 0 && (
							<span className="fit-text w-full text-center transition-all">
								{"No winners yet"}
							</span>
						)}
					</>
				)}
				{searchParams.type === "submissions" && (
					<>
						{submissions.length > 0 && (
							<div className="flex w-full flex-wrap gap-4 overflow-hidden transition-all">
								<div className="flex h-full w-full flex-col items-center justify-start gap-4">
									<InfiniteSubmissions
										initial={[...new Array(20).fill(submissions).flat()]}
									/>
								</div>
							</div>
						)}
						{submissions.length === 0 && (
							<span className="fit-text w-full text-center transition-all">
								{"No winners yet"}
							</span>
						)}
					</>
				)}
			</div>
		</div>
	);
}
