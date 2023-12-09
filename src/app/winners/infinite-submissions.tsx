"use client";

import { getSubmissions } from "@/src/actions/submission.ts";
import { SubmissionEntry } from "@components/submission/submission-list.tsx";
import { Submission } from "@prisma/client";
import { useEffect, useState } from "react";
import { PiCircleDashedDuotone } from "react-icons/pi";
import { useInView } from "react-intersection-observer";

export default function InfiniteSubmissions({
	initial,
}: {
	initial: Submission[];
}) {
	const { ref, inView } = useInView();
	const [submissions, setSubmissions] = useState<Submission[]>(initial);
	const [loading, setLoading] = useState(false);

	const fetchMore = async () => {
		if (loading) return;
		setLoading(true);
		const newSubmissions = await getSubmissions({
			take: 10,
			skip: 0,
			includeUser: true,
			// winnersOnly: true,
		});

		// setSubmissions([...(submissions ?? []), ...newSubmissions]);
		setSubmissions([
			...(submissions ?? []),
			...new Array(20).fill(newSubmissions).flat(),
		]);
	};

	useEffect(() => {
		if (inView) fetchMore().then(() => setLoading(false));
	}, [inView]);

	return (
		<div className="h-full w-full snap-y overflow-y-scroll grid grid-cols-1 md:grid-cols-4 gap-4">
			{submissions?.map((submission) => {
				return (
					<SubmissionEntry
						key={submission.id}
						submission={submission}
						fullWidth
					/>
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
							{submissions?.length ?? 0 > 0
								? "End of the road"
								: "No submissions"}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
