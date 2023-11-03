import prisma from '@lib/prisma.ts';

export const getCurrentTask = async (includeSubmissions?: number) => {
	const today = new Date();
	const day = today.getDay();

	// a valid task is one that has a start date before today and an end date after today
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
