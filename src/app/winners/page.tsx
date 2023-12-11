import { getWinnerUsers } from "@/src/actions/user.ts";
import InfinitePeople from "@app/winners/infinite-people.tsx";
import { PiFolderDuotone, PiUsersDuotone } from "react-icons/pi";
import { cn } from "@lib/utils.ts";
import Link from "next/link";
import { getSubmissions } from "@/src/actions/submission.ts";
import InfiniteSubmissions from "@app/winners/infinite-submissions.tsx";
import ActionBar from "@components/action-bar.tsx";
import { RoundLink } from "@components/buttons.tsx";

export default async function Page({
	searchParams,
}: {
	searchParams: {
		type: string;
	};
}) {
	if (!["submissions", "people"].includes(searchParams.type)) {
		searchParams.type = "submissions";
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
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<div className="flex h-full w-full flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]">
				<ActionBar>
					<div className="flex bg-white dark:bg-black p-1.5 border-normal w-fit rounded-full max-w-4xl flex-row flex-wrap items-center justify-center gap-1">
						<RoundLink
							href={`/winners?type=submissions`}
							className={cn({
								"bg-black text-white dark:bg-white dark:text-black":
									searchParams.type === "submissions",
							})}
						>
							<PiFolderDuotone />
							{"Submissions"}
						</RoundLink>
						<RoundLink
							href={`/winners?type=people`}
							className={cn({
								"bg-black text-white dark:bg-white dark:text-black":
									searchParams.type === "people",
							})}
						>
							<PiUsersDuotone />
							{"People"}
						</RoundLink>
					</div>
				</ActionBar>
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
