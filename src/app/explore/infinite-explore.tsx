"use client";

import { getSubmissions } from "@/src/actions/submission.ts";
import { SubmissionEntry } from "@components/submission-list.tsx";
import { Submission } from "@prisma/client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type Data = Submission & {
	user?: {
		name: string | null;
		image: string | null;
	};
};

type InfiniteExploreProps = {
	taskId: string;
	data?: Data[];
};

export default function InfiniteExplore({ taskId, data }: InfiniteExploreProps) {
	const { ref, inView } = useInView();
	const [submissions, setSubmissions] = useState<Data[]>(data ? data : []);
	const [loading, setLoading] = useState(false);

	const fetchMore = async () => {
		if (loading) return;
		setLoading(true);
		const newSubmissions = await getSubmissions({
			taskId,
			take: 10,
			skip: 0,
			includeUser: true,
		});

		setSubmissions((prev) => [
			...prev,
			...newSubmissions.filter((sub) => !prev.find((prevSub) => prevSub.id === sub.id)),
		]);
	};

	useEffect(() => {
		if (inView) fetchMore().then(() => setLoading(false));
	}, [inView]);

	return (
		<>
			<div className="z-20 flex h-full w-fit flex-col flex-wrap items-start justify-center gap-4 sm:flex-row">
				{submissions?.map((submission) => {
					return <SubmissionEntry submission={submission} key={submission.id} />;
				})}
			</div>
			<div ref={ref} className="flex h-fit w-full flex-col items-center justify-center gap-4">
				{(!submissions || submissions.length === 0) && !loading && (
					<span className="fit-text w-full text-center transition-all">{"Nobody submitted anything"}</span>
				)}
				{submissions && !loading && (
					<div className="flex h-full w-full flex-col items-center justify-center gap-4">
						<p className="text-2xl font-bold opacity-0">End of the road</p>
					</div>
				)}
			</div>
		</>
	);
}
