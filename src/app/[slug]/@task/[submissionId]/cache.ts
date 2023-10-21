import prisma from '@/src/lib/prisma.ts';
import { cache } from 'react';

export const getSubmission = cache(
	async (taskId: string, submissionId: string) => {
		return await prisma.submission.findUnique({
			where: {
				id: submissionId,
				taskId: taskId,
			},
			include: {
				user: true,
				task: true,
			},
		});
	}
);
