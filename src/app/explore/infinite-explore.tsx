'use client';

import { SubmissionEntry } from '@components/submission/submission-list.tsx';
import { PiCircleDashedDuotone } from 'react-icons/pi';
import { useInView } from 'react-intersection-observer';
import { Submission } from '@prisma/client';
import { useEffect, useState } from 'react';
import { getSubmissions } from '@/src/actions/submission.ts';

export default function InfiniteExplore({ taskId }: { taskId: string }) {
	const { ref, inView } = useInView();
	const [submissions, setSubmissions] = useState<Submission[]>();
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

		setSubmissions([...(submissions ?? []), ...newSubmissions]);
	};

	useEffect(() => {
		if (inView) fetchMore().then(() => setLoading(false));
	}, [inView]);

	return (
		<>
			<div className='z-20 flex h-full w-fit flex-col flex-wrap items-start justify-center gap-4 sm:flex-row'>
				{submissions?.map(submission => {
					return <SubmissionEntry submission={submission} />;
				})}
			</div>
			<div
				ref={ref}
				className='flex h-fit w-full flex-col items-center justify-center gap-4'
			>
				{loading && (
					<PiCircleDashedDuotone className='h-24 w-24 animate-spin' />
				)}
				{!loading && (
					<div className='flex h-full w-full flex-col items-center justify-center gap-4'>
						<p className='text-2xl font-bold'>End of the road</p>
					</div>
				)}
			</div>
		</>
	);
}
