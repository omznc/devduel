import prisma from '@lib/prisma.ts';

export const getCurrentTask = async (includeSubmissions?: number) => {
	const today = new Date();

	return prisma.task.findFirst({
		where: {
			startDate: {
				lte: today,
			},
			endDate: {
				gte: today,
			},
		},
		include: {
			submissions: {
				take: includeSubmissions ?? 0,
				orderBy: {
					createdAt: 'desc',
				},
			},
		},
	});
};
