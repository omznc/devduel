import { cache } from 'react';
import prisma from '@lib/prisma.ts';

export const getSubmissionCached = cache(async (submissionId: string) => {
	return prisma.submission.findUnique({
		where: {
			id: submissionId,
		},
		include: {
			user: true,
			task: true,
		},
	});
});
