import { getWinners } from "@/src/actions/user.ts";
import InfinitePeople from "@app/winners/infinite-people.tsx";
import { PiUserDuotone } from "react-icons/pi";

export default async function Page() {
	const winners = await getWinners({
		take: 10,
		skip: 0,
	});

	return (
		<div className="flex h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<div className="flex h-full w-full flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]">
				{winners.length > 0 && (
					<div className="flex w-full flex-wrap gap-4 overflow-hidden transition-all">
						<div className="flex h-full w-full flex-col items-center justify-start gap-4">
							<h2 className="text-2xl font-bold">
								<PiUserDuotone className="mb-1 mr-2 inline" />
								People
							</h2>
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
			</div>
		</div>
	);
}
