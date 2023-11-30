"use client";

import { getWinners, getWinnersResponse } from "@/src/actions/user.ts";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { PiCircleDashedDuotone, PiTrophyDuotone } from "react-icons/pi";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

export default function InfinitePeople({
	initial,
}: {
	initial: getWinnersResponse[];
}) {
	const { ref, inView } = useInView();
	const [winners, setWinners] = useState<getWinnersResponse[]>(initial);
	const [loading, setLoading] = useState(false);

	const fetchMore = async () => {
		if (loading) return;
		setLoading(true);
		const newWinners = await getWinners({
			take: 10,
			skip: 0,
		});

		setWinners([...(winners ?? []), ...newWinners]);
		// setWinners([...(winners ?? []), ...new Array(20).fill(newWinners).flat()]);
	};

	useEffect(() => {
		if (inView) fetchMore().then(() => setLoading(false));
	}, [inView]);

	return (
		<div className="h-full w-full snap-y overflow-y-scroll grid grid-cols-1 md:grid-cols-2 gap-4">
			{winners?.map((winner) => {
				return (
					<Link
						key={winner.id}
						className="border-normal flex h-fit w-full snap-start items-center justify-between gap-4 rounded-xl bg-white p-4 dark:bg-black"
						href={`/user/${winner.username}`}
					>
						<div className="flex items-center gap-4">
							<Image
								src={
									winner.image ??
									`https://ui-avatars.com/api/?name=${winner.name}`
								}
								width={50}
								height={50}
								className="z-20 rounded-full"
								alt="user image"
							/>
							<span className="text-2xl font-bold">{winner.name}</span>
						</div>
						<span className="text-2xl font-bold">
							{winner.submissions}
							<PiTrophyDuotone className="mb-1 ml-1 inline" />
						</span>
					</Link>
				);
			})}
			<div
				ref={ref}
				className="flex h-fit w-full flex-col items-center justify-center gap-4 md:col-span-2"
			>
				{loading && (
					<PiCircleDashedDuotone className="h-24 w-24 animate-spin" />
				)}
				{!loading && (
					<div className="flex h-full w-full flex-col items-center justify-center gap-4">
						<p className="text-2xl font-bold">
							{" "}
							{winners?.length ?? 0 > 0 ? "End of the road" : "No winners"}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
