import { getSubmissions } from "@/src/actions/submission.ts";
import { getWinners } from "@/src/actions/user.ts";
import InfinitePeople from "@app/winners/infinite-people.tsx";
import { PiUserDuotone } from "react-icons/pi";

export default async function Page() {
	const [submissions, winners] = await Promise.all([
		getSubmissions({
			take: 10,
			skip: 0,
			includeUser: true,
			// winnersOnly: true,
		}),
		getWinners({
			take: 10,
			skip: 0,
		}),
	]);

	return (
		<div className="flex h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<div className="flex h-full w-full flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]">
				<div className="flex h-1/2 w-full flex-col gap-4 overflow-hidden transition-all md:h-full md:flex-row lg:w-full">
					{/*<div className="flex h-full w-full flex-col items-center gap-4">*/}
					{/*  <h2 className="text-2xl font-bold">*/}
					{/*    <PiFolderSimpleDuotone className="mb-1 mr-2 inline" />*/}
					{/*    Submissions*/}
					{/*  </h2>*/}
					{/*  <InfiniteSubmissions*/}
					{/*    initial={[...new Array(20).fill(submissions).flat()]}*/}
					{/*  />*/}
					{/*</div>*/}
					<div className="flex h-full w-full flex-col items-center justify-start gap-4">
						<h2 className="text-2xl font-bold">
							<PiUserDuotone className="mb-1 mr-2 inline" />
							People
						</h2>
						<InfinitePeople initial={[...new Array(20).fill(winners).flat()]} />
					</div>
				</div>
			</div>
		</div>
	);
}
